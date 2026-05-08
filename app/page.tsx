"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Users, FileText, CheckSquare, TrendingUp, Settings } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.push("/select-company");
    }
  }, [router]);

  const features = [
    {
      icon: LayoutGrid,
      title: "CRM com Processos Simultâneos",
      description: "Gerencie o mesmo projeto em vários processos paralelos com um acompanhamento claro das jornadas e seus responsáveis.",
      href: "/board",
      color: "bg-primary-500",
    },
    {
      icon: TrendingUp,
      title: "Dimensionamento Fotovoltaico",
      description: "Calcule sistemas on-grid, híbridos e zero grid com uma ou múltiplas unidades consumidoras.",
      href: "/calculator",
      color: "bg-blue-500",
    },
    {
      icon: FileText,
      title: "Predificações e Propostas Personalizadas",
      description: "Configure qualquer tipo de custo e precificação na plataforma e gere propostas personalizadas.",
      href: "#",
      color: "bg-green-500",
    },
    {
      icon: CheckSquare,
      title: "Checklists Inteligentes",
      description: "Garanta que seu time preencha dados importantes nos momentos corretos e sem erros.",
      href: "#",
      color: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Métricas em Tempo Real",
      description: "Acompanhe métricas de vendas, processos e mercado com dashboards prontos e no PowerBI.",
      href: "#",
      color: "bg-orange-500",
    },
    {
      icon: Settings,
      title: "Automatizações Poderosas",
      description: "Crie regras baseadas em gatilhos, condicionais e ações automáticas sem grandes esforços.",
      href: "#",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SolarSystem</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Cadastrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              Conheça nosso ecossistema
              <br />
              com múltiplas soluções.
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Gerencie seus projetos fotovoltaicos de forma eficiente com ferramentas poderosas e intuitivas
            </p>
            <div className="flex items-center space-x-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Começar Grátis
              </Link>
              <Link
                href="/login"
                className="inline-block bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
                >
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="text-xl font-bold">SolarSystem</span>
            </div>
            <p className="text-gray-400">
              © 2026 SolarSystem CRM. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
