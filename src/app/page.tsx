import { redirect } from 'next/navigation';
import { getFirebase } from '@/firebase/server';

export default async function Home() {
  const { auth } = await getFirebase();
  const user = auth.currentUser;

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
