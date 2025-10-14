"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { setLocalStorageItem } from '@/hooks/useLocalStorage';
import { useAuthContext } from '@/context/AuthContext';
import RedirectCountdown from '@/components/RedirectCountdown';
import verifyMagicLink from '@/utils/verifyMagicLink';

export default function VerifyMagicLink() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const hasVerifiedRef = useRef(false); // Use ref to persist across re-renders
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recheckAuth } = useAuthContext();
  
  // Configuration for redirect
  const REDIRECT_DELAY = 5; // seconds

  useEffect(() => {
    // Prevent multiple verification attempts using ref
    if (hasVerifiedRef.current) {
      console.log('Magic link verification already attempted, skipping...');
      return;
    }

    const verifyToken = async () => {
      // Extract token from URL
      const token = searchParams.get('token');

      if (!token) {
        setError('Invalid magic link - no token provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting magic link verification...');
        const result = await verifyMagicLink({ token });

        if (result.authorization) {
          // Mark as verified only after successful verification
          hasVerifiedRef.current = true;
          
          // Store tokens in localStorage using your existing pattern
          const { tokens, user } = result.authorization;
          
          setLocalStorageItem("auth-public-token", "authenticated");
          setLocalStorageItem("access-token", tokens.access);
          setLocalStorageItem("refresh-token", tokens.refresh);
          setLocalStorageItem("user-id", user.id || user.userId || '');
          setLocalStorageItem("user-role", user.role);

          // Update AuthContext to reflect the new authentication state
          recheckAuth();

          setSuccess(true);
          setLoading(false);
        } else {
          // Mark as verified only after we get a definitive response
          hasVerifiedRef.current = true;
          setError(result.message || 'Failed to verify magic link');
          setLoading(false);
        }
      } catch (error: any) {
        // Mark as verified only after we get a definitive response
        hasVerifiedRef.current = true;
        console.error('Error verifying magic link:', error);
        setError(error.message || 'Failed to verify magic link. Please try again.');
        setLoading(false);
      }
    };

    verifyToken();
  }, []); // Empty dependency array - run only once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <Spinner size="lg" />
          <p className="mt-4">Verifying your magic link...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <div className="text-danger">
            <h2 className="text-xl font-bold mb-4">Verification Failed</h2>
            <p className="mb-4">{error}</p>
            <p className="text-small text-default-500">
              The magic link may have expired or been used already. Please request a new one.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <div className="text-success">
            <h2 className="text-xl font-bold mb-4">Login Successful!</h2>
            <p className="mb-4">Your magic link has been verified successfully.</p>
            <p className="text-small text-default-500">
              Redirecting you to the dashboard...
            </p>
            <RedirectCountdown 
              seconds={REDIRECT_DELAY} 
              redirectPath="/dashboard/instapaytient" 
            />
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
