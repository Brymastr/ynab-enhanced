import axios, { AxiosResponse } from 'axios';

async function post<T>(url: string): Promise<AxiosResponse<T>> {
  const baseConfig = {
    baseURL: `${process.env.VUE_APP_API}/auth`,
  };
  const session = axios.create(baseConfig);
  return session.post<T>(url);
}

export async function verifySession(sessionToken: string) {
  const response = await post<{ valid: boolean }>(`/verify/${sessionToken}`);
  return response.data.valid;
}
