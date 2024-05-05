import { useState } from 'react';
import apiService, { Query } from '../services/apiService';
import { HTTP_METHODS } from '../constants/http';
import queryService from '../services/queryService';

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
      });

      if ('message' in response) {
        setErrors([response.message]);
      } else {
        const mappedData = mapper(response.data);
        setData(mappedData);
        onSuccess(mappedData);
      }
    } catch (error) {
      setErrors([error as string]);
    }

    setIsLoading(false);
  };

  const sendData = async (values?: Query) => {
    setIsLoading(true);
    const sanitizedValues = values ? queryService.sanitize(values) : undefined;
    try {
      const response = await apiService.makeRequestAsync<T>({
        url,
        queryParams: id ? { id } : undefined,
        body: sanitizedValues,
        httpMethod: httpMethod || HTTP_METHODS.POST,
      });
      if ('message' in response) {
        setErrors([response.message]);
      } else {
        onSuccess(response.data);
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
