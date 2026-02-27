import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// types
import { Transfer, TransferFormData, TransferDealer, VehicleSearchResult } from 'types/transfer';

// ==============================|| API - TRANSFER ||============================== //

const endpoints = {
  key: 'transfers',
  list: '', // GET /api/transfers
  detail: (id: number) => `/${id}`, // GET /api/transfers/:id
  dealers: '/dealers', // GET /api/transfers/dealers
  searchVehicles: '/search-vehicles', // GET /api/transfers/search-vehicles
  create: '', // POST /api/transfers
  update: (id: number) => `/${id}`, // PUT /api/transfers/:id
  delete: (id: number) => `/${id}` // DELETE /api/transfers/:id
};

// ==============================|| GET ALL TRANSFERS ||============================== //

export function useGetTransfers() {
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
      transfers: (data?.transfers || []) as Transfer[],
      transfersLoading: isLoading,
      transfersError: error,
      transfersValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SINGLE TRANSFER ||============================== //

export function useGetTransfer(id: number) {
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
      transfer: data?.transfer as Transfer | undefined,
      transferLoading: isLoading,
      transferError: error,
      transferValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET DEALERS ||============================== //

export function useGetDealers() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.dealers,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      dealers: (data?.dealers || []) as TransferDealer[],
      dealersLoading: isLoading,
      dealersError: error,
      dealersValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| CREATE TRANSFER ||============================== //

export async function createTransfer(transferData: TransferFormData) {
  try {
    const response = await axiosServices.post(
      endpoints.key + endpoints.create,
      transferData
    );

    // Revalidate the list after creation
    await mutate(endpoints.key + endpoints.list);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    
    let errorMessage = 'Failed to create transfer';
    
    if (error.response?.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.messages) {
        const messages = Object.values(error.response.data.messages).flat();
        errorMessage = messages.join(', ');
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// ==============================|| UPDATE TRANSFER ||============================== //

export async function updateTransfer(id: number, transferData: TransferFormData) {
  try {
    const response = await axiosServices.put(
      endpoints.key + endpoints.update(id),
      transferData
    );

    // Revalidate the list and detail after update
    await Promise.all([
      mutate(endpoints.key + endpoints.list),
      mutate(endpoints.key + endpoints.detail(id))
    ]);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating transfer:', error);
    
    let errorMessage = 'Failed to update transfer';
    
    if (error.response?.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// ==============================|| DELETE TRANSFER ||============================== //

export async function deleteTransfer(id: number) {
  try {
    await axiosServices.delete(endpoints.key + endpoints.delete(id));

    // Revalidate the list after deletion
    await mutate(endpoints.key + endpoints.list);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting transfer:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete transfer'
    };
  }
}

// ==============================|| SEARCH VEHICLES FOR TRANSFER ||============================== //

export async function searchVehiclesForTransfer(query: string): Promise<VehicleSearchResult[]> {
  if (!query || query.length < 1) {
    return [];
  }

  try {
    // Reuse the search from car-purchases
    const response = await axiosServices.get('/car-purchases/search-vehicles', {
      params: { q: query }
    });
    return response.data.vehicles || [];
  } catch (error) {
    console.error('Error searching vehicles:', error);
    return [];
  }
}

// ==============================|| GET VEHICLE DETAILS FOR TRANSFER ||============================== //

export async function getVehicleDetailsForTransfer(vehicleId: number) {
  try {
    const response = await axiosServices.get(`/car-purchases/vehicle/${vehicleId}`);
    return { success: true, data: response.data.vehicle };
  } catch (error: any) {
    console.error('Error getting vehicle details:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get vehicle details'
    };
  }
}
