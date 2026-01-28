import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guía Restaurant - Sabor sin fronteras",
  description: "Descubre los mejores restaurantes, bares y cocinas de México",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
