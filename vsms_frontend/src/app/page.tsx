import { redirect } from 'next/navigation';

// ==============================|| DEFAULT REDIRECT TO LOGIN ||============================== //

export default function HomePage() {
  redirect('/login');
}
