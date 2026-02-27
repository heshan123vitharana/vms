import axios, { AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosServices = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

/**
 * Request interceptor to add Authorization token to request
 */
axiosServices.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Better error logging
    const errorLog: any = {
      timestamp: new Date().toISOString(),
      message: error?.message || 'Unknown error',
      name: error?.name,
      code: error?.code,
      stack: error?.stack?.split('\n').slice(0, 3).join('\n')
    };

    // Add response details if available
    if (error?.response) {
      errorLog.response = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      };
    }

    // Add request details if available
    if (error?.config) {
      errorLog.request = {
        url: error.config.url,
        method: error.config.method?.toUpperCase(),
        baseURL: error.config.baseURL,
        headers: error.config.headers,
        data: error.config.data ? JSON.parse(JSON.stringify(error.config.data)) : undefined
      };
    }

    // Log as string to ensure it shows up
    console.error('Axios interceptor error:', JSON.stringify(errorLog, null, 2));
    console.error('Raw error object:', error);
    
    if (typeof window !== 'undefined' && error.response?.status === 401 && !window.location.href.includes('/login')) {
      await signOut();
      window.location.pathname = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const res = await axiosServices.get(url, { ...config });
    return res.data;
  } catch (error: any) {
    console.error('Fetcher error:', {
      url,
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      code: error?.code
    });
    throw error;
  }
};
