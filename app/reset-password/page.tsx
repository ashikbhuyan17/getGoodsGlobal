import { Suspense } from 'react';
import ResetPasswordClient from '@/components/forgot-password/ResetPasswordClient';

function ResetPasswordFallback() {
  return (
    <div className="max-w-md mx-auto py-14 px-2 text-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
