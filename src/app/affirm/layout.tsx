import Providers from "../providers";
import type { Metadata } from "next";
import "../globals.css";
import ProviderMaxHeight from "../../providers/ProviderMaxHeight";

export const metadata: Metadata = {
  title: "Test!",
  description: "A affirm",
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