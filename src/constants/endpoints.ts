const BASE_URL = 'https://api.traveldrago.com/api/v1';
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
  USER_INFO: `${BASE_URL}/me`, // Endpoint to get current user details
  USER_UPDATE: `${BASE_URL}/me/update`, // Endpoint to update current user details
  USER_DELETE: `${BASE_URL}/me/delete`, // Endpoint to delete current user account
};
