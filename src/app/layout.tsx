import Providers from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Manager",
  description: "A JOY MD dashboard manager",
};

interface RootLayout {
  children: React.ReactNode;
};

export default function RootLayout(props: RootLayout): React.ReactElement {
  return (
    <html lang="en" className="dark text-foreground bg-background">
      <body className={inter.className}>
        <Providers>
          { props.children }
        </Providers>
      </body>
    </html>
  );
};