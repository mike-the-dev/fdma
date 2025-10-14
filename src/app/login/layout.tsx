import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Instapaytient - Login",
  description: "An Instapaytient dashboard manager",
};

interface DashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout(
  props: DashboardLayout
): React.ReactElement {
  return <>{props.children}</>;
}
