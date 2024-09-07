const BASE_URL = 'http://localhost:8080/api/v1';
// https://api.traveldrago.com/api/v1
// http://localhost:8080/api/v1

export const ENDPOINTS = {
  ECHO: {
    GET_ONE: `${BASE_URL}/echo`,
  },
  LOGIN: {
    POST: `${BASE_URL}/login`,
  },
  SIGNUP: {
    POST: `${BASE_URL}/register`,
  },
  VERIFY_CODE: {
    POST: `${BASE_URL}/confirm`
  },
  VERIFY_EMAIL_CODE: {
    POST: `${BASE_URL}/me/verify-email`, // Endpoint for verifying email after update
  },
  USER_INFO: `${BASE_URL}/me`, // Endpoint to get current user details
  USER_UPDATE: `${BASE_URL}/me/update`, // Endpoint to update current user details
  USER_DELETE: `${BASE_URL}/me/delete`, // Endpoint to delete current user account
  EVENTS: {
    CREATE: `${BASE_URL}/me/events`, // Create a new event
    GET_BY_ID: (eventId: string) => `${BASE_URL}/events/${eventId}`, // Get event by ID
    UPDATE: (eventId: string) => `${BASE_URL}/events/${eventId}`, // Update event by ID
    DELETE: (eventId: string) => `${BASE_URL}/events/${eventId}`, // Delete event by ID
    PUBLIC_EVENTS: `${BASE_URL}/events/public`, // Get public events
    SEARCH: `${BASE_URL}/events/search`, // Search events
    INVITED: `${BASE_URL}/events/invited`, // Get events the user is invited to
    INVITE_USER: `${BASE_URL}/events/invite`, // Invite user to event
    ACCEPT_INVITATION: `${BASE_URL}/invitations/accept`, // Accept event invitation
    REJECT_INVITATION: `${BASE_URL}/invitations/reject`, // Reject event invitation
    GET_USER_INVITATIONS: `${BASE_URL}/invitations`, // Get invitations for the user
  },
};
