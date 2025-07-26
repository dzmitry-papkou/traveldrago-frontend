import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { ENDPOINTS } from '../../constants/endpoints';
import apiService from '../../services/apiService';
import { useUser } from '../../context/UserContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

const PaymentForm: React.FC<{
  eventId: string;
  price: number;
  fieldValues?: Record<string, string>;
  registrationFields?: any[];
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}> = ({ eventId, price, fieldValues = {}, registrationFields = [], onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await apiService.makeRequestAsync<{ clientSecret: string }>({
        url: `${ENDPOINTS.PAYMENT.CREATE_PAYMENT_INTENT}/${eventId}`,
        httpMethod: 'POST',
        authToken: user?.idToken,
        body: {
          fieldValues: registrationFields.map((field) => ({
            eventRegistrationFieldId: field.id,
            fieldValue: fieldValues[field.fieldName] || '',
          })),
        },
      });

      if ('data' in response) {
        const { clientSecret } = response.data;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card details are missing');
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) {
          throw new Error(error.message || 'Payment failed');
        }

        if (paymentIntent?.status === 'succeeded') {
          onPaymentSuccess();
        } else {
          throw new Error('Payment did not complete successfully.');
        }
      } else {
        throw new Error(response?.message || 'Error creating payment intent');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      onPaymentFailure();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <CardElement
        options={{
          style: {
            base: { fontSize: '16px', color: '#424770' },
            invalid: { color: '#9e2146' },
          },
        }}
      />
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={isProcessing}
        sx={{ mt: 2 }}
      >
        {isProcessing ? <CircularProgress size={24} /> : `Pay $${price.toFixed(2)}`}
      </Button>
    </Box>
  );
};

const PaymentComponent: React.FC<{
  eventId: string;
  price: number;
  fieldValues?: Record<string, string>;
  registrationFields?: any[];
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}> = ({ eventId, price, fieldValues, registrationFields, onPaymentSuccess, onPaymentFailure }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        eventId={eventId}
        price={price}
        fieldValues={fieldValues}
        registrationFields={registrationFields}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentFailure={onPaymentFailure}
      />
    </Elements>
  );
};

export default PaymentComponent;
