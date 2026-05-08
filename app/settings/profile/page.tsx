"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar senha se estiver tentando mudar
    if (showPasswordSection) {
      if (!formData.currentPassword) {
        alert("Digite sua senha atual");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert("As senhas não coincidem");
        return;
      }
      if (formData.newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres");
        return;
      }
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // TODO: Implementar API para atualizar perfil
      // const response = await fetch("/api/user/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) throw new Error("Erro ao atualizar perfil");
      
      // Simulação temporária
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      if (showPasswordSection) {
        setShowPasswordSection(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
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
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-500">Gerencie suas informações pessoais</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto de Perfil</h2>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Alterar Foto</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Senha</h2>
              {!showPasswordSection && (
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(true)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Alterar Senha
                </button>
              )}
            </div>

            {showPasswordSection ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Senha Atual *
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Nova Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setFormData({
                      ...formData,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancelar alteração de senha
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                ••••••••
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-3">
            <Link
              href="/board"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving || saveSuccess}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                saveSuccess
                  ? "bg-green-600 text-white"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Save className="w-5 h-5" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
