
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout applies to all routes under /admin and does not include the main AppShell (Header/Footer)
  return <>{children}</>;
}
