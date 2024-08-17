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
}

export type ApiResponse<T> = {
    data: T;
    status: number;
}

const getErrorMessages = (error: AxiosError): string => {
    if(!error.response) {
        return 'Network Error';
    }

    return error.message;
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
} : RequestParams): Promise<ApiResponse<T> | ErrorResponse> => {

    const request: AxiosRequestConfig = {
        url,
        method: httpMethod,
        params: queryParams,
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
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

