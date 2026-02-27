import { useMemo } from 'react';

// third-party
import useSWR from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// types
import { Sale, SalesStatistics } from 'types/sales';

// ==============================|| API - SALES ||============================== //

const endpoints = {
  key: 'sales',
  list: '', // GET /api/sales
  detail: (id: number) => `/${id}`, // GET /api/sales/:id
  statistics: '/statistics' // GET /api/sales/statistics
};

// ==============================|| GET ALL SALES ||============================== //

export function useGetSales() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.list,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      sales: (data?.sales || []) as Sale[],
      salesLoading: isLoading,
      salesError: error,
      salesValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SINGLE SALE ||============================== //

export function useGetSale(id: number) {
  const { data, isLoading, error, isValidating } = useSWR(
    id ? endpoints.key + endpoints.detail(id) : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      sale: data?.sale as Sale | undefined,
      saleLoading: isLoading,
      saleError: error,
      saleValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SALES STATISTICS ||============================== //

export function useGetSalesStatistics() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.statistics,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      statistics: data?.statistics as SalesStatistics | undefined,
      statisticsLoading: isLoading,
      statisticsError: error,
      statisticsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
