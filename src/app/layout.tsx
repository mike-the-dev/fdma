import {Providers} from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instapaytient",
  description: "An Instapaytient dashboard manager.",
};

interface RootLayout {
  children: React.ReactNode;
};

export default function RootLayout(props: RootLayout): React.ReactElement {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={inter.className}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthProvider>
            <Navigation />
            { props.children }
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
};