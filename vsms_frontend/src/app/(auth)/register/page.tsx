// next
import { redirect } from 'next/navigation';

// ================================|| REGISTER - DISABLED ||================================ //

export default function RegisterPage() {
  // Registration is disabled - redirect to login
  redirect('/login');
}
