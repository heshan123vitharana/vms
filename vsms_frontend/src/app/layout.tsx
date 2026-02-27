import type { Metadata } from 'next';

import './globals.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
  title: 'MOTO ERP - Vehicle Sales Management System',
  description:
    'MOTO ERP is a comprehensive vehicle sales management system for branches, featuring inventory management, multi-tenant support, and powerful reporting capabilities.'
};

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
