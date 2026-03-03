"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface DeskScrollResetProps {
  containerId: string;
}

const DeskScrollReset = ({ containerId }: DeskScrollResetProps): null => {
  const pathname = usePathname();

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Next.js scroll restoration handles window scroll, but desk uses an inner scroll container.
    container.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, containerId]);

  return null;
};

export default DeskScrollReset;
