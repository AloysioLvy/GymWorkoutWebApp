import { withAuth } from '@workos-inc/authkit-nextjs';
import SearchPage from '@/components/SearchPage';

export default async function Home() {
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <SearchPage
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }}
    />
  );
}
