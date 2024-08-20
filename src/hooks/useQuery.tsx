import { useState } from 'react';
import apiService, { Query, ErrorResponse, ApiResponse } from '../services/apiService';
import { HTTP_METHODS } from '../constants/http';
import queryService from '../services/queryService';
import { useUser } from '../context/UserContext';

type UseQueryArguments<T> = {
  url: string;
  queryParams?: Query;
  httpMethod?: string;
  id?: number;
  mapper?: (data: any) => T;
  onSuccess?: (data: T) => void;
};

export default function useQuery<T>({
  url,
  id,
  httpMethod,
  queryParams,
  mapper = data => data as T,
  onSuccess = () => { },
}: UseQueryArguments<T>) {
  if (!url) {
    throw new Error('URL is required');
  }

  const { user } = useUser();  // Get the user token from context
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.makeRequestAsync<T>({
        url,
        httpMethod: HTTP_METHODS.GET,
        queryParams,
        authToken: user?.token,
      });

      if ((response as ErrorResponse).exception) {
        setErrors([(response as ErrorResponse).message]);
      } else {
        const mappedData = mapper((response as ApiResponse<T>).data);
        setData(mappedData);
        onSuccess(mappedData);
      }
    } catch (error) {
      setErrors([error as string]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendData = async (values?: Query, method?: string, customUrl?: string) => {
    setIsLoading(true);
    const sanitizedValues = values ? queryService.sanitize(values) : undefined;
    try {
      const response = await apiService.makeRequestAsync<T>({
        url: customUrl || url,
        queryParams: id ? { id } : undefined,
        body: sanitizedValues,
        httpMethod: method || httpMethod || HTTP_METHODS.POST,
        authToken: user?.token,
      });

      if ((response as ErrorResponse).exception) {
        setErrors([(response as ErrorResponse).message]);
      } else {
        const mappedData = mapper((response as ApiResponse<T>).data);
        setData(mappedData);
        onSuccess(mappedData);
        return response;
      }
    } catch (error) {
      setErrors([error as string]);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return {
    data,
    isLoading,
    errors,
    setData,
    getData,
    sendData,
  };
}
