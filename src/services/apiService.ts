import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { HTTP_METHODS } from '../constants/http';

export type ErrorResponse = {
  status: number;
  message: string;
  exception: AxiosError;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
};

export type Query = {
  [key: string]: string | number | boolean | any;
};

type RequestParams = {
  url: string;
  httpMethod: string;
  queryParams?: Query;
  body?: any;
  authToken?: string;
  includeTokenInBody?: boolean;
  responseType?: AxiosRequestConfig['responseType'];
  headers?: Record<string, string>;
};

const getErrorMessages = (error: AxiosError): string => {
  if (!error.response) {
    return 'Network Error';
  }

  if (error.response.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  return error.message || 'An unknown error occurred';
};

const createErrorResponse = (error: AxiosError): ErrorResponse => {
  return {
    status: error.response?.status || 500,
    message: getErrorMessages(error),
    exception: error,
  };
};

const makeRequestAsync = async <T>({
  url,
  httpMethod,
  queryParams,
  body,
  authToken,
  includeTokenInBody = false,
  responseType = 'json',
  headers = {},
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse> => {
  if (authToken && !includeTokenInBody) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const requestBody = includeTokenInBody ? { ...body, jwtToken: authToken } : body;

  const request: AxiosRequestConfig = {
    url,
    method: httpMethod,
    params: queryParams,
    data: requestBody,
    headers,
    responseType,
  };

  try {
    const response: AxiosResponse<T> = await axios(request);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return createErrorResponse(error as AxiosError);
  }
};

const isApiResponse = <T>(response: ApiResponse<T> | ErrorResponse): response is ApiResponse<T> => {
  return (response as ApiResponse<T>).data !== undefined;
};

const uploadEventImages = async (
  eventId: string,
  images: File[],
  isPrivate: boolean,
  authToken: string,
): Promise<ApiResponse<{ message: string }> | ErrorResponse> => {
  const formData = new FormData();
  images.forEach(image => formData.append('images', image));
  formData.append('isPrivate', String(isPrivate));

  return makeRequestAsync({
    url: ENDPOINTS.IMAGES.UPLOAD_IMAGES_BATCH(eventId),
    httpMethod: HTTP_METHODS.POST,
    body: formData,
    authToken,
  });
};

const fetchEventImageIds = async (
  eventId: string,
  authToken: string,
): Promise<ApiResponse<{ id: string }[]> | ErrorResponse> => {
  return makeRequestAsync({
    url: ENDPOINTS.IMAGES.LIST_IMAGES_FOR_EVENT(eventId, false),
    httpMethod: HTTP_METHODS.GET,
    authToken,
  });
};

const fetchImageById = async (
  imageId: string,
  authToken: string,
): Promise<ApiResponse<ArrayBuffer> | ErrorResponse> => {
  return makeRequestAsync({
    url: ENDPOINTS.IMAGES.GET_IMAGE_BY_ID(imageId, true),
    httpMethod: HTTP_METHODS.GET,
    authToken,
    responseType: 'arraybuffer',
  });
};

const deleteEvent = async (eventId: string, token: string) => {
  return await makeRequestAsync({
    url: ENDPOINTS.EVENTS.DELETE(eventId),
    httpMethod: HTTP_METHODS.DELETE,
    authToken: token,
  });
};

const loginUser = async (
  username: string,
  password: string,
): Promise<ApiResponse<{ token: string }> | ErrorResponse> => {
  return makeRequestAsync<{ token: string }>({
    url: ENDPOINTS.SIGNUP.POST,
    httpMethod: HTTP_METHODS.POST,
    body: { username, password },
  });
};

const apiService = {
  createErrorResponse,
  makeRequestAsync,
  isApiResponse,
  loginUser,
  deleteEvent,
  fetchEventImageIds,
  fetchImageById,
  uploadEventImages,
};

export default apiService;
