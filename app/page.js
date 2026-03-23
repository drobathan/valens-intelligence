/**
 * Root route — redirects signed-in users to /dashboard,
 * unauthenticated users to /sign-in.
 *
 * Clerk v5: auth() must be awaited in server components.
 */
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  } else {
    redirect('/sign-in');
  }
}
