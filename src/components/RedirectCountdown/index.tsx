"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface RedirectCountdownProps {
  seconds: number;
  redirectPath: string;
  onRedirect?: () => void;
}

const RedirectCountdown = ({
  seconds,
  redirectPath,
  onRedirect,
}: RedirectCountdownProps) => {
  const [countdown, setCountdown] = useState(seconds);
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  // Handle countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(countdownInterval);
  }, [seconds]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      
      // Call onRedirect callback if provided
      if (onRedirect) {
        onRedirect();
      }
      
      // Perform redirect using router.push
      router.push(redirectPath);
    }
  }, [countdown, redirectPath, onRedirect, router]);

  return (
    <p className="text-small text-default-400 mt-2">
      in {countdown} second{countdown !== 1 ? "s" : ""}
    </p>
  );
};

export default RedirectCountdown;
