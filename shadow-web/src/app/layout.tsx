import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadow",
  description: "Shadow login flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
