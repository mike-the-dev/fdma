import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "JOYMD - Login",
  description: "A JOY MD dashboard manager",
};

interface DashboardLayout {
  children: React.ReactNode;
};

export default function DashboardLayout(props: DashboardLayout): React.ReactElement {
  return (
    <>
      {props.children}
    </>
  );
};