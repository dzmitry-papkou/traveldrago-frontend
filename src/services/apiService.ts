import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

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

const apiService = {
    createErrorResponse,
    makeRequestAsync,
};

export default apiService;
