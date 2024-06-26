import React from "react";
import Link from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as NextUILink, Button } from "@nextui-org/react";

interface NavigationProps {};

const Navigation: React.FC<NavigationProps> = (): React.ReactElement => {
  console.log("navigation! ");
  return (
    <Navbar>
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit">JOYMD</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/dashboard">
            <NextUILink color="foreground">
              Home
            </NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/dashboard/account-creation">
            <NextUILink color="foreground" aria-current="page">
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