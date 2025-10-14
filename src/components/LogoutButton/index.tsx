"use client";

import { Button } from "@heroui/button";
import { useAuthContext } from "@/context/AuthContext";

interface LogoutButtonProps {
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const LogoutButton = ({ variant = "flat", color = "primary" }: LogoutButtonProps): React.ReactElement => {
  const { logout } = useAuthContext();

  return (
    <Button 
      variant={variant} 
      color={color}
      onPress={logout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

