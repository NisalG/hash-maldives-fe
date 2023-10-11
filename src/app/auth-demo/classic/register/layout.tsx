'use client';

// components
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthClassicLayout title="Manage your Sample Project more effectively with  Hash Maldives Sample Project">
      {children}
    </AuthClassicLayout>
  );
}
