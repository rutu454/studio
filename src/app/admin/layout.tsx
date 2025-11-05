import { FirebaseClientProvider } from '@/firebase';
import '@/app/globals.css';

export const metadata = {
  title: 'Prasthan Admin',
  description: 'Admin panel for Prasthan Group website',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/40 min-h-screen">
      <FirebaseClientProvider>{children}</FirebaseClientProvider>
    </div>
  );
}
