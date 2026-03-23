import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Valens Intelligence',
  description: 'Client Intelligence Dashboard — Valens Advisory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-950 text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
