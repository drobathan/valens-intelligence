import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'Valens Intelligence',
  description: 'Governance intelligence dashboard — Valens Advisory',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
