import React from 'react';
import { AxiosResponse } from 'axios';

interface UseFetchParams {
  token: string;
  method: (t: string) => Promise<AxiosResponse>;
  setter: React.Dispatch<React.SetStateAction<any>>;
}

export const useFetch = ({ token, method, setter }: UseFetchParams): void => {
  React.useEffect(() => {
    method(token)
      .then((r) => {
        setter(r?.data);
      })
      .catch((e) => {
        console.error('Error in fetch', e?.response?.data || e);
      });
  }, [token]);
};
