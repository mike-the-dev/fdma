"use client";

import React from "react";
import Link from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as NextUILink, Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import JoymdLogo from "../Logos/JoymdLogo";

interface NavigationProps {};

const Navigation: React.FC<NavigationProps> = (): React.ReactElement => {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/"
  ) return <></>;

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <JoymdLogo />
        {/* <p className="font-bold text-inherit">JOYMD</p> */}
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname.includes("/dashboard/ecwid") ? true : false}>
          <Link href="/dashboard/ecwid">
            <NextUILink color={pathname.includes("/dashboard/ecwid") ? "secondary" : "foreground"} aria-current="page">
              Ecwid
            </NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.includes("/dashboard/instapaytient") ? true : false}>
          <Link href="/dashboard/instapaytient">
            <NextUILink color={pathname.includes("/dashboard/instapaytient") ? "secondary" : "foreground"} aria-current="page">
              Instapaytient
            </NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.includes("/dashboard/account-creation") ? true : false}>
          <Link href="/dashboard/account-creation">
            <NextUILink color={pathname.includes("/dashboard/account-creation") ? "secondary" : "foreground"} aria-current="page">
              Account Creation
            </NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.includes("/dashboard/account-deployment") ? true : false}>
          <Link href="/dashboard/account-deployment">
            <NextUILink color={pathname.includes("/dashboard/account-deployment") ? "secondary" : "foreground"} aria-current="page">
              Account Deployment
            </NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.includes("/dashboard/scheduler") ? true : false}>
          <Link href="/dashboard/scheduler">
            <NextUILink color={pathname.includes("/dashboard/scheduler") ? "secondary" : "foreground"} aria-current="page">
              Scheduler
            </NextUILink>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <NextUILink href="#">Logout</NextUILink>
        </NavbarItem> */}
        <NavbarItem>
          <Button as={NextUILink} color="primary" href="/api/logoutAccount" variant="flat">
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;