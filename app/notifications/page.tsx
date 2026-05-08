"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, Filter, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api";
import type { Notification, NotificationType } from "@/types/notification";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    read: "",
    type: "",
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications();
      
      // Aplicar filtros
      const filtered = data.filter((notif) => {
        if (filters.read === "true" && !notif.read) return false;
        if (filters.read === "false" && notif.read) return false;
        if (filters.type && notif.type !== filters.type) return false;
        return true;
      });
      
      setNotifications(filtered);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setError("Erro ao carregar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadNotifications();
    }
  }, [filters]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    // TODO: Implementar delete na API
    console.log("Delete não implementado ainda:", notificationId);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PROPOSTA_ACEITA":
        return "✅";
      case "PROPOSTA_REJEITADA":
        return "❌";
      case "NOVO_CLIENTE":
        return "👤";
      case "CLIENTE_ATUALIZADO":
        return "📝";
      case "CARD_ATRIBUIDO":
        return "📌";
      case "CARD_MOVIDO":
        return "➡️";
      case "COMENTARIO":
        return "💬";
      case "VENCIMENTO_PROXIMO":
        return "⏰";
      case "TAREFA_CONCLUIDA":
        return "✔️";
      case "MEMBRO_ADICIONADO":
        return "👥";
      case "SISTEMA":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "PROPOSTA_ACEITA":
      case "TAREFA_CONCLUIDA":
        return "bg-green-50 border-green-200";
      case "PROPOSTA_REJEITADA":
        return "bg-red-50 border-red-200";
      case "VENCIMENTO_PROXIMO":
        return "bg-yellow-50 border-yellow-200";
      case "NOVO_CLIENTE":
      case "MEMBRO_ADICIONADO":
        return "bg-blue-50 border-blue-200";
      case "COMENTARIO":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return notifDate.toLocaleDateString("pt-BR");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadNotifications}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/board"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bell className="w-6 h-6" />
                  <span>Notificações</span>
                </h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Todas lidas"} • {notifications.length} total
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas como lidas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.read}
                  onChange={(e) => setFilters({ ...filters, read: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas</option>
                  <option value="false">Não lidas</option>
                  <option value="true">Lidas</option>
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="PROPOSTA_ACEITA">Proposta Aceita</option>
                  <option value="PROPOSTA_REJEITADA">Proposta Rejeitada</option>
                  <option value="NOVO_CLIENTE">Novo Cliente</option>
                  <option value="CLIENTE_ATUALIZADO">Cliente Atualizado</option>
                  <option value="CARD_ATRIBUIDO">Card Atribuído</option>
                  <option value="CARD_MOVIDO">Card Movido</option>
                  <option value="COMENTARIO">Comentário</option>
                  <option value="VENCIMENTO_PROXIMO">Vencimento Próximo</option>
                  <option value="TAREFA_CONCLUIDA">Tarefa Concluída</option>
                  <option value="MEMBRO_ADICIONADO">Membro Adicionado</option>
                  <option value="SISTEMA">Sistema</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setFilters({ read: "", type: "" })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Notificações */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-500">
                Você não tem notificações no momento
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 transition-all hover:shadow-md ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? "border-l-primary-500" : ""}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Ícone */}
                      <div className="text-2xl mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{getTimeAgo(notification.createdAt)}</span>
                          {notification.fromUserName && (
                            <span>• {notification.fromUserName}</span>
                          )}
                        </div>
                        {notification.actionUrl && (
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium"
                          >
                            {notification.actionLabel || "Ver detalhes"} →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
