import useSWR from 'swr';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface Dealer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tenant_id: number;
  status: string;
}

export interface DealersResponse {
  success: boolean;
  data: Dealer[];
}

// Fetcher function
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

/**
 * Hook to fetch all active dealers
 */
export function useGetDealers() {
  const { data, error, isLoading, mutate } = useSWR<DealersResponse>(`${API_URL}/dealers`, fetcher);

  return {
    dealers: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}

/**
 * Hook to fetch all dealers (including inactive)
 */
export function useGetAllDealers() {
  const { data, error, isLoading, mutate } = useSWR<DealersResponse>(`${API_URL}/dealers/all`, fetcher);

  return {
    dealers: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}
