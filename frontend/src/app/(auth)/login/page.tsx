import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export default async function LoginPage() {
  const { user } = await withAuth();

  if (user) {
    redirect('/');
  }

  const signInUrl = await getSignInUrl();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">GymAI</h1>
          <p className="text-zinc-500 text-sm">Seu companheiro de treino com IA</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-8">
          <p className="text-zinc-400 text-sm text-center mb-6 leading-relaxed">
            Entre para acessar seus planos de treino personalizados e a biblioteca de exercícios.
          </p>
          <Link
            href={signInUrl}
            className="flex items-center justify-center w-full bg-white text-black text-sm font-semibold py-3 px-6 rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all min-h-[48px]"
          >
            Entrar
          </Link>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          Login seguro via WorkOS
        </p>
      </div>
    </div>
  );
}
