import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// types
import { Vehicle } from 'types/vehicle';

// ==============================|| API - VEHICLE ||============================== //

const endpoints = {
  key: 'vehicles',
  list: '', // GET /api/vehicles
  detail: (id: number) => `/${id}`, // GET /api/vehicles/:id (admin - full data)
  create: '', // POST /api/vehicles
  update: (id: number) => `/${id}`, // PUT /api/vehicles/:id
  delete: (id: number) => `/${id}` // DELETE /api/vehicles/:id
};

// ==============================|| GET ALL VEHICLES ||============================== //

export function useGetVehicles(includeAllStatuses: boolean = false) {
  const url = includeAllStatuses 
    ? `${endpoints.key}${endpoints.list}?status=all`
    : `${endpoints.key}${endpoints.list}`;
    
  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
      dedupingInterval: 60000,
      onError: (err) => {
        console.error('Failed to fetch vehicles:', err);
      }
    }
  );

  const memoizedValue = useMemo(
    () => ({
      vehicles: (data?.vehicles || []) as Vehicle[],
      vehiclesLoading: isLoading,
      vehiclesError: error,
      vehiclesValidating: isValidating,
      vehiclesEmpty: !isLoading && !data?.vehicles?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SINGLE VEHICLE (PUBLIC - LIMITED DATA) ||============================== //

export function useGetPublicVehicle(id: number) {
  const { data, isLoading, error, isValidating } = useSWR(
    id ? `vehicles/public/${id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      vehicle: data?.vehicle as Vehicle | undefined,
      vehicleLoading: isLoading,
      vehicleError: error,
      vehicleValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| GET SINGLE VEHICLE (ADMIN - FULL DATA) ||============================== //

export function useGetVehicle(id: number) {
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
      vehicle: data?.vehicle as Vehicle | undefined,
      vehicleLoading: isLoading,
      vehicleError: error,
      vehicleValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| CREATE VEHICLE ||============================== //

export async function createVehicle(vehicleData: Partial<Vehicle>) {
  try {
    console.log('=== CREATE VEHICLE START ===');
    console.log('Vehicle data to send:', JSON.stringify(vehicleData, null, 2));
    console.log('Endpoint:', endpoints.key + endpoints.create);
    console.log('Full URL:', axiosServices.defaults.baseURL + '/' + endpoints.key + endpoints.create);
    console.log('Base URL from axios:', axiosServices.defaults.baseURL);
    
    const response = await axiosServices.post(endpoints.key + endpoints.create, vehicleData);
    
    console.log('=== CREATE VEHICLE SUCCESS ===');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Revalidate the list after creation to refresh cache
    await mutate(endpoints.key + endpoints.list);
    
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('=== CREATE VEHICLE ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    console.error('Error keys:', Object.keys(error || {}));
    
    // Try to serialize the error in different ways
    try {
      console.error('Error JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } catch (e) {
      console.error('Could not stringify error');
    }
    
    console.error('Error details:', {
      message: error?.message || 'No message',
      code: error?.code || 'No code',
      status: error?.response?.status || 'No status',
      statusText: error?.response?.statusText || 'No statusText',
      responseData: error?.response?.data || 'No response data',
      isAxiosError: error?.isAxiosError,
      config: error?.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        timeout: error.config.timeout
      } : 'No config'
    });
    
    // Extract error message
    let errorMessage = 'Failed to create vehicle';
    
    if (error?.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.messages) {
        // Validation errors
        const messages = Object.values(error.response.data.messages).flat();
        errorMessage = messages.join(', ');
      }
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.code === 'ERR_NETWORK') {
      errorMessage = 'Network error: Unable to connect to the server. Please make sure the backend is running.';
    } else if (!error) {
      errorMessage = 'Unknown error: error object is null or undefined';
    }
    
    console.error('Final error message:', errorMessage);
    console.error('=== CREATE VEHICLE ERROR END ===');
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==============================|| UPDATE VEHICLE ||============================== //

export async function updateVehicle(id: number, vehicleData: Partial<Vehicle>) {
  try {
    const response = await axiosServices.put(
      endpoints.key + endpoints.update(id),
      vehicleData
    );
    
    // Revalidate the list and detail after update
    await Promise.all([
      mutate(endpoints.key + endpoints.list),
      mutate(endpoints.key + endpoints.detail(id))
    ]);
    
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update vehicle'
    };
  }
}

// ==============================|| DELETE VEHICLE ||============================== //

export async function deleteVehicle(id: number) {
  try {
    await axiosServices.delete(endpoints.key + endpoints.delete(id));
    
    // Revalidate the list after deletion
    await mutate(endpoints.key + endpoints.list);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting vehicle:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete vehicle'
    };
  }
}

// ==============================|| UPLOAD VEHICLE IMAGES ||============================== //

interface CategorizedImages {
  frontView: File | null;
  rearView: File | null;
  leftSideView: File | null;
  rightSideView: File | null;
  interior: File | null;
  engine: File | null;
  dashboard: File | null;
  others: File[];
}

export async function uploadVehicleImages(vehicleId: number, categorizedImages: CategorizedImages) {
  try {
    const formData = new FormData();
    let imageIndex = 0;

    console.log('Preparing to upload images for vehicle:', vehicleId);
    console.log('Categorized images:', categorizedImages);

    // Add single category images
    (Object.keys(categorizedImages) as Array<keyof CategorizedImages>).forEach((category) => {
      const image = categorizedImages[category];
      
      if (category === 'others' && Array.isArray(image)) {
        // Handle multiple 'others' images
        image.forEach((file) => {
          if (file) {
            console.log(`Adding image ${imageIndex}: category=${category}, file=${file.name}`);
            formData.append(`images[${imageIndex}][category]`, category);
            formData.append(`images[${imageIndex}][file]`, file);
            imageIndex++;
          }
        });
      } else if (image && image instanceof File) {
        // Handle single category images
        console.log(`Adding image ${imageIndex}: category=${category}, file=${image.name}`);
        formData.append(`images[${imageIndex}][category]`, category);
        formData.append(`images[${imageIndex}][file]`, image);
        imageIndex++;
      }
    });

    console.log(`Total images to upload: ${imageIndex}`);

    // Only make the request if there are images to upload
    if (imageIndex === 0) {
      console.log('No images to upload');
      return { success: true, data: { message: 'No images to upload' } };
    }

    const response = await axiosServices.post(
      `${endpoints.key}/${vehicleId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    // Revalidate the vehicle detail after image upload
    await mutate(endpoints.key + endpoints.detail(vehicleId));
    
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error uploading images:', error);
    console.error('Error response:', error.response);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload images'
    };
  }
}
