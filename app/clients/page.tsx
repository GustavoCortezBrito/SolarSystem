"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  Building2,
  Home,
  Factory,
  Tractor,
  X,
} from "lucide-react";
import Link from "next/link";
import { getCompanyClients, getClientTypeLabel, getClientStatusLabel, getClientStatusColor } from "@/lib/mockClientData";
import { addClient } from "@/lib/store";
import { ClientType, ClientStatus, Client } from "@/types/client";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ClientType | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<ClientStatus | "ALL">("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyId, setCompanyId] = useState<string>("company-1");
  const [userId, setUserId] = useState<string>("user-1");
  const [clients, setClients] = useState<Client[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: ClientType.RESIDENTIAL,
    averageConsumption: "",
  });

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "company-1";
    const storedUserId = localStorage.getItem("userId") || "user-1";
    setCompanyId(storedCompanyId);
    setUserId(storedUserId);
    
    // Carrega do store (que já hidrata do localStorage)
    const { getCompanyClients: storeGetClients } = require("@/lib/store");
    const companyClients = storeGetClients(storedCompanyId);
    setClients(companyClients);
  }, []);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyId: companyId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      status: ClientStatus.LEAD,
      averageConsumption: formData.averageConsumption ? parseInt(formData.averageConsumption) : undefined,
      assignedToId: userId,
      tags: [],
      projectIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    };

    // Persiste no store (localStorage) e gera notificação automática
    addClient(newClient);
    setClients((prev) => [newClient, ...prev]);
    setShowAddModal(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: ClientType.RESIDENTIAL,
      averageConsumption: "",
    });

    alert("Cliente cadastrado com sucesso!");
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || client.type === filterType;
    const matchesStatus = filterStatus === "ALL" || client.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: ClientType) => {
    switch (type) {
      case ClientType.RESIDENTIAL:
        return <Home className="w-4 h-4" />;
      case ClientType.COMMERCIAL:
        return <Building2 className="w-4 h-4" />;
      case ClientType.INDUSTRIAL:
        return <Factory className="w-4 h-4" />;
      case ClientType.RURAL:
        return <Tractor className="w-4 h-4" />;
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
                <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                <p className="text-sm text-gray-500">{clients.length} clientes cadastrados</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar clientes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ClientType | "ALL")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos os tipos</option>
              <option value={ClientType.RESIDENTIAL}>Residencial</option>
              <option value={ClientType.COMMERCIAL}>Comercial</option>
              <option value={ClientType.INDUSTRIAL}>Industrial</option>
              <option value={ClientType.RURAL}>Rural</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ClientStatus | "ALL")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos os status</option>
              <option value={ClientStatus.LEAD}>Lead</option>
              <option value={ClientStatus.CONTACT}>Em Contato</option>
              <option value={ClientStatus.QUALIFIED}>Qualificado</option>
              <option value={ClientStatus.PROPOSAL}>Proposta</option>
              <option value={ClientStatus.NEGOTIATION}>Negociação</option>
              <option value={ClientStatus.WON}>Cliente</option>
            </select>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    {getTypeIcon(client.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getClientStatusColor(client.status)}`}>
                      {getClientStatusLabel(client.status)}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {client.address.city}, {client.address.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              {client.estimatedPower && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Projeto Estimado</div>
                  <div className="font-semibold text-gray-900">
                    {client.estimatedPower} kWp
                  </div>
                  {client.estimatedValue && (
                    <div className="text-sm text-gray-600 mt-1">
                      R$ {client.estimatedValue.toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex-1 px-3 py-2 text-center text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalhes</span>
                </Link>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Novo Cliente</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome / Razão Social *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do cliente"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={ClientType.RESIDENTIAL}>Residencial</option>
                    <option value={ClientType.COMMERCIAL}>Comercial</option>
                    <option value={ClientType.INDUSTRIAL}>Industrial</option>
                    <option value={ClientType.RURAL}>Rural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumo Médio (kWh)
                  </label>
                  <input
                    type="number"
                    value={formData.averageConsumption}
                    onChange={(e) => setFormData({ ...formData, averageConsumption: e.target.value })}
                    placeholder="350"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Status inicial:</strong> O cliente será criado como <strong>Lead</strong>. 
                  Você poderá alterar o status posteriormente na página de detalhes.
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Cadastrar Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
