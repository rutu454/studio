import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is your control panel. You can manage the website content from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select an option from the sidebar to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
