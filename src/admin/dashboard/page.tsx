
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard. You can manage your site from here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
