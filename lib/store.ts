/**
 * STORE CENTRAL — Persistência via localStorage
 *
 * Todos os dados mutáveis do app passam por aqui.
 * Cada entidade tem:
 *   - _data: array em memória (fonte de verdade durante a sessão)
 *   - load(): hidrata _data do localStorage na inicialização
 *   - save(): persiste _data no localStorage
 *   - funções CRUD que chamam save() automaticamente
 *
 * Correlações automáticas:
 *   - Criar proposta → atualiza cliente (status, projectIds, proposalValue) + atividade + notificação
 *   - Mover card → atualiza cliente (status) + atividade + notificação
 *   - Vincular card a cliente → atividade no cliente
 *   - Aceitar/rejeitar proposta → atualiza cliente (status, closedValue) + atividade + notificação
 */

import type { Client, ClientActivity, ClientStatus, ActivityType } from "@/types/client";
import type { Proposal } from "@/types/proposal";
import type { Board, Card } from "@/types/board";
import type { Notification } from "@/types/notification";
import { mockClients, mockClientActivities } from "@/lib/mockClientData";
import { mockBoard } from "@/lib/mockData";
import { _proposals as seedProposals } from "@/lib/mockProposalData";

// ─── Keys do localStorage ────────────────────────────────────────────────────
const KEYS = {
  clients: "crm_clients",
  activities: "crm_activities",
  proposals: "crm_proposals",
  board: "crm_board",
  notifications: "crm_notifications",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded — ignore
  }
}

function loadObjectFromStorage<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function saveObjectToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
let _clients: Client[] = [];
let _activities: ClientActivity[] = [];

export function initClients() {
  _clients = loadFromStorage(KEYS.clients, mockClients);
  _activities = loadFromStorage(KEYS.activities, mockClientActivities);
}

export function getClients(): Client[] {
  if (_clients.length === 0) initClients();
  return _clients;
}

export function getClientById(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function getCompanyClients(companyId: string): Client[] {
  return getClients().filter((c) => c.companyId === companyId);
}

export function saveClient(client: Client): void {
  const idx = _clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) {
    _clients[idx] = { ...client, updatedAt: new Date().toISOString() };
  } else {
    _clients.unshift(client);
  }
  saveToStorage(KEYS.clients, _clients);
}

export function addClient(client: Client): Client {
  _clients.unshift(client);
  saveToStorage(KEYS.clients, _clients);
  // Notificação
  addNotification({
    type: "NOVO_CLIENTE",
    title: "Novo cliente cadastrado",
    message: `${client.name} foi adicionado ao sistema`,
    userId: client.createdBy,
    actionUrl: `/clients/${client.id}`,
    actionLabel: "Ver cliente",
    relatedEntityId: client.id,
    relatedEntityType: "CLIENT",
  });
  return client;
}

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export function getClientActivities(clientId: string): ClientActivity[] {
  if (_activities.length === 0) initClients();
  return _activities
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addActivity(activity: ClientActivity): void {
  if (_activities.length === 0) initClients();
  _activities.unshift(activity);
  saveToStorage(KEYS.activities, _activities);
}

// ─── PROPOSALS ───────────────────────────────────────────────────────────────
let _proposals: Proposal[] = [];

export function initProposals() {
  _proposals = loadFromStorage(KEYS.proposals, seedProposals);
}

export function getAllProposals(): Proposal[] {
  if (_proposals.length === 0) initProposals();
  return _proposals;
}

export function getProposalById(id: string): Proposal | undefined {
  return getAllProposals().find((p) => p.id === id);
}

export function getProposalsByClient(clientId: string): Proposal[] {
  return getAllProposals().filter((p) => p.clientId === clientId);
}

export function getProposalsByCompany(companyId: string): Proposal[] {
  return getAllProposals().filter((p) => p.companyId === companyId);
}

export function addProposal(proposal: Proposal): Proposal {
  if (_proposals.length === 0) initProposals();
  _proposals.unshift(proposal);
  saveToStorage(KEYS.proposals, _proposals);

  // ── Correlação: atualizar cliente ──────────────────────────────────────────
  if (proposal.clientId && !proposal.clientId.startsWith("new-")) {
    const client = getClientById(proposal.clientId);
    if (client) {
      const updated: Client = {
        ...client,
        status: "PROPOSAL" as any,
        proposalValue: proposal.financial.totalCost,
        projectIds: [...new Set([...client.projectIds, proposal.id])],
        updatedAt: new Date().toISOString(),
        lastContactAt: new Date().toISOString(),
      };
      saveClient(updated);

      // Atividade no cliente
      addActivity({
        id: `act-${Date.now()}`,
        clientId: client.id,
        userId: proposal.createdBy,
        userName: "Sistema",
        type: "PROPOSAL_SENT" as any,
        description: `Proposta gerada: ${proposal.system.totalPower.toFixed(2)} kWp — ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(proposal.financial.totalCost)}`,
        metadata: { proposalId: proposal.id, value: proposal.financial.totalCost },
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Notificação
  addNotification({
    type: "PROPOSTA_ACEITA",
    title: "Nova proposta gerada",
    message: `Proposta para ${proposal.client.name} — ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(proposal.financial.totalCost)}`,
    userId: proposal.createdBy,
    actionUrl: `/proposals/${proposal.id}`,
    actionLabel: "Ver proposta",
    relatedEntityId: proposal.id,
    relatedEntityType: "PROPOSAL",
  });

  return proposal;
}

export function updateProposalStatus(
  proposalId: string,
  status: Proposal["status"],
  userId: string
): void {
  const idx = _proposals.findIndex((p) => p.id === proposalId);
  if (idx < 0) return;

  const proposal = _proposals[idx];
  _proposals[idx] = {
    ...proposal,
    status,
    updatedAt: new Date().toISOString(),
    ...(status === "ACEITA" ? { acceptedAt: new Date().toISOString() } : {}),
    ...(status === "REJEITADA" ? { rejectedAt: new Date().toISOString() } : {}),
    ...(status === "ENVIADA" ? { sentAt: new Date().toISOString() } : {}),
  };
  saveToStorage(KEYS.proposals, _proposals);

  // ── Correlação: atualizar cliente ──────────────────────────────────────────
  if (proposal.clientId && !proposal.clientId.startsWith("new-")) {
    const client = getClientById(proposal.clientId);
    if (client) {
      const clientUpdates: Partial<Client> = { updatedAt: new Date().toISOString() };
      if (status === "ACEITA") {
        clientUpdates.status = "WON" as any;
        clientUpdates.closedValue = proposal.financial.totalCost;
      } else if (status === "REJEITADA") {
        clientUpdates.status = "LOST" as any;
      }
      saveClient({ ...client, ...clientUpdates });

      addActivity({
        id: `act-${Date.now()}`,
        clientId: client.id,
        userId,
        userName: "Sistema",
        type: "STATUS_CHANGE" as any,
        description: `Proposta ${status === "ACEITA" ? "aceita" : status === "REJEITADA" ? "rejeitada" : "atualizada"}: ${proposal.system.totalPower.toFixed(2)} kWp`,
        metadata: { proposalId, status },
        createdAt: new Date().toISOString(),
      });
    }
  }

  addNotification({
    type: status === "ACEITA" ? "PROPOSTA_ACEITA" : "PROPOSTA_REJEITADA",
    title: status === "ACEITA" ? "Proposta aceita!" : "Proposta rejeitada",
    message: `Proposta de ${proposal.client.name} foi ${status === "ACEITA" ? "aceita" : "rejeitada"}`,
    userId,
    actionUrl: `/proposals/${proposalId}`,
    actionLabel: "Ver proposta",
    relatedEntityId: proposalId,
    relatedEntityType: "PROPOSAL",
  });
}

export function generateProposalId(): string {
  return `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── BOARD ────────────────────────────────────────────────────────────────────
let _board: Board | null = null;

export function initBoard(companyId = "company-1") {
  const key = `${KEYS.board}_${companyId}`;
  _board = loadObjectFromStorage<Board | null>(key, null) ?? mockBoard;
}

export function getBoard(companyId = "company-1"): Board {
  if (!_board) initBoard(companyId);
  return _board!;
}

export function saveBoard(board: Board, companyId = "company-1"): void {
  _board = board;
  const key = `${KEYS.board}_${companyId}`;
  saveObjectToStorage(key, board);
}

/**
 * Chamado quando um card é movido entre colunas.
 * Atualiza o cliente vinculado se houver.
 */
export function onCardMoved(
  card: Card,
  fromColumnTitle: string,
  toColumnTitle: string,
  userId: string
): void {
  if (!card.clientId) return;
  const client = getClientById(card.clientId);
  if (!client) return;

  // Mapeamento coluna → status do cliente
  const columnToStatus: Record<string, string> = {
    "leads": "LEAD",
    "dimensionamento": "QUALIFIED",
    "proposta": "PROPOSAL",
    "negociação": "NEGOTIATION",
    "negociacao": "NEGOTIATION",
    "instalação": "WON",
    "instalacao": "WON",
    "concluído": "WON",
    "concluido": "WON",
  };

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z]/g, "");

  const newStatus = columnToStatus[normalize(toColumnTitle)];
  if (newStatus && newStatus !== client.status) {
    saveClient({ ...client, status: newStatus as any });
    addActivity({
      id: `act-${Date.now()}`,
      clientId: client.id,
      userId,
      userName: "Sistema",
      type: "CARD_MOVED" as any,
      description: `Card movido de "${fromColumnTitle}" para "${toColumnTitle}"`,
      metadata: { cardId: card.id, from: fromColumnTitle, to: toColumnTitle },
      createdAt: new Date().toISOString(),
    });
    addNotification({
      type: "CARD_MOVIDO",
      title: "Card movido",
      message: `${card.title} → ${toColumnTitle}`,
      userId,
      actionUrl: `/board`,
      actionLabel: "Ver board",
      relatedEntityId: card.id,
      relatedEntityType: "CARD",
    });
  }
}

/**
 * Chamado quando um cliente é vinculado a um card.
 */
export function onCardClientLinked(
  card: Card,
  clientId: string,
  userId: string
): void {
  const client = getClientById(clientId);
  if (!client) return;
  addActivity({
    id: `act-${Date.now()}`,
    clientId,
    userId,
    userName: "Sistema",
    type: "CARD_ASSIGNED" as any,
    description: `Cliente vinculado ao card "${card.title}" no board`,
    metadata: { cardId: card.id },
    createdAt: new Date().toISOString(),
  });
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
let _notifications: Notification[] = [];

export function initNotifications(userId: string) {
  const key = `${KEYS.notifications}_${userId}`;
  if (_notifications.length === 0) {
    _notifications = loadFromStorage<Notification>(key, []);
    // Seed com notificações iniciais se vazio
    if (_notifications.length === 0) {
      const { generateMockNotifications } = require("@/lib/mockNotificationData");
      _notifications = generateMockNotifications(userId, 20);
      saveToStorage(key, _notifications);
    }
  }
}

export function getNotifications(userId: string): Notification[] {
  initNotifications(userId);
  return _notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

export function markAsRead(userId: string, notificationId: string): void {
  const n = _notifications.find((n) => n.id === notificationId);
  if (n) {
    n.read = true;
    saveToStorage(`${KEYS.notifications}_${userId}`, _notifications);
  }
}

export function markAllAsRead(userId: string): void {
  _notifications.forEach((n) => (n.read = true));
  saveToStorage(`${KEYS.notifications}_${userId}`, _notifications);
}

interface NewNotification {
  type: Notification["type"];
  title: string;
  message: string;
  userId: string;
  actionUrl?: string;
  actionLabel?: string;
  relatedEntityId?: string;
  relatedEntityType?: Notification["relatedEntityType"];
  fromUserId?: string;
  fromUserName?: string;
}

export function addNotification(n: NewNotification): void {
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    type: n.type,
    title: n.title,
    message: n.message,
    userId: n.userId,
    actionUrl: n.actionUrl,
    actionLabel: n.actionLabel,
    relatedEntityId: n.relatedEntityId,
    relatedEntityType: n.relatedEntityType,
    fromUserId: n.fromUserId,
    fromUserName: n.fromUserName,
    read: false,
    createdAt: new Date().toISOString(),
  };
  _notifications.unshift(notification);
  saveToStorage(`${KEYS.notifications}_${n.userId}`, _notifications);
}

// ─── RESET (útil para testes) ─────────────────────────────────────────────────
export function resetStore(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => {
    // Remove todas as chaves que começam com os prefixos conhecidos
    Object.keys(localStorage)
      .filter((key) => key.startsWith(k))
      .forEach((key) => localStorage.removeItem(key));
  });
  _clients = [];
  _activities = [];
  _proposals = [];
  _board = null;
  _notifications = [];
}
