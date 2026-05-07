"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, Users, LogOut, UserCircle, Building2, Bell,
  ChevronDown, Package, Battery, Zap, Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getBoard, saveBoard, onCardMoved, onCardClientLinked,
  getNotifications, getUnreadCount, markAsRead,
} from "@/lib/store";
import type { Notification } from "@/types/notification";
import { Column } from "@/components/board/Column";
import { AddColumnButton } from "@/components/board/AddColumnButton";
import { CardModal } from "@/components/board/CardModal";
import { mockCompanies } from "@/lib/mockAuthData";
import type { Board, Column as ColumnType, Card } from "@/types/board";

export default function BoardPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("company-1");
  const [userId, setUserId] = useState("user-1");
  const [board, setBoard] = useState<Board | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ card: Card; columnId: string } | null>(null);
  const [companyName, setCompanyName] = useState("Solar Tech Ltda");
  const [userName, setUserName] = useState("Usuário");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCadastros, setShowCadastros] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<Notification[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const cadastrosRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    assignee: "ALL", priority: "ALL", dueDate: "ALL", labels: [] as string[],
  });

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const cId = localStorage.getItem("companyId") || "company-1";
    const uId = localStorage.getItem("userId") || "user-1";
    const uName = localStorage.getItem("userName") || "Carlos Silva";
    setCompanyId(cId);
    setUserId(uId);
    setUserName(uName);

    const company = mockCompanies.find((c) => c.id === cId);
    if (company) setCompanyName(company.name);

    // Carrega board do store (localStorage → seed)
    const b = getBoard(cId);
    setBoard(b);

    // Notificações
    setUnreadCount(getUnreadCount(uId));
    setRecentNotifs(getNotifications(uId).slice(0, 5));
  }, []);

  // Fechar notificações ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node))
        setShowNotifications(false);
    };
    if (showNotifications) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  // ── Persistência: salva no store sempre que o board muda ────────────────────
  const updateBoard = useCallback(
    (newBoard: Board) => {
      setBoard(newBoard);
      saveBoard(newBoard, companyId);
    },
    [companyId]
  );

  if (!board) return null;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddColumn = (title: string) => {
    const newCol: ColumnType = { id: `col-${Date.now()}`, title, cards: [] };
    updateBoard({ ...board, columns: [...board.columns, newCol] });
  };

  const handleDeleteColumn = (columnId: string) => {
    updateBoard({ ...board, columns: board.columns.filter((c) => c.id !== columnId) });
  };

  const handleUpdateColumn = (columnId: string, title: string, color?: string) => {
    updateBoard({
      ...board,
      columns: board.columns.map((c) => c.id === columnId ? { ...c, title, color } : c),
    });
  };

  const handleCardMove = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number
  ) => {
    const newColumns = board.columns.map((c) => ({ ...c, cards: [...c.cards] }));
    const src = newColumns.find((c) => c.id === sourceColumnId);
    const tgt = newColumns.find((c) => c.id === targetColumnId);
    if (!src || !tgt) return;

    const cardIdx = src.cards.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;
    const [card] = src.cards.splice(cardIdx, 1);
    tgt.cards.splice(targetIndex, 0, card);

    const newBoard = { ...board, columns: newColumns };
    updateBoard(newBoard);

    // ── Correlação: atualiza cliente se card tiver clientId ──────────────────
    if (sourceColumnId !== targetColumnId) {
      const srcTitle = board.columns.find((c) => c.id === sourceColumnId)?.title ?? "";
      const tgtTitle = newColumns.find((c) => c.id === targetColumnId)?.title ?? "";
      onCardMoved(card, srcTitle, tgtTitle, userId);
    }
  };

  const handleUpdateCard = (columnId: string, cardId: string, updates: Partial<Card>) => {
    // Detectar se o cliente foi vinculado agora
    const oldCard = board.columns
      .find((c) => c.id === columnId)?.cards
      .find((c) => c.id === cardId);

    if (updates.clientId && updates.clientId !== oldCard?.clientId) {
      onCardClientLinked({ ...oldCard!, ...updates } as Card, updates.clientId, userId);
    }

    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId
                  ? { ...card, ...updates, updatedAt: new Date().toISOString() }
                  : card
              ),
            }
          : col
      ),
    };
    updateBoard(newBoard);
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    updateBoard({
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      ),
    });
  };

  const handleAddCard = (columnId: string, title: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description: "",
      labels: [],
      assignees: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateBoard({
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      ),
    });
  };

  const handleSaveCard = (updates: Partial<Card>) => {
    if (!selectedCard) return;
    handleUpdateCard(selectedCard.columnId, selectedCard.card.id, updates);
    setSelectedCard({ ...selectedCard, card: { ...selectedCard.card, ...updates } });
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      markAsRead(userId, n.id);
      setUnreadCount(getUnreadCount(userId));
      setRecentNotifs(getNotifications(userId).slice(0, 5));
    }
    setShowNotifications(false);
    if (n.actionUrl) router.push(n.actionUrl);
  };

  // ── Filtros ─────────────────────────────────────────────────────────────────
  const filteredBoard: Board = (() => {
    if (
      filters.assignee === "ALL" &&
      filters.priority === "ALL" &&
      filters.dueDate === "ALL" &&
      filters.labels.length === 0
    )
      return board;

    return {
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => {
          if (filters.assignee !== "ALL" && !card.assignees.includes(filters.assignee)) return false;
          if (filters.priority !== "ALL" && card.priority !== filters.priority) return false;
          if (filters.dueDate !== "ALL") {
            const today = new Date();
            const due = card.dueDate ? new Date(card.dueDate) : null;
            if (filters.dueDate === "OVERDUE" && (!due || due >= today)) return false;
            if (filters.dueDate === "TODAY" && (!due || due.toDateString() !== today.toDateString())) return false;
            if (filters.dueDate === "WEEK") {
              const week = new Date(today.getTime() + 7 * 86400000);
              if (!due || due > week) return false;
            }
          }
          if (filters.labels.length > 0 && !filters.labels.some((l) => card.labels.includes(l))) return false;
          return true;
        }),
      })),
    };
  })();

  const activeFiltersCount =
    (filters.assignee !== "ALL" ? 1 : 0) +
    (filters.priority !== "ALL" ? 1 : 0) +
    (filters.dueDate !== "ALL" ? 1 : 0) +
    filters.labels.length;

  const totalCards = board.columns.reduce((a, c) => a + c.cards.length, 0);

  const notifIcon: Record<string, string> = {
    PROPOSTA_ACEITA: "✅", PROPOSTA_REJEITADA: "❌", NOVO_CLIENTE: "👤",
    CLIENTE_ATUALIZADO: "📝", CARD_ATRIBUIDO: "📌", CARD_MOVIDO: "➡️",
    COMENTARIO: "💬", VENCIMENTO_PROXIMO: "⏰", TAREFA_CONCLUIDA: "✔️",
    MEMBRO_ADICIONADO: "👥", SISTEMA: "⚙️",
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Agora";
    if (m < 60) return `${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const days = Math.floor(h / 24);
    if (days === 1) return "Ontem";
    if (days < 7) return `${days}d`;
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{board.title}</h1>
                <p className="text-xs text-gray-500">
                  {board.columns.length} colunas • {totalCards} cards
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Membros */}
              <Link href="/team"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                <span>{board.members.length} membros</span>
              </Link>

              {/* Notificações */}
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-[600px] overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                      <Link href="/notifications" onClick={() => setShowNotifications(false)}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        Ver todas
                      </Link>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {recentNotifs.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">Nenhuma notificação</p>
                        </div>
                      ) : (
                        recentNotifs.map((n) => (
                          <button key={n.id} onClick={() => handleNotificationClick(n)}
                            className={`w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${!n.read ? "bg-blue-50" : ""}`}>
                            <div className="flex items-start space-x-3">
                              <div className="text-xl mt-0.5 flex-shrink-0">{notifIcon[n.type] ?? "🔔"}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">{n.title}</h4>
                                  {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{n.message}</p>
                                <span className="text-xs text-gray-500">{timeAgo(n.createdAt)}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    {recentNotifs.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <Link href="/notifications" onClick={() => setShowNotifications(false)}
                          className="block text-center text-sm text-primary-600 hover:text-primary-800 font-medium">
                          Ver todas as notificações →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Clientes */}
              <Link href="/clients"
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Clientes
              </Link>

              {/* Propostas */}
              <Link href="/proposals"
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Propostas
              </Link>

              {/* Cadastros */}
              <div className="relative" ref={cadastrosRef}
                onMouseEnter={() => setShowCadastros(true)}
                onMouseLeave={() => setShowCadastros(false)}>
                <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <span>Cadastros</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showCadastros && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {[
                      { href: "/modules", icon: <Sun className="w-4 h-4 text-yellow-600" />, label: "Módulos" },
                      { href: "/inverters", icon: <Zap className="w-4 h-4 text-blue-600" />, label: "Inversores" },
                      { href: "/batteries", icon: <Battery className="w-4 h-4 text-green-600" />, label: "Baterias" },
                      { href: "/optimizers", icon: <Package className="w-4 h-4 text-purple-600" />, label: "Otimizadores" },
                    ].map((item) => (
                      <Link key={item.href} href={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        {item.icon}<span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtros */}
              <button onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Usuário */}
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <UserCircle className="w-4 h-4" />
                  <span>{userName}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">{companyName}</p>
                    </div>
                    <Link href="/settings/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <UserCircle className="w-4 h-4" /><span>Meu Perfil</span>
                    </Link>
                    <Link href="/settings/company" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Building2 className="w-4 h-4" /><span>Configurações da Empresa</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2" />
                    <Link href="/select-company" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Users className="w-4 h-4" /><span>Trocar empresa</span>
                    </Link>
                    <Link href="/team" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Users className="w-4 h-4" /><span>Gerenciar equipe</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2" />
                    <button onClick={() => { localStorage.clear(); router.push("/login"); }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /><span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Responsável", key: "assignee", options: [{ value: "ALL", label: "Todos" }, ...board.members.map((m) => ({ value: m.id, label: m.name }))] },
              { label: "Prioridade", key: "priority", options: [{ value: "ALL", label: "Todas" }, { value: "high", label: "Alta" }, { value: "medium", label: "Média" }, { value: "low", label: "Baixa" }] },
              { label: "Vencimento", key: "dueDate", options: [{ value: "ALL", label: "Todos" }, { value: "OVERDUE", label: "Atrasados" }, { value: "TODAY", label: "Hoje" }, { value: "WEEK", label: "Esta semana" }] },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                <select value={(filters as any)[f.key]}
                  onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
            <div className="flex items-end">
              <button onClick={() => setFilters({ assignee: "ALL", priority: "ALL", dueDate: "ALL", labels: [] })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Board ───────────────────────────────────────────────────────────── */}
      <div className="p-6 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {filteredBoard.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onDelete={handleDeleteColumn}
              onUpdate={handleUpdateColumn}
              onCardMove={handleCardMove}
              onCardClick={(card, colId) => setSelectedCard({ card, columnId: colId })}
              onDeleteCard={handleDeleteCard}
              onAddCard={handleAddCard}
              members={board.members}
            />
          ))}
          <AddColumnButton onAdd={handleAddColumn} />
        </div>
      </div>

      {/* ── Card Modal ──────────────────────────────────────────────────────── */}
      {selectedCard && (
        <CardModal
          card={selectedCard.card}
          columnId={selectedCard.columnId}
          board={board}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCard}
          onDelete={() => {
            handleDeleteCard(selectedCard.columnId, selectedCard.card.id);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
