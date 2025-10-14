"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectCountdownProps {
  seconds: number;
  redirectPath: string;
  onRedirect?: () => void;
}

const RedirectCountdown = ({ seconds, redirectPath, onRedirect }: RedirectCountdownProps) => {
  const [countdown, setCountdown] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          if (onRedirect) {
            onRedirect();
          }
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(countdownInterval);
  }, [seconds, redirectPath, onRedirect]);

  return (
    <p className="text-small text-default-400 mt-2">
      in {countdown} second{countdown !== 1 ? 's' : ''}
    </p>
  );
};

export default RedirectCountdown;
