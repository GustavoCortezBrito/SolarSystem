import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-4">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            1. Informações que Coletamos
          </h2>
          <p className="text-gray-700 mb-4">
            Coletamos informações que você nos fornece diretamente, como nome, email,
            telefone e dados da empresa.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            2. Como Usamos suas Informações
          </h2>
          <p className="text-gray-700 mb-4">
            Usamos suas informações para fornecer, manter e melhorar nossos serviços,
            processar transações e enviar comunicações relacionadas ao serviço.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            3. Compartilhamento de Informações
          </h2>
          <p className="text-gray-700 mb-4">
            Não vendemos suas informações pessoais. Compartilhamos apenas quando
            necessário para fornecer nossos serviços ou quando exigido por lei.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            4. Segurança
          </h2>
          <p className="text-gray-700 mb-4">
            Implementamos medidas de segurança para proteger suas informações contra
            acesso não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            5. Seus Direitos
          </h2>
          <p className="text-gray-700 mb-4">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais
            a qualquer momento.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            6. Contato
          </h2>
          <p className="text-gray-700 mb-4">
            Para questões sobre privacidade, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
