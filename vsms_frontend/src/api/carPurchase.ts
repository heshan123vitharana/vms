import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// types
import { CarPurchase, CarPurchaseFormData, Branch, VehicleSearchResult } from 'types/carPurchase';

// ==============================|| API - CAR PURCHASE ||============================== //

const endpoints = {
  key: 'car-purchases',
  list: '', // GET /api/car-purchases
  detail: (id: number) => `/${id}`, // GET /api/car-purchases/:id
  searchVehicles: '/search-vehicles', // GET /api/car-purchases/search-vehicles
  vehicleDetails: (id: number) => `/vehicle/${id}`, // GET /api/car-purchases/vehicle/:id
  branches: '/branches', // GET /api/car-purchases/branches
  paymentMethods: '/payment-methods', // GET /api/car-purchases/payment-methods
  create: '', // POST /api/car-purchases
  update: (id: number) => `/${id}`, // PUT /api/car-purchases/:id
  delete: (id: number) => `/${id}` // DELETE /api/car-purchases/:id
};

// ==============================|| GET ALL CAR PURCHASES ||============================== //

export function useGetCarPurchases() {
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
      purchases: (data?.purchases || []) as CarPurchase[],
      purchasesLoading: isLoading,
      purchasesError: error,
      purchasesValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SINGLE CAR PURCHASE ||============================== //

export function useGetCarPurchase(id: number) {
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
      purchase: data?.purchase as CarPurchase | undefined,
      purchaseLoading: isLoading,
      purchaseError: error,
      purchaseValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| SEARCH VEHICLES BY CODE ||============================== //

export async function searchVehicles(query: string): Promise<VehicleSearchResult[]> {
  if (!query || query.length < 1) {
    return [];
  }

  try {
    const response = await axiosServices.get(
      endpoints.key + endpoints.searchVehicles,
      { params: { q: query } }
    );
    return response.data.vehicles || [];
  } catch (error) {
    console.error('Error searching vehicles:', error);
    return [];
  }
}

// ==============================|| GET VEHICLE DETAILS ||============================== //

export async function getVehicleDetails(vehicleId: number) {
  try {
    const response = await axiosServices.get(
      endpoints.key + endpoints.vehicleDetails(vehicleId)
    );
    return { success: true, data: response.data.vehicle };
  } catch (error: any) {
    console.error('Error getting vehicle details:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get vehicle details'
    };
  }
}

// ==============================|| GET BRANCHES ||============================== //

export function useGetBranches() {
  // Custom fetcher: try car-purchases/branches first, fallback to /dealers
  const fetchBranches = async () => {
    try {
      const res = await axiosServices.get(endpoints.key + endpoints.branches);
      const branches = res.data?.branches || [];
      if (branches.length > 0) return { branches };

      // fallback to dealers endpoint
      const dealersRes = await axiosServices.get('/dealers');
      // dealer endpoint may return { success: true, data: [...] } or the raw array
      const dealersPayload = dealersRes.data;
      const dealersArray = Array.isArray(dealersPayload)
        ? dealersPayload
        : dealersPayload?.data || dealersPayload?.dealers || [];
      // normalize to Branch shape
      return { branches: (dealersArray || []).map((d: any) => ({ id: d.id, name: d.name, address: d.address })) };
    } catch (err) {
      console.error('Error fetching branches, fallback failed:', err);
      return { branches: [] };
    }
  };

  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.branches,
    fetchBranches,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      branches: (data?.branches || []) as Branch[],
      branchesLoading: isLoading,
      branchesError: error,
      branchesValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET PAYMENT METHODS ||============================== //

export function useGetPaymentMethods() {
  const fetchPaymentMethods = async () => {
    try {
      const res = await axiosServices.get(endpoints.key + endpoints.paymentMethods);
      // endpoint may return { paymentMethods: [...] } or { success: true, data: [...] }
      const payload = res.data;
      const methods = payload?.paymentMethods || payload?.data || payload || [];
      if (methods.length > 0) return { paymentMethods: methods };

      // fallback: provide common default payment methods
      return {
        paymentMethods: [
          { id: 1, name: 'Cash' },
          { id: 2, name: 'Bank Transfer' },
          { id: 3, name: 'Credit Card' }
        ]
      };
    } catch (err) {
      console.error('Error fetching payment methods, returning defaults:', err);
      return {
        paymentMethods: [
          { id: 1, name: 'Cash' },
          { id: 2, name: 'Bank Transfer' },
          { id: 3, name: 'Credit Card' }
        ]
      };
    }
  };

  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.paymentMethods,
    fetchPaymentMethods,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      paymentMethods: (data?.paymentMethods || []) as { id: number; name: string }[],
      paymentMethodsLoading: isLoading,
      paymentMethodsError: error,
      paymentMethodsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| CREATE CAR PURCHASE ||============================== //

export async function createCarPurchase(purchaseData: CarPurchaseFormData) {
  try {
    const formData = new FormData();

    // Add general details
    formData.append('vehicle_id', purchaseData.vehicle_id.toString());
    formData.append('purchase_date', purchaseData.purchase_date);
    formData.append('branch', purchaseData.branch || '');
    formData.append('purchase_price', purchaseData.purchase_price.toString());
    formData.append('payment_method_id', purchaseData.payment_method_id.toString());
    formData.append('invoice_number', purchaseData.invoice_number);
    formData.append('tax_details', purchaseData.tax_details || '');

    // Add seller details
    formData.append('seller_name', purchaseData.seller_name);
    formData.append('seller_address', purchaseData.seller_address);
    formData.append('seller_phone', purchaseData.seller_phone);
    
    if (purchaseData.seller_email) {
      formData.append('seller_email', purchaseData.seller_email);
    }
    if (purchaseData.seller_nic) {
      formData.append('seller_nic', purchaseData.seller_nic);
    }
    if (purchaseData.seller_type) {
      formData.append('seller_type', purchaseData.seller_type);
    }

    // Add document if provided
    if (purchaseData.document) {
      formData.append('document', purchaseData.document);
    }

    // Note: Don't set Content-Type manually - axios automatically sets it with proper boundary for FormData
    const response = await axiosServices.post(
      endpoints.key + endpoints.create,
      formData
    );

    // Revalidate the list after creation
    await mutate(endpoints.key + endpoints.list);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error creating car purchase:', error);
    
    let errorMessage = 'Failed to create car purchase';
    
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

// ==============================|| UPDATE CAR PURCHASE ||============================== //

export async function updateCarPurchase(id: number, purchaseData: CarPurchaseFormData) {
  try {
    const formData = new FormData();

    // Add general details
    formData.append('vehicle_id', purchaseData.vehicle_id.toString());
    formData.append('purchase_date', purchaseData.purchase_date);
    formData.append('branch', purchaseData.branch || '');
    formData.append('purchase_price', purchaseData.purchase_price.toString());
    formData.append('payment_method_id', purchaseData.payment_method_id.toString());
    formData.append('invoice_number', purchaseData.invoice_number);
    formData.append('tax_details', purchaseData.tax_details || '');

    // Add seller details
    formData.append('seller_name', purchaseData.seller_name);
    formData.append('seller_address', purchaseData.seller_address);
    formData.append('seller_phone', purchaseData.seller_phone);
    
    if (purchaseData.seller_email) {
      formData.append('seller_email', purchaseData.seller_email);
    }
    if (purchaseData.seller_nic) {
      formData.append('seller_nic', purchaseData.seller_nic);
    }
    if (purchaseData.seller_type) {
      formData.append('seller_type', purchaseData.seller_type);
    }

    // Add document if provided
    if (purchaseData.document) {
      formData.append('document', purchaseData.document);
    }

    // Note: Don't set Content-Type manually - axios automatically sets it with proper boundary for FormData
    const response = await axiosServices.post(
      endpoints.key + endpoints.update(id),
      formData
    );

    // Revalidate the list and detail after update
    await Promise.all([
      mutate(endpoints.key + endpoints.list),
      mutate(endpoints.key + endpoints.detail(id))
    ]);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating car purchase:', error);
    
    let errorMessage = 'Failed to update car purchase';
    
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

// ==============================|| DELETE CAR PURCHASE ||============================== //

export async function deleteCarPurchase(id: number) {
  try {
    await axiosServices.delete(endpoints.key + endpoints.delete(id));

    // Revalidate the list after deletion
    await mutate(endpoints.key + endpoints.list);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting car purchase:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete car purchase'
    };
  }
}
