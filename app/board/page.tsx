"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, Users, LogOut, UserCircle, Building2, Bell,
  ChevronDown, Package, Battery, Zap, Sun, Upload, Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Notification } from "@/types/notification";
import { Column } from "@/components/board/Column";
import { AddColumnButton } from "@/components/board/AddColumnButton";
import { CardModal } from "@/components/board/CardModal";
import TrelloImportModal from "@/components/board/TrelloImportModal";
import ManageLabelsModal from "@/components/board/ManageLabelsModal";
import type { Board, Column as ColumnType, Card } from "@/types/board";

export default function BoardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<{ card: Card; columnId: string } | null>(null);
  const [companyName, setCompanyName] = useState("Empresa");
  const [userName, setUserName] = useState("Usuário");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCadastros, setShowCadastros] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<Notification[]>([]);
  const [showTrelloImport, setShowTrelloImport] = useState(false);
  const [showManageLabels, setShowManageLabels] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const cadastrosRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    assignee: "ALL", priority: "ALL", dueDate: "ALL", labels: [] as string[],
  });

  // ── Init: Buscar board da API ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchBoard() {
      try {
        const cId = localStorage.getItem("companyId");
        if (!cId) {
          router.push("/select-company");
          return;
        }

        setCompanyId(cId);
        setUserName(session?.user?.name || "Usuário");

        // Buscar board da API
        const response = await fetch(`/api/board?companyId=${cId}`);
        if (!response.ok) throw new Error("Erro ao buscar board");
        
        const data = await response.json();
        
        // Transformar dados da API para o formato do Board
        const boardData: Board = {
          id: data.id,
          title: data.name,
          columns: data.columns.map((col: any) => ({
            id: col.id,
            title: col.title,
            color: col.color,
            cards: col.cards.map((card: any) => ({
              id: card.id,
              title: card.title,
              description: card.description || "",
              labels: card.tags || [],
              assignees: [],
              clientId: card.clientId,
              clientName: card.clientName,
              dueDate: card.dueDate,
              priority: undefined,
              createdAt: card.createdAt,
              updatedAt: card.updatedAt,
            })),
          })),
          members: data.members || [],
          availableLabels: data.availableLabels || [],
        };

        setBoard(boardData);
        
        // Buscar notificações
        const notifsResponse = await fetch("/api/notifications");
        if (notifsResponse.ok) {
          const notifs = await notifsResponse.json();
          setRecentNotifs(notifs.slice(0, 5));
          setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
        }
      } catch (error) {
        console.error("Erro ao carregar board:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchBoard();
    }
  }, [session, router]);

  // Fechar notificações ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node))
        setShowNotifications(false);
    };
    if (showNotifications) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando board...</p>
        </div>
      </div>
    );
  }

  if (!board) return null;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddColumn = async (title: string) => {
    // TODO: Implementar API para adicionar coluna
    const newCol: ColumnType = { id: `col-${Date.now()}`, title, cards: [] };
    setBoard(board ? { ...board, columns: [...board.columns, newCol] } : null);
  };

  const handleDeleteColumn = async (columnId: string) => {
    // TODO: Implementar API para deletar coluna
    setBoard(board ? { ...board, columns: board.columns.filter((c) => c.id !== columnId) } : null);
  };

  const handleUpdateColumn = async (columnId: string, title: string, color?: string) => {
    // TODO: Implementar API para atualizar coluna
    setBoard(board ? {
      ...board,
      columns: board.columns.map((c) => c.id === columnId ? { ...c, title, color } : c),
    } : null);
  };

  const handleCardMove = async (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number
  ) => {
    if (!board) return;
    
    const newColumns = board.columns.map((c) => ({ ...c, cards: [...c.cards] }));
    const src = newColumns.find((c) => c.id === sourceColumnId);
    const tgt = newColumns.find((c) => c.id === targetColumnId);
    if (!src || !tgt) return;

    const cardIdx = src.cards.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;
    const [card] = src.cards.splice(cardIdx, 1);
    tgt.cards.splice(targetIndex, 0, card);

    // Atualizar UI otimisticamente
    setBoard({ ...board, columns: newColumns });

    // Chamar API para mover card
    try {
      await fetch("/api/board/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          columnId: targetColumnId,
          order: targetIndex,
        }),
      });
    } catch (error) {
      console.error("Erro ao mover card:", error);
      // TODO: Reverter mudança em caso de erro
    }
  };

  const handleUpdateCard = async (columnId: string, cardId: string, updates: Partial<Card>) => {
    if (!board) return;
    
    // Atualizar UI otimisticamente
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
    setBoard(newBoard);

    // Chamar API para persistir alterações
    try {
      await fetch("/api/board/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          title: updates.title,
          description: updates.description,
          tags: updates.labels,
          clientId: updates.clientId,
          clientName: updates.clientName,
          dueDate: updates.dueDate,
        }),
      });
    } catch (error) {
      console.error("Erro ao atualizar card:", error);
      alert("Erro ao salvar alterações do card. Tente novamente.");
      // Reverter mudança em caso de erro
      setBoard(board);
    }
  };

  const handleDeleteCard = async (columnId: string, cardId: string) => {
    if (!board) return;
    
    setBoard({
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      ),
    });

    // TODO: Chamar API para deletar card
  };

  const handleAddCard = async (columnId: string, title: string) => {
    if (!board || !companyId) return;
    
    try {
      const response = await fetch("/api/board/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          columnId,
          companyId,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar card");
      
      const newCard = await response.json();
      
      // Atualizar board com o novo card
      setBoard({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, {
            id: newCard.id,
            title: newCard.title,
            description: newCard.description || "",
            labels: newCard.tags || [],
            assignees: [],
            clientId: newCard.clientId,
            clientName: newCard.clientName,
            createdAt: newCard.createdAt,
            updatedAt: newCard.updatedAt,
          }] } : col
        ),
      });
    } catch (error) {
      console.error("Erro ao adicionar card:", error);
      alert("Erro ao criar card. Tente novamente.");
    }
  };

  const handleSaveCard = (updates: Partial<Card>) => {
    if (!selectedCard) return;
    handleUpdateCard(selectedCard.columnId, selectedCard.card.id, updates);
    setSelectedCard({ ...selectedCard, card: { ...selectedCard.card, ...updates } });
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: n.id }),
        });
        
        // Atualizar contadores
        setUnreadCount(prev => prev - 1);
        setRecentNotifs(prev => prev.map(notif => 
          notif.id === n.id ? { ...notif, read: true } : notif
        ));
      } catch (error) {
        console.error("Erro ao marcar notificação:", error);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white">{board.title}</h1>
                <p className="text-xs text-white/50">
                  {board.columns.length} listas • {totalCards} cards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Gerenciar Tags */}
              <button
                onClick={() => setShowManageLabels(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded transition-colors"
                title="Gerenciar tags"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Tags</span>
              </button>

              {/* Importar do Trello */}
              <button
                onClick={() => setShowTrelloImport(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded transition-colors"
                title="Importar board do Trello"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar</span>
              </button>

              {/* Divisor */}
              <div className="w-px h-6 bg-white/10 mx-1"></div>

              {/* Membros */}
              <Link href="/team"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded transition-colors">
                <Users className="w-3.5 h-3.5" />
                <span>{board.members.length}</span>
              </Link>

              {/* Notificações */}
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 text-white/80 hover:bg-white/10 rounded transition-colors">
                  <Bell className="w-4 h-4" />
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

              {/* Divisor */}
              <div className="w-px h-6 bg-white/10 mx-1"></div>

              {/* Clientes */}
              <Link href="/clients"
                className="px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10 rounded transition-colors font-medium">
                Clientes
              </Link>

              {/* Propostas */}
              <Link href="/proposals"
                className="px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10 rounded transition-colors font-medium">
                Propostas
              </Link>

              {/* Calculadora */}
              <Link href="/calculator"
                className="px-2.5 py-1.5 text-xs text-cyan-400 font-semibold hover:bg-white/10 rounded transition-colors">
                Calculadora
              </Link>

              {/* Cadastros */}
              <div className="relative" ref={cadastrosRef}
                onMouseEnter={() => setShowCadastros(true)}
                onMouseLeave={() => setShowCadastros(false)}>
                <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/90 font-medium hover:bg-white/10 rounded transition-colors">
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
                className="px-2.5 py-1.5 text-xs text-white/90 font-medium hover:bg-white/10 rounded transition-colors relative">
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Divisor */}
              <div className="w-px h-6 bg-white/10 mx-1"></div>

              {/* Usuário */}
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10 rounded transition-colors">
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

      {/* ── Board ───────────────────────────────────────────────────────────── */}
      <div className="p-4 overflow-x-auto h-[calc(100vh-60px)]">
        <div className="flex space-x-3 pb-4 h-full">
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

      {/* ── Trello Import Modal ─────────────────────────────────────────────── */}
      {showTrelloImport && companyId && (
        <TrelloImportModal
          companyId={companyId}
          onClose={() => setShowTrelloImport(false)}
          onSuccess={() => {
            setShowTrelloImport(false);
            window.location.reload(); // Recarregar board após importação
          }}
        />
      )}

      {/* ── Manage Labels Modal ──────────────────────────────────────────────── */}
      {showManageLabels && board && (
        <ManageLabelsModal
          currentLabels={board.availableLabels || []}
          onClose={() => setShowManageLabels(false)}
          onSave={async (newLabels) => {
            // Atualizar labels no board
            setBoard({ ...board, availableLabels: newLabels });
            setShowManageLabels(false);
            // TODO: Salvar no backend
          }}
        />
      )}
    </div>
  );
}
