import { withAuth } from '@workos-inc/authkit-nextjs';
import { createUser, checkGymProfile } from '@/lib/server-api';
import OnboardingFlow from '@/components/modules/OnboardingFlow';
import WorkoutDashboard from '@/components/modules/WorkoutDashboard';

export default async function Home() {
  const { user } = await withAuth({ ensureSignedIn: true });

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';

  await createUser(user.id, user.email, firstName || 'User', lastName || 'User');

  const hasProfile = await checkGymProfile(user.id);

  const userName = firstName || user.email;

  if (!hasProfile) {
    return (
      <OnboardingFlow
        userId={user.id}
        userName={userName}
      />
    );
  }

  return (
    <WorkoutDashboard
      userId={user.id}
      userName={userName}
      initialHasProfile={true}
    />
  );
}
