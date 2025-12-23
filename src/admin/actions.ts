
'use server';

export async function login(email: string, password: string): Promise<string | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return 'Administrator credentials are not configured on the server.';
  }

  if (email === adminEmail && password === adminPassword) {
    // In a real app, you would set a cookie or session token here.
    return null;
  }

  return 'Please check your email and password.';
}
