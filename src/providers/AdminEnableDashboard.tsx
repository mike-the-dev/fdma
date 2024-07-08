"use client";

import React from "react";
import { useGlobalState } from "@/context/GlobalStateProvider";

interface AdminEnableDashboardProps {
  children: React.ReactNode;
};

const AdminEnableDashboard: React.FC<AdminEnableDashboardProps> = (props): React.ReactElement => {
  const context = useGlobalState();

  React.useEffect(() => {
    const authAdminPublicPermission = localStorage.getItem("auth-admin-public-permission") || "";
    if (authAdminPublicPermission === "admin") {
      context.setState({ isAdminDashboardEnabled: true });
    };
  }, [context.state.isAdminDashboardEnabled]);

  React.useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "`") {
        console.log("You pressed ctrl, alt and the a key!");
        context.setState(prevState => ({ isAdminDashboardEnabled: !prevState.isAdminDashboardEnabled }));
      };
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, [context.state.isAdminDashboardEnabled]);

  return (
    <>
     { props.children }
    </>
  );
};

export default AdminEnableDashboard;