import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EBAM Car Wash & Detailing",
  description: "Premium car wash and detailing with fast online booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
