/**
 * API Helper - Funções para chamadas às API Routes
 * 
 * Substitui o localStorage por chamadas HTTP
 */

import type { Client, ClientActivity } from "@/types/client";
import type { Proposal } from "@/types/proposal";
import type { Board, Card } from "@/types/board";
import type { Notification } from "@/types/notification";

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

export async function getClients(companyId: string): Promise<Client[]> {
  const res = await fetch(`/api/clients?companyId=${companyId}`);
  if (!res.ok) throw new Error("Erro ao buscar clientes");
  return res.json();
}

export async function getClientById(id: string): Promise<Client> {
  const res = await fetch(`/api/clients/${id}`);
  if (!res.ok) throw new Error("Cliente não encontrado");
  return res.json();
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error("Erro ao criar cliente");
  return res.json();
}

export async function updateClient(id: string, client: Partial<Client>): Promise<Client> {
  const res = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error("Erro ao atualizar cliente");
  return res.json();
}

export async function deleteClient(id: string): Promise<void> {
  const res = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar cliente");
}

// ─── PROPOSALS ───────────────────────────────────────────────────────────────

export async function getProposals(companyId: string): Promise<Proposal[]> {
  const res = await fetch(`/api/proposals?companyId=${companyId}`);
  if (!res.ok) throw new Error("Erro ao buscar propostas");
  return res.json();
}

export async function getProposalById(id: string): Promise<Proposal> {
  const res = await fetch(`/api/proposals/${id}`);
  if (!res.ok) throw new Error("Proposta não encontrada");
  return res.json();
}

export async function getProposalsByClient(clientId: string): Promise<Proposal[]> {
  const res = await fetch(`/api/proposals?clientId=${clientId}`);
  if (!res.ok) throw new Error("Erro ao buscar propostas");
  return res.json();
}

export async function createProposal(proposal: Partial<Proposal>): Promise<Proposal> {
  const res = await fetch("/api/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposal),
  });
  if (!res.ok) throw new Error("Erro ao criar proposta");
  return res.json();
}

export async function updateProposal(id: string, proposal: Partial<Proposal>): Promise<Proposal> {
  const res = await fetch(`/api/proposals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposal),
  });
  if (!res.ok) throw new Error("Erro ao atualizar proposta");
  return res.json();
}

export async function updateProposalStatus(
  id: string,
  status: Proposal["status"]
): Promise<Proposal> {
  return updateProposal(id, { status });
}

// ─── BOARD ───────────────────────────────────────────────────────────────────

export async function getBoard(companyId: string): Promise<Board> {
  const res = await fetch(`/api/board?companyId=${companyId}`);
  if (!res.ok) throw new Error("Erro ao buscar board");
  return res.json();
}

export async function createCard(card: Partial<Card>): Promise<Card> {
  const res = await fetch("/api/board/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error("Erro ao criar card");
  return res.json();
}

export async function updateCard(cardId: string, updates: Partial<Card>): Promise<Card> {
  const res = await fetch("/api/board/cards", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId, ...updates }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar card");
  return res.json();
}

export async function moveCard(
  cardId: string,
  columnId: string,
  order: number
): Promise<Card> {
  return updateCard(cardId, { columnId, order });
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch("/api/notifications");
  if (!res.ok) throw new Error("Erro ao buscar notificações");
  return res.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const res = await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationId }),
  });
  if (!res.ok) throw new Error("Erro ao marcar notificação como lida");
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const res = await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markAllAsRead: true }),
  });
  if (!res.ok) throw new Error("Erro ao marcar todas as notificações como lidas");
}

export async function createNotification(notification: Partial<Notification>): Promise<Notification> {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
  if (!res.ok) throw new Error("Erro ao criar notificação");
  return res.json();
}

// ─── EQUIPMENT ───────────────────────────────────────────────────────────────

export async function getModules() {
  const res = await fetch("/api/equipment/modules");
  if (!res.ok) throw new Error("Erro ao buscar módulos");
  return res.json();
}

export async function getInverters() {
  const res = await fetch("/api/equipment/inverters");
  if (!res.ok) throw new Error("Erro ao buscar inversores");
  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Erro ao registrar usuário");
  }
  return res.json();
}
