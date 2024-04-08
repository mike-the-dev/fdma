import Providers from "../providers";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Test!",
  description: "A JOY MD dashboard manager",
};

interface DashboardLayout {
  children: React.ReactNode;
};

export default function DashboardLayout(props: DashboardLayout): React.ReactElement {
  return (
    <Providers>
      { props.children }
    </Providers>
  );
};