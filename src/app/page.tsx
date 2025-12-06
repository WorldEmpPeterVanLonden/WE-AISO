import { redirect } from 'next/navigation';

export default async function Home() {
  // Always redirect to the dashboard.
  // The dashboard is a client component that will handle
  // redirecting to /login if the user is not authenticated.
  redirect('/dashboard');
}
