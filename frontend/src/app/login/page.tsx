import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const { user } = await withAuth();

  if (user) {
    redirect('/');
  }

  const signInUrl = await getSignInUrl();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gym Exercise Search
        </h1>
        <p className="text-gray-500 mb-8">
          Sign in to search exercises and build your perfect workout
        </p>
        <Link
          href={signInUrl}
          className="inline-block w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
