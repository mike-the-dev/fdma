"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link as NextUILink } from "@heroui/link";
import { usePathname } from "next/navigation";

import JoymdLogo from "../Logos/JoymdLogo";
import LogoutButton from "../LogoutButton";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = (): React.ReactElement => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't show navigation on login, home page, or magic link verification
  if (
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/auth/")
  ) {
    return <></>;
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return <></>;
  }

  // Always show navigation for dashboard routes
  // No authentication state dependency - just pathname-based visibility

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <JoymdLogo />
        {/* <p className="font-bold text-inherit">Instapaytient</p> */}
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem
          isActive={
            pathname.includes("/dashboard/instapaytient") ? true : false
          }
        >
          <NextUILink
            aria-current="page"
            as={Link}
            color={
              pathname.includes("/dashboard/instapaytient")
                ? "secondary"
                : "foreground"
            }
            href="/dashboard/instapaytient"
          >
            Instapaytient
          </NextUILink>
        </NavbarItem>
        <NavbarItem
          isActive={
            pathname.includes("/dashboard/account-creation") ? true : false
          }
        >
          <NextUILink
            aria-current="page"
            as={Link}
            color={
              pathname.includes("/dashboard/account-creation")
                ? "secondary"
                : "foreground"
            }
            href="/dashboard/account-creation"
          >
            Account Creation
          </NextUILink>
        </NavbarItem>
        <NavbarItem
          isActive={
            pathname.includes("/dashboard/account-deployment") ? true : false
          }
        >
          <NextUILink
            aria-current="page"
            as={Link}
            color={
              pathname.includes("/dashboard/account-deployment")
                ? "secondary"
                : "foreground"
            }
            href="/dashboard/account-deployment"
          >
            Account Deployment
          </NextUILink>
        </NavbarItem>
        <NavbarItem
          isActive={pathname.includes("/dashboard/scheduler") ? true : false}
        >
          <NextUILink
            aria-current="page"
            as={Link}
            color={
              pathname.includes("/dashboard/scheduler")
                ? "secondary"
                : "foreground"
            }
            href="/dashboard/scheduler"
          >
            Scheduler
          </NextUILink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <LogoutButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
