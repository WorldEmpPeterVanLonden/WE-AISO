
import { AuthForm } from '@/app/components/auth-form';
import { GoogleSignInButton } from '@/app/components/google-signin-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your AI compliance projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="login" />
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-card px-2 text-sm text-muted-foreground">
                OR
              </span>
            </div>
            <GoogleSignInButton />
             <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
