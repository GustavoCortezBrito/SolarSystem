"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Tag,
  User,
  AlignLeft,
  Trash2,
  Clock,
  AlertCircle,
  Save,
  UserCircle,
  Search,
  ExternalLink,
  Link2,
  Link2Off,
} from "lucide-react";
import Link from "next/link";
import type { Card, Board } from "@/types/board";
import type { Client } from "@/types/client";
import { getClients } from "@/lib/api";

interface CardModalProps {
  card: Card;
  columnId: string;
  board: Board;
  onClose: () => void;
  onSave: (updates: Partial<Card>) => void;
  onDelete: () => void;
}

export function CardModal({ card, board, onClose, onSave, onDelete }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(card.labels);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(card.assignees);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>(card.priority);
  const [clientId, setClientId] = useState<string | undefined>(card.clientId);
  const [clientName, setClientName] = useState<string | undefined>(card.clientName);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const labelPickerRef = useRef<HTMLDivElement>(null);
  const assigneePickerRef = useRef<HTMLDivElement>(null);
  const priorityPickerRef = useRef<HTMLDivElement>(null);
  const clientPickerRef = useRef<HTMLDivElement>(null);

  // Clientes da empresa
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const companyId = localStorage.getItem("companyId");
        if (companyId) {
          const clients = await getClients(companyId);
          setAllClients(clients);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoadingClients(false);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = useMemo(
    () =>
      allClients.filter(
        (c) =>
          c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
          c.phone.includes(clientSearch)
      ),
    [allClients, clientSearch]
  );

  useEffect(() => {
    const changed =
      title !== card.title ||
      description !== card.description ||
      JSON.stringify(selectedLabels) !== JSON.stringify(card.labels) ||
      JSON.stringify(selectedAssignees) !== JSON.stringify(card.assignees) ||
      dueDate !== (card.dueDate || "") ||
      priority !== card.priority ||
      clientId !== card.clientId;
    setHasChanges(changed);
  }, [title, description, selectedLabels, selectedAssignees, dueDate, priority, clientId, card]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (labelPickerRef.current && !labelPickerRef.current.contains(event.target as Node))
        setShowLabelPicker(false);
      if (assigneePickerRef.current && !assigneePickerRef.current.contains(event.target as Node))
        setShowAssigneePicker(false);
      if (priorityPickerRef.current && !priorityPickerRef.current.contains(event.target as Node))
        setShowPriorityPicker(false);
      if (clientPickerRef.current && !clientPickerRef.current.contains(event.target as Node))
        setShowClientPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    onSave({ title, description, labels: selectedLabels, assignees: selectedAssignees, dueDate: dueDate || undefined, priority, clientId, clientName });
    setHasChanges(false);
  };

  const handleSelectClient = (id: string, name: string) => {
    setClientId(id);
    setClientName(name);
    setShowClientPicker(false);
    setClientSearch("");
  };

  const handleUnlinkClient = () => {
    setClientId(undefined);
    setClientName(undefined);
  };

  const toggleLabel = (label: string) =>
    setSelectedLabels((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);

  const toggleAssignee = (userId: string) =>
    setSelectedAssignees((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);

  const labelColors: Record<string, string> = {
    Residencial: "bg-green-100 text-green-800 hover:bg-green-200",
    Comercial: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Industrial: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Urgente: "bg-red-100 text-red-800 hover:bg-red-200",
    Híbrido: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "On-Grid": "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    "Off-Grid": "bg-orange-100 text-orange-800 hover:bg-orange-200",
    "Aguardando Cliente": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    "Revisão Técnica": "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  };

  const priorityOptions = [
    { value: "low", label: "Baixa", color: "text-gray-600", bg: "bg-gray-100" },
    { value: "medium", label: "Média", color: "text-yellow-600", bg: "bg-yellow-100" },
    { value: "high", label: "Alta", color: "text-red-600", bg: "bg-red-100" },
  ];

  const getAssignedMembers = () => board.members.filter((m) => selectedAssignees.includes(m.id));

  const clientStatusColors: Record<string, string> = {
    LEAD: "bg-gray-100 text-gray-700",
    CONTACT: "bg-blue-100 text-blue-700",
    QUALIFIED: "bg-cyan-100 text-cyan-700",
    PROPOSAL: "bg-purple-100 text-purple-700",
    NEGOTIATION: "bg-yellow-100 text-yellow-700",
    WON: "bg-green-100 text-green-700",
    LOST: "bg-red-100 text-red-700",
    INACTIVE: "bg-gray-100 text-gray-500",
  };

  const clientStatusLabels: Record<string, string> = {
    LEAD: "Lead", CONTACT: "Em Contato", QUALIFIED: "Qualificado",
    PROPOSAL: "Proposta", NEGOTIATION: "Negociação", WON: "Cliente",
    LOST: "Perdido", INACTIVE: "Inativo",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <AlignLeft className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Editar Card</h2>
                <p className="text-sm text-gray-500">
                  Criado em {new Date(card.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <button onClick={handleSave}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                  <Save className="w-4 h-4" /><span>Salvar</span>
                </button>
              )}
              <button onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-3 gap-6">

              {/* ── Main Content ─────────────────────────────────────────── */}
              <div className="col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Digite o título do card..." />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Adicione uma descrição mais detalhada..." />
                </div>

                {/* ── Cliente Vinculado ─────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-primary-600" />
                    Cliente Vinculado
                  </label>

                  {/* Cliente selecionado */}
                  {clientId && clientName ? (
                    <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {clientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{clientName}</p>
                          {(() => {
                            const c = allClients.find((cl) => cl.id === clientId);
                            return c ? (
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${clientStatusColors[c.status] ?? "bg-gray-100 text-gray-700"}`}>
                                  {clientStatusLabels[c.status] ?? c.status}
                                </span>
                                <span className="text-xs text-gray-500">{c.phone}</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/clients/${clientId}`} target="_blank"
                          className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors" title="Abrir cliente">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button onClick={handleUnlinkClient}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Desvincular">
                          <Link2Off className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative" ref={clientPickerRef}>
                      <button onClick={() => setShowClientPicker(!showClientPicker)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Link2 className="w-4 h-4" />
                        <span>Vincular cliente cadastrado</span>
                      </button>

                      {showClientPicker && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                          {/* Search */}
                          <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input type="text" placeholder="Buscar cliente por nome ou telefone..."
                                value={clientSearch} onChange={(e) => setClientSearch(e.target.value)}
                                autoFocus
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                          </div>

                          {/* List */}
                          <div className="max-h-56 overflow-y-auto">
                            {loadingClients ? (
                              <p className="px-4 py-6 text-center text-sm text-gray-500">
                                Carregando clientes...
                              </p>
                            ) : filteredClients.length === 0 ? (
                              <p className="px-4 py-6 text-center text-sm text-gray-500">
                                Nenhum cliente encontrado
                              </p>
                            ) : (
                              filteredClients.map((c) => (
                                <button key={c.id} onClick={() => handleSelectClient(c.id, c.name)}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                    {c.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.phone}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${clientStatusColors[c.status] ?? "bg-gray-100 text-gray-700"}`}>
                                    {clientStatusLabels[c.status] ?? c.status}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>

                          {/* Footer */}
                          <div className="p-2 border-t border-gray-100 bg-gray-50">
                            <Link href="/clients" target="_blank"
                              className="flex items-center justify-center gap-1 text-xs text-primary-600 hover:text-primary-800 py-1">
                              <ExternalLink className="w-3 h-3" />
                              Gerenciar clientes
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedLabels.map((label) => (
                      <span key={label}
                        className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer ${labelColors[label] || "bg-gray-100 text-gray-800"}`}
                        onClick={() => toggleLabel(label)}>
                        {label} ×
                      </span>
                    ))}
                  </div>
                  <div className="relative" ref={labelPickerRef}>
                    <button onClick={() => setShowLabelPicker(!showLabelPicker)}
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2">
                      <Tag className="w-4 h-4" /><span>Adicionar tag</span>
                    </button>
                    {showLabelPicker && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
                        <div className="space-y-1">
                          {board.availableLabels.map((label) => (
                            <button key={label} onClick={() => toggleLabel(label)}
                              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${selectedLabels.includes(label) ? labelColors[label] : "hover:bg-gray-100"}`}>
                              {label}{selectedLabels.includes(label) && " ✓"}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Sidebar ───────────────────────────────────────────────── */}
              <div className="space-y-4">
                {/* Assignees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Membros</label>
                  <div className="space-y-2 mb-2">
                    {getAssignedMembers().map((member) => (
                      <div key={member.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                        <button onClick={() => toggleAssignee(member.id)} className="text-gray-400 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative" ref={assigneePickerRef}>
                    <button onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                      className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2">
                      <User className="w-4 h-4" /><span>Adicionar membro</span>
                    </button>
                    {showAssigneePicker && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 max-h-64 overflow-y-auto">
                        {board.members.map((member) => (
                          <button key={member.id} onClick={() => toggleAssignee(member.id)}
                            className={`w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-100 transition-colors ${selectedAssignees.includes(member.id) ? "bg-primary-50" : ""}`}>
                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                            {selectedAssignees.includes(member.id) && <span className="text-primary-600">✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <div className="relative" ref={priorityPickerRef}>
                    <button onClick={() => setShowPriorityPicker(!showPriorityPicker)}
                      className="w-full px-4 py-2 text-sm text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{priority ? priorityOptions.find((p) => p.value === priority)?.label : "Selecionar"}</span>
                      </div>
                    </button>
                    {showPriorityPicker && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                        {priorityOptions.map((option) => (
                          <button key={option.value}
                            onClick={() => { setPriority(option.value as any); setShowPriorityPicker(false); }}
                            className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${priority === option.value ? option.bg : "hover:bg-gray-100"}`}>
                            <AlertCircle className={`w-4 h-4 ${option.color}`} />
                            <span>{option.label}</span>
                            {priority === option.value && <span className="ml-auto">✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>Criado em {new Date(card.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>Atualizado em {new Date(card.updatedAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button onClick={onDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2">
              <Trash2 className="w-4 h-4" /><span>Excluir card</span>
            </button>
            <div className="flex items-center space-x-3">
              <button onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Fechar
              </button>
              {hasChanges && (
                <button onClick={handleSave}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                  Salvar alterações
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
