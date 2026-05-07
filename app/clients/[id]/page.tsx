"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Zap,
  Calendar,
  User,
  Building2,
  Home,
  Factory,
  Tractor,
  Tag,
  Clock,
  Plus,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  getClientById, getClientActivities, saveClient, addActivity,
  getProposalsByClient,
} from "@/lib/store";
import {
  getClientTypeLabel, getClientStatusLabel, getClientStatusColor, getActivityIcon,
} from "@/lib/mockClientData";
import { ClientType, ClientStatus, ClientActivity, ActivityType } from "@/types/client";
import type { Proposal } from "@/types/proposal";

// ── Componente de Projetos/Propostas do cliente ───────────────────────────────
function ClientProposals({ clientId, clientName }: { clientId: string; clientName: string }) {
  const proposals = getProposalsByClient(clientId);

  const statusColors: Record<string, string> = {
    RASCUNHO: "bg-gray-100 text-gray-700",
    GERADA: "bg-blue-100 text-blue-700",
    ENVIADA: "bg-yellow-100 text-yellow-700",
    ACEITA: "bg-green-100 text-green-700",
    REJEITADA: "bg-red-100 text-red-700",
    EXPIRADA: "bg-gray-100 text-gray-500",
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Projetos / Propostas</span>
          {proposals.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
              {proposals.length}
            </span>
          )}
        </h2>
        <Link
          href={`/proposals/new?clientId=${clientId}`}
          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Nova</span>
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-6">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nenhuma proposta ainda</p>
          <Link
            href={`/proposals/new?clientId=${clientId}`}
            className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            Criar primeira proposta →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <Link
              key={p.id}
              href={`/proposals/${p.id}`}
              className="block border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                  {p.system.totalPower} kWp • {p.system.modules.manufacturer}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatCurrency(p.financial.totalCost)}</span>
                <span className="flex items-center gap-1">
                  {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState(getClientById(clientId));
  const [activities, setActivities] = useState(getClientActivities(clientId));
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: ActivityType.NOTE,
    description: "",
  });

  // Dados do usuário logado
  const [userId, setUserId] = useState("user-1");
  const [userName, setUserName] = useState("Carlos Silva");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "user-1";
    const storedUserName = localStorage.getItem("userName") || "Carlos Silva";
    setUserId(storedUserId);
    setUserName(storedUserName);

    if (!client) {
      router.push("/clients");
    }
  }, [client, router]);

  if (!client) {
    return null;
  }

  const handleSave = () => {
    if (!editedClient) return;

    const statusChanged = client.status !== editedClient.status;
    const updated = { ...editedClient, updatedAt: new Date().toISOString() };

    // Persiste no store (localStorage)
    saveClient(updated);
    setClient(updated);
    setIsEditing(false);

    if (statusChanged) {
      const statusActivity: ClientActivity = {
        id: `activity-${Date.now()}`,
        clientId: client.id,
        type: ActivityType.STATUS_CHANGE,
        description: `Status alterado de "${getClientStatusLabel(client.status)}" para "${getClientStatusLabel(editedClient.status)}"`,
        userId,
        userName,
        createdAt: new Date().toISOString(),
      };
      addActivity(statusActivity);
      setActivities([statusActivity, ...activities]);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newActivity.description.trim()) {
      alert("Digite uma descrição para a atividade");
      return;
    }

    const activity: ClientActivity = {
      id: `activity-${Date.now()}`,
      clientId: client.id,
      type: newActivity.type,
      description: newActivity.description,
      userId: userId,
      userName: userName,
      createdAt: new Date().toISOString(),
    };

    // Persiste no store
    addActivity(activity);
    setActivities([activity, ...activities]);
    setShowAddActivityModal(false);
    setNewActivity({
      type: ActivityType.NOTE,
      description: "",
    });
  };

  const getTypeIcon = (type: ClientType) => {
    switch (type) {
      case ClientType.RESIDENTIAL:
        return <Home className="w-5 h-5" />;
      case ClientType.COMMERCIAL:
        return <Building2 className="w-5 h-5" />;
      case ClientType.INDUSTRIAL:
        return <Factory className="w-5 h-5" />;
      case ClientType.RURAL:
        return <Tractor className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/clients" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  {isEditing ? (
                    <select
                      value={editedClient?.status}
                      onChange={(e) => setEditedClient({ ...editedClient!, status: e.target.value as ClientStatus })}
                      className="px-3 py-1 text-sm font-medium rounded-full border-2 border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={ClientStatus.LEAD}>Lead</option>
                      <option value={ClientStatus.CONTACT}>Em Contato</option>
                      <option value={ClientStatus.QUALIFIED}>Qualificado</option>
                      <option value={ClientStatus.PROPOSAL}>Proposta Enviada</option>
                      <option value={ClientStatus.NEGOTIATION}>Em Negociação</option>
                      <option value={ClientStatus.WON}>Cliente (Venda Fechada)</option>
                      <option value={ClientStatus.LOST}>Perdido</option>
                      <option value={ClientStatus.INACTIVE}>Inativo</option>
                    </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getClientStatusColor(client.status)}`}>
                      {getClientStatusLabel(client.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditedClient(client);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancelar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados Básicos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome / Razão Social
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedClient?.name}
                      onChange={(e) => setEditedClient({ ...editedClient!, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{client.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  {isEditing ? (
                    <select
                      value={editedClient?.type}
                      onChange={(e) => setEditedClient({ ...editedClient!, type: e.target.value as ClientType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={ClientType.RESIDENTIAL}>Residencial</option>
                      <option value={ClientType.COMMERCIAL}>Comercial</option>
                      <option value={ClientType.INDUSTRIAL}>Industrial</option>
                      <option value={ClientType.RURAL}>Rural</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(client.type)}
                      <span className="text-gray-900">{getClientTypeLabel(client.type)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedClient?.email}
                      onChange={(e) => setEditedClient({ ...editedClient!, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{client.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedClient?.phone}
                      onChange={(e) => setEditedClient({ ...editedClient!, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{client.phone}</p>
                  )}
                </div>
                {client.document && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF/CNPJ
                    </label>
                    <p className="text-gray-900">{client.document}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Endereço */}
            {client.address && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Endereço</span>
                </h2>
                <div className="space-y-2 text-gray-900">
                  <p>{client.address.street}, {client.address.number}</p>
                  {client.address.complement && <p>{client.address.complement}</p>}
                  <p>{client.address.neighborhood}</p>
                  <p>{client.address.city} - {client.address.state}</p>
                  <p>CEP: {client.address.zipCode}</p>
                </div>
              </div>
            )}

            {/* Projeto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Dados do Projeto</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumo Médio (kWh)
                  </label>
                  <p className="text-gray-900">{client.averageConsumption || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potência Estimada (kWp)
                  </label>
                  <p className="text-gray-900">{client.estimatedPower || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sistema
                  </label>
                  <p className="text-gray-900">{client.systemType || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Telhado
                  </label>
                  <p className="text-gray-900">{client.roofType || "-"}</p>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Observações</span>
              </h2>
              {isEditing ? (
                <textarea
                  value={editedClient?.notes || ""}
                  onChange={(e) => setEditedClient({ ...editedClient!, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Adicione observações sobre o cliente..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes || "Nenhuma observação"}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Valores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Valores</span>
              </h2>
              <div className="space-y-3">
                {/* Valor Estimado */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimado</p>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={editedClient?.estimatedValue || ""}
                        onChange={(e) => setEditedClient({ 
                          ...editedClient!, 
                          estimatedValue: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {client.estimatedValue 
                        ? `R$ ${client.estimatedValue.toLocaleString("pt-BR")}` 
                        : "Não definido"}
                    </p>
                  )}
                </div>

                {/* Valor da Proposta */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Proposta</p>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={editedClient?.proposalValue || ""}
                        onChange={(e) => setEditedClient({ 
                          ...editedClient!, 
                          proposalValue: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-primary-600">
                      {client.proposalValue 
                        ? `R$ ${client.proposalValue.toLocaleString("pt-BR")}` 
                        : "Não definido"}
                    </p>
                  )}
                </div>

                {/* Valor Fechado */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fechado</p>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={editedClient?.closedValue || ""}
                        onChange={(e) => setEditedClient({ 
                          ...editedClient!, 
                          closedValue: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-green-600">
                      {client.closedValue 
                        ? `R$ ${client.closedValue.toLocaleString("pt-BR")}` 
                        : "Não definido"}
                    </p>
                  )}
                </div>
              </div>

              {/* Dica sobre valores */}
              {isEditing && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Dica:</strong> Preencha os valores conforme o cliente avança no funil:
                    <br />• <strong>Estimado</strong>: Valor inicial calculado
                    <br />• <strong>Proposta</strong>: Valor enviado na proposta
                    <br />• <strong>Fechado</strong>: Valor final negociado
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {client.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projetos / Propostas vinculadas */}
            <ClientProposals clientId={client.id} clientName={client.name} />

            {/* Histórico */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Histórico de Atividades</span>
                </h2>
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma atividade registrada ainda
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="text-2xl flex-shrink-0">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.userName} •{" "}
                          {new Date(activity.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddActivityModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nova Atividade</h2>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Atividade
                </label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as ActivityType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={ActivityType.CALL}>📞 Ligação</option>
                  <option value={ActivityType.EMAIL}>📧 Email</option>
                  <option value={ActivityType.WHATSAPP}>💬 WhatsApp</option>
                  <option value={ActivityType.MEETING}>🤝 Reunião</option>
                  <option value={ActivityType.PROPOSAL_SENT}>📄 Proposta Enviada</option>
                  <option value={ActivityType.CONTRACT_SIGNED}>📝 Contrato Assinado</option>
                  <option value={ActivityType.DIMENSIONING}>📊 Dimensionamento</option>
                  <option value={ActivityType.INSTALLATION}>🏗️ Instalação</option>
                  <option value={ActivityType.INSPECTION}>✅ Vistoria</option>
                  <option value={ActivityType.PAYMENT}>💰 Pagamento</option>
                  <option value={ActivityType.NOTE}>📝 Observação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={4}
                  placeholder="Descreva a atividade realizada..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Dica:</strong> Mudanças de status são registradas automaticamente. 
                  Use este formulário para registrar ligações, reuniões, emails e outras interações.
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Adicionar Atividade
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
