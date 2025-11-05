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
    <html lang="en">
      <body className="font-body antialiased bg-muted/40">
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
      </body>
    </html>
  );
}
