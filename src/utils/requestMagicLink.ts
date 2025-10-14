import apiClient from './apiClient';

interface RequestMagicLinkData {
  emailAddress: string;
}

interface RequestMagicLinkResponse {
  success: boolean;
  message?: string;
}

/**
 * Requests a magic link from the NestJS backend
 * Calls the backend directly using the configured apiClient
 * No authentication required for this endpoint
 */

const requestMagicLink = async (data: RequestMagicLinkData): Promise<RequestMagicLinkResponse> => {
  try {
    // Call NestJS backend directly - no authentication needed for magic link requests
    const response = await apiClient.post('/api/requestMagicLinkSuperAdmin', data);
    return response.data;
  } catch (error: any) {
    console.error('Error requesting magic link:', error);
    
    // Handle axios error response
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to send magic link');
    }
    
    // Handle network or other errors
    throw new Error(error.message || 'Failed to send magic link');
  }
};

export default requestMagicLink;
