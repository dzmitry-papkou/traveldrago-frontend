const BASE_URL = 'https://api.traveldrago.com/api/v1';
// const BASE_URL = 'http://localhost:8080/api/v1';

export const ENDPOINTS = {
  BASE_URL: `${BASE_URL}`,
  ECHO: {
    GET_ONE: `${BASE_URL}/echo`,
  },
  LOCATION: {
    GET_BY_IP: `${BASE_URL}/nearby`,
  },
  LOGIN: {
    POST: `${BASE_URL}/login`,
  },
  SIGNUP: {
    POST: `${BASE_URL}/register`,
  },
  VERIFY_CODE: {
    POST: `${BASE_URL}/confirm`,
  },
  VERIFY_EMAIL_CODE: {
    POST: `${BASE_URL}/me/verify-email`,
  },
  USER_INFO: `${BASE_URL}/me`,
  USER_UPDATE: `${BASE_URL}/me/update`,
  USER_DELETE: `${BASE_URL}/me/delete`,
  EVENTS: {
    CREATE: `${BASE_URL}/me/events`,
    GET_BY_ID: (eventId: string) => `${BASE_URL}/events/${eventId}`,
    UPDATE: (eventId: string) => `${BASE_URL}/events/${eventId}`,
    DELETE: (eventId: string) => `${BASE_URL}/events/${eventId}`,
    PUBLIC_EVENTS: `${BASE_URL}/events/public`,
    SEARCH: `${BASE_URL}/events/search`,
    INVITED: `${BASE_URL}/events/invited`,
    INVITE_USER: `${BASE_URL}/events/invite`,
    ACCEPT_INVITATION: `${BASE_URL}/invitations/accept`,
    REJECT_INVITATION: `${BASE_URL}/invitations/reject`,
    GET_USER_INVITATIONS: `${BASE_URL}/invitations`,
    REGISTER: (eventId: string) => `${BASE_URL}/events/${eventId}/register`,
    UNREGISTER: (eventId: string) => `${BASE_URL}/events/${eventId}/unregister`,
    CHECK_REGISTRATION: (eventId: string) => `${BASE_URL}/events/${eventId}/check-registration`,
    MY_REGISTRATIONS: `${BASE_URL}/my-registrations`,
    GET_REGISTRATION_FIELDS: (eventId: string) => `${BASE_URL}/events/${eventId}/registration-fields`,
    GET_TICKET: (eventId: string) => `${BASE_URL}/events/${eventId}/ticket`,
  },
  CATEGORIES: {
    POPULAR: `${BASE_URL}/categories/popular`,
    CATEGORY_EVENTS: `${BASE_URL}/categories/:name/events`,
    ALL: `${BASE_URL}/categories`,
  },
  RECOMMENDATIONS: {
    USER: `${BASE_URL}/recommendations/user`,
    GUEST: `${BASE_URL}/recommendations/guest`,
  },
  IMAGES: {
    UPLOAD_IMAGE: (eventId: string) => `${BASE_URL}/images/${eventId}`,
    UPLOAD_IMAGES_BATCH: (eventId: string) => `${BASE_URL}/images/${eventId}/batch`,
    GET_IMAGE_BY_ID: (imageId: string, includePrivate: boolean) =>
      `${BASE_URL}/images/${imageId}?includePrivate=${includePrivate}`,
    LIST_IMAGES_FOR_EVENT: (eventId: string, includePrivate: boolean) =>
      `${BASE_URL}/images/event/${eventId}?includePrivate=${includePrivate}`,
    DELETE_IMAGE: (imageId: string) => `${BASE_URL}/images/${imageId}`,
    UPDATE_IMAGE_PRIVACY: (imageId: string) => `${BASE_URL}/images/${imageId}/privacy`,
  },
  PAYMENT: {
    CREATE_PAYMENT_INTENT: `${BASE_URL}/payment/create-payment-intent`,
  },
};
