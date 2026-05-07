import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <Link
          href="/register"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Termos de Uso
        </h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-4">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            1. Aceitação dos Termos
          </h2>
          <p className="text-gray-700 mb-4">
            Ao acessar e usar o SolarSystem CRM, você concorda com estes termos de uso.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            2. Uso do Serviço
          </h2>
          <p className="text-gray-700 mb-4">
            O SolarSystem CRM é uma plataforma de gestão de relacionamento com clientes
            para empresas do setor de energia solar.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            3. Conta de Usuário
          </h2>
          <p className="text-gray-700 mb-4">
            Você é responsável por manter a confidencialidade de sua conta e senha.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            4. Privacidade
          </h2>
          <p className="text-gray-700 mb-4">
            Seus dados são protegidos conforme nossa{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            5. Contato
          </h2>
          <p className="text-gray-700 mb-4">
            Para dúvidas sobre estes termos, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
