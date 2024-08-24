import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { HTTP_METHODS } from "../constants/http";

export type ErrorResponse = {
    status: number;
    message: string;
    exception: AxiosError;
}

export type Query = {
    [key: string]: string | number | boolean | any;
}

type RequestParams = {
    url: string;
    httpMethod: string;
    queryParams?: Query;
    body?: any;
    authToken?: string;
    includeTokenInBody?: boolean;
}

export type ApiResponse<T> = {
    data: T;
    status: number;
}

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
        exception: error
    };
};

const makeRequestAsync = async <T>({
    url,
    httpMethod,
    queryParams,
    body,
    authToken,
    includeTokenInBody = false,
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse> => {

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (authToken && !includeTokenInBody) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const requestBody = includeTokenInBody
        ? { ...body, jwtToken: authToken }
        : body;

    const request: AxiosRequestConfig = {
        url,
        method: httpMethod,
        params: queryParams,
        data: requestBody,
        headers,
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

// Function to handle user login
const loginUser = async (username: string, password: string): Promise<ApiResponse<{ token: string }> | ErrorResponse> => {
    return makeRequestAsync<{ token: string }>({
        url: ENDPOINTS.ECHO.GET_ONE,
        httpMethod: HTTP_METHODS.GET,
        body: { username, password }
    });
};

const apiService = {
    createErrorResponse,
    makeRequestAsync,
    loginUser, // Expose the loginUser function
};

export default apiService;
