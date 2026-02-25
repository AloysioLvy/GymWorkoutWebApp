import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';
import { Dumbbell, Zap, Search, Brain, Shield, ChevronRight } from 'lucide-react';

export default async function LoginPage() {
  const signInUrl = await getSignInUrl();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">GymAI</span>
          </div>
          <Link
            href={signInUrl}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Entrar
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-28 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-zinc-400 mb-8">
            <Zap className="w-3 h-3 text-white" />
            Gerado por Inteligência Artificial
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
            Seu treino personalizado,{' '}
            <span className="text-zinc-500">criado pela IA.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-xl mx-auto mb-10">
            Responda algumas perguntas sobre seu perfil e o GymAI monta um plano de treino
            completo e personalizado para os seus objetivos — em segundos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={signInUrl}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all min-h-[48px] w-full sm:w-auto"
            >
              <Zap className="w-4 h-4" />
              Criar meu treino grátis
            </Link>
            <a
              href="#como-funciona"
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/[0.12] text-sm text-zinc-400 hover:text-white hover:border-white/25 rounded-xl transition-all min-h-[48px] w-full sm:w-auto"
            >
              Como funciona
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium text-center mb-3">
            Funcionalidades
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-14 tracking-tight">
            Tudo que você precisa para treinar melhor
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="bg-zinc-950 border border-white/[0.07] rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">Treino com IA</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                A IA cria um plano de treino completo baseado no seu objetivo, nível de
                condicionamento, equipamentos disponíveis e restrições físicas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-950 border border-white/[0.07] rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">Biblioteca de Exercícios</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Pesquise por qualquer exercício e veja GIFs animados, músculos trabalhados,
                equipamentos necessários e instruções passo a passo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-950 border border-white/[0.07] rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">100% Personalizado</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Leva em conta sua faixa etária, peso, altura, lesões, condições de saúde e
                os grupos musculares que você quer focar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium text-center mb-3">
            Como funciona
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-14 tracking-tight">
            Três passos para o seu plano ideal
          </h2>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Crie sua conta',
                description:
                  'Login seguro em segundos via WorkOS. Sem senhas para lembrar, sem formulários longos.',
              },
              {
                step: '02',
                title: 'Responda o questionário',
                description:
                  'Informe seus objetivos, nível de condicionamento, equipamentos disponíveis, dias por semana, duração das sessões, e possíveis lesões. São apenas algumas perguntas rápidas.',
              },
              {
                step: '03',
                title: 'Receba seu treino',
                description:
                  'A IA processa seu perfil e gera um plano de treino completo com exercícios, séries, repetições e dicas — personalizado para você.',
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="flex gap-5 p-6 bg-zinc-950 border border-white/[0.07] rounded-2xl"
              >
                <span className="text-2xl font-semibold text-zinc-800 tabular-nums leading-none mt-0.5 shrink-0">
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold text-white mb-1.5 text-sm">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalização detalhada */}
      <section className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium text-center mb-3">
            Personalização
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4 tracking-tight">
            A IA considera tudo
          </h2>
          <p className="text-zinc-500 text-sm text-center max-w-md mx-auto mb-12">
            Quanto mais detalhes você fornece, mais preciso e eficiente será o seu treino.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[
              'Objetivo principal',
              'Nível de condicionamento',
              'Faixa etária',
              'Peso e altura',
              'Dias por semana',
              'Duração da sessão',
              'Equipamentos disponíveis',
              'Preferência de cardio',
              'Lesões e limitações',
              'Condições de saúde',
              'Músculos para focar',
              'Estilo de treino',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950 border border-white/[0.07] rounded-lg"
              >
                <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                <span className="text-xs text-zinc-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-5 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Crie sua conta gratuitamente e receba seu plano de treino personalizado em minutos.
          </p>
          <Link
            href={signInUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all min-h-[52px]"
          >
            <Zap className="w-4 h-4" />
            Começar agora — é grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-3.5 h-3.5 text-zinc-700" />
            <span className="text-xs text-zinc-700 font-medium">GymAI</span>
          </div>
          <p className="text-xs text-zinc-800">Login seguro via WorkOS</p>
        </div>
      </footer>
    </div>
  );
}
