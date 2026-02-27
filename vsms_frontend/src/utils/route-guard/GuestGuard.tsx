'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// project-imports
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session) {
      router.push('/admin-dashboard');
    }
    // eslint-disable-next-line
  }, [session, status, router]);

  if (status === 'loading') return <Loader />;
  
  if (session?.user) {
    return <Loader />;
  }

  return <>{children}</>;
}
