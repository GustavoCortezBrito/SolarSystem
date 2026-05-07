"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Users,
  Calendar,
  Check,
  Crown,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { SubscriptionPlan, SubscriptionStatus, PLAN_LIMITS } from "@/types/auth";
import { mockCompanies } from "@/lib/mockAuthData";

export default function CompanySettingsPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string>("");
  const [company, setCompany] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (!storedCompanyId) {
      router.push("/login");
      return;
    }

    setCompanyId(storedCompanyId);
    const foundCompany = mockCompanies.find((c) => c.id === storedCompanyId);
    if (foundCompany) {
      setCompany(foundCompany);
    }
  }, [router]);

  if (!company) {
    return null;
  }

  const currentPlanLimits = PLAN_LIMITS[company.plan as SubscriptionPlan];
  const isTrialActive = company.subscriptionStatus === SubscriptionStatus.TRIAL;
  const trialDaysLeft = company.trialEndsAt
    ? Math.ceil(
        (new Date(company.trialEndsAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    if (!selectedPlan) return;

    // Aqui você faria a integração com gateway de pagamento
    alert(`Upgrade para ${PLAN_LIMITS[selectedPlan].name} confirmado!`);
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.TRIAL:
        return <Calendar className="w-6 h-6" />;
      case SubscriptionPlan.STARTER:
        return <Zap className="w-6 h-6" />;
      case SubscriptionPlan.PROFESSIONAL:
        return <TrendingUp className="w-6 h-6" />;
      case SubscriptionPlan.ENTERPRISE:
        return <Crown className="w-6 h-6" />;
    }
  };

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.TRIAL:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case SubscriptionPlan.STARTER:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case SubscriptionPlan.PROFESSIONAL:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case SubscriptionPlan.ENTERPRISE:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/board" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações da Empresa</h1>
                <p className="text-sm text-gray-500">{company.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trial Alert */}
        {isTrialActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Período de Teste</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Você tem <strong>{trialDaysLeft} dias</strong> restantes no seu período de teste gratuito.
                Escolha um plano para continuar usando o SolarSystem após o término.
              </p>
            </div>
          </motion.div>
        )}

        {/* Current Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plano Atual</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-lg ${getPlanColor(company.plan)} border-2 flex items-center justify-center`}>
                {getPlanIcon(company.plan)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {currentPlanLimits.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentPlanLimits.price === 0
                    ? "Gratuito"
                    : `R$ ${currentPlanLimits.price}/mês`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Usuários</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentPlanLimits.maxUsers === -1
                  ? "Ilimitado"
                  : `${currentPlanLimits.maxUsers} usuários`}
              </p>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLAN_LIMITS)
            .filter(([plan]) => plan !== SubscriptionPlan.TRIAL)
            .map(([plan, limits]) => {
              const planEnum = plan as SubscriptionPlan;
              const isCurrentPlan = company.plan === planEnum;
              const isUpgrade =
                Object.keys(SubscriptionPlan).indexOf(planEnum) >
                Object.keys(SubscriptionPlan).indexOf(company.plan);

              return (
                <motion.div
                  key={plan}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                    isCurrentPlan
                      ? "border-primary-600"
                      : "border-gray-200 hover:border-primary-300"
                  } transition-colors`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${getPlanColor(planEnum)} border-2 flex items-center justify-center`}>
                      {getPlanIcon(planEnum)}
                    </div>
                    {isCurrentPlan && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                        Plano Atual
                      </span>
                    )}
                  </div>

                  {/* Name & Price */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {limits.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      R$ {limits.price}
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>
                        {limits.maxUsers === -1
                          ? "Usuários ilimitados"
                          : `Até ${limits.maxUsers} usuários`}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>
                        {limits.maxBoards === -1
                          ? "Boards ilimitados"
                          : `Até ${limits.maxBoards} boards`}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>
                        {limits.maxLeadsPerMonth === -1
                          ? "Leads ilimitados"
                          : `${limits.maxLeadsPerMonth} leads/mês`}
                      </span>
                    </li>
                    {limits.features.includes("dimensionamento") && (
                      <li className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Dimensionamento</span>
                      </li>
                    )}
                    {limits.features.includes("propostas") && (
                      <li className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Propostas</span>
                      </li>
                    )}
                    {limits.features.includes("automacoes") && (
                      <li className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Automações</span>
                      </li>
                    )}
                    {limits.features.includes("integracao_whatsapp") && (
                      <li className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Integração WhatsApp</span>
                      </li>
                    )}
                    {limits.features.includes("white_label") && (
                      <li className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>White Label</span>
                      </li>
                    )}
                  </ul>

                  {/* Action Button */}
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Plano Atual
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planEnum)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        isUpgrade
                          ? "bg-primary-600 text-white hover:bg-primary-700"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isUpgrade ? "Fazer Upgrade" : "Fazer Downgrade"}
                    </button>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmar Mudança de Plano
            </h2>
            <p className="text-gray-700 mb-6">
              Você está prestes a mudar para o plano{" "}
              <strong>{PLAN_LIMITS[selectedPlan].name}</strong> por{" "}
              <strong>R$ {PLAN_LIMITS[selectedPlan].price}/mês</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> A mudança será efetivada imediatamente e você será
                cobrado proporcionalmente ao período restante do mês.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={confirmUpgrade}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
