import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography } from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntent: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4">Pay for Your Event</Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <CardElement />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!stripe || isProcessing}
          sx={{ marginTop: 2 }}
        >
          {isProcessing ? 'Processing...' : 'Pay'}
        </Button>
      </form>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Box>
  );
};

const StripePayment: React.FC<{ clientSecret: string; onPaymentSuccess: (paymentIntent: any) => void }> = ({
  clientSecret,
  onPaymentSuccess,
}) => (
  <Elements stripe={stripePromise}>
    <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
  </Elements>
);

export default StripePayment;
