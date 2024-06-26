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
        <NavbarItem isActive={pathname.includes("/dashboard/home") ? true : false}>
          <Link href="/dashboard/home">
            <NextUILink color={pathname.includes("/dashboard/home") ? "secondary" : "foreground"} aria-current="page">
              Home
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