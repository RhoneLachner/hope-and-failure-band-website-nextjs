import type { Metadata } from "next";
import "../styles/global.sass";
import { ClientProviders } from "./providers";

export const metadata: Metadata = {
  title: "Hope & Failure",
  description: "Hope & Failure band website with music, videos, merchandise, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
