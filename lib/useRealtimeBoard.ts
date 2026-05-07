/**
 * Hook para sincronização em tempo real do board
 * 
 * Este é um exemplo de implementação que pode ser usado com:
 * - Socket.IO
 * - Supabase Realtime
 * - Firebase Realtime Database
 * 
 * Para usar, descomente a implementação desejada
 */

import { useEffect, useState, useCallback } from 'react';
import type { Board, Card, Column } from '@/types/board';

// ============================================
// OPÇÃO 1: Socket.IO (Recomendado)
// ============================================

/*
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useRealtimeBoard(boardId: string, initialBoard: Board) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [editingUsers, setEditingUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'user-1';
    const userName = localStorage.getItem('userName') || 'Usuário';

    // Conectar ao WebSocket
    socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/board-${boardId}`, {
      auth: { userId, userName },
    });

    socket.on('connect', () => {
      console.log('✅ Connected to board:', boardId);
    });

    // Receber lista de usuários online
    socket.on('users:online', (users: string[]) => {
      setOnlineUsers(users);
    });

    // Card movido por outro usuário
    socket.on('card:moved', (data: any) => {
      console.log('📦 Card moved by', data.userName);
      setBoard((prev) => {
        const newColumns = [...prev.columns];
        const sourceColumn = newColumns.find((col) => col.id === data.sourceColumnId);
        const targetColumn = newColumns.find((col) => col.id === data.targetColumnId);

        if (!sourceColumn || !targetColumn) return prev;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === data.cardId);
        if (cardIndex === -1) return prev;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.splice(data.targetIndex, 0, card);

        return { ...prev, columns: newColumns };
      });
    });

    // Card atualizado por outro usuário
    socket.on('card:updated', (data: any) => {
      console.log('✏️ Card updated by', data.userName);
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === data.columnId
            ? {
                ...col,
                cards: col.cards.map((card) =>
                  card.id === data.cardId ? { ...card, ...data.updates } : card
                ),
              }
            : col
        ),
      }));
    });

    // Coluna adicionada por outro usuário
    socket.on('column:added', (data: any) => {
      console.log('➕ Column added by', data.userName);
      setBoard((prev) => ({
        ...prev,
        columns: [...prev.columns, data.column],
      }));
    });

    // Usuário está editando card
    socket.on('card:editing', (data: any) => {
      setEditingUsers((prev) => ({
        ...prev,
        [data.cardId]: data.userName,
      }));
    });

    // Usuário parou de editar
    socket.on('card:editing:stop', (data: any) => {
      setEditingUsers((prev) => {
        const newState = { ...prev };
        delete newState[data.cardId];
        return newState;
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from board');
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [boardId]);

  // Funções para emitir eventos
  const moveCard = useCallback(
    (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
      if (!socket) return;

      // Atualizar localmente (optimistic)
      setBoard((prev) => {
        const newColumns = [...prev.columns];
        const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
        const targetColumn = newColumns.find((col) => col.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return prev;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.splice(targetIndex, 0, card);

        return { ...prev, columns: newColumns };
      });

      // Enviar para servidor
      socket.emit('card:moved', {
        cardId,
        sourceColumnId,
        targetColumnId,
        targetIndex,
      });
    },
    []
  );

  const updateCard = useCallback((columnId: string, cardId: string, updates: Partial<Card>) => {
    if (!socket) return;

    // Atualizar localmente (optimistic)
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : col
      ),
    }));

    // Enviar para servidor
    socket.emit('card:updated', {
      columnId,
      cardId,
      updates,
    });
  }, []);

  const addColumn = useCallback((column: Column) => {
    if (!socket) return;

    // Atualizar localmente (optimistic)
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, column],
    }));

    // Enviar para servidor
    socket.emit('column:added', { column });
  }, []);

  const startEditingCard = useCallback((cardId: string) => {
    if (!socket) return;
    socket.emit('card:editing', { cardId });
  }, []);

  const stopEditingCard = useCallback((cardId: string) => {
    if (!socket) return;
    socket.emit('card:editing:stop', { cardId });
  }, []);

  return {
    board,
    onlineUsers,
    editingUsers,
    moveCard,
    updateCard,
    addColumn,
    startEditingCard,
    stopEditingCard,
  };
}
*/

// ============================================
// OPÇÃO 2: Supabase Realtime (Mais Simples)
// ============================================

/*
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeBoard(boardId: string, initialBoard: Board) {
  const [board, setBoard] = useState<Board>(initialBoard);

  useEffect(() => {
    // Escutar mudanças em cards
    const cardsChannel = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          console.log('Card change:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setBoard((prev) => ({
              ...prev,
              columns: prev.columns.map((col) => ({
                ...col,
                cards: col.cards.map((card) =>
                  card.id === payload.new.id ? { ...card, ...payload.new } : card
                ),
              })),
            }));
          }
        }
      )
      .subscribe();

    // Escutar mudanças em colunas
    const columnsChannel = supabase
      .channel('columns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          console.log('Column change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBoard((prev) => ({
              ...prev,
              columns: [...prev.columns, payload.new as Column],
            }));
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(cardsChannel);
      supabase.removeChannel(columnsChannel);
    };
  }, [boardId]);

  const moveCard = useCallback(
    async (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
      // Atualizar localmente (optimistic)
      setBoard((prev) => {
        const newColumns = [...prev.columns];
        const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
        const targetColumn = newColumns.find((col) => col.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return prev;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.splice(targetIndex, 0, card);

        return { ...prev, columns: newColumns };
      });

      // Salvar no banco (Supabase sincroniza automaticamente)
      await supabase
        .from('cards')
        .update({
          column_id: targetColumnId,
          position: targetIndex,
        })
        .eq('id', cardId);
    },
    []
  );

  return {
    board,
    moveCard,
  };
}
*/

// ============================================
// OPÇÃO 3: Mock (Para Desenvolvimento)
// ============================================

export function useRealtimeBoard(boardId: string, initialBoard: Board) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [onlineUsers] = useState<string[]>(['Você']);
  const [editingUsers] = useState<Record<string, string>>({});

  // Simular sincronização (sem backend real)
  const moveCard = useCallback(
    (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
      setBoard((prev) => {
        const newColumns = [...prev.columns];
        const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
        const targetColumn = newColumns.find((col) => col.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return prev;

        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.splice(targetIndex, 0, card);

        return { ...prev, columns: newColumns };
      });

      console.log('📦 Card moved (mock):', { cardId, sourceColumnId, targetColumnId, targetIndex });
    },
    []
  );

  const updateCard = useCallback((columnId: string, cardId: string, updates: Partial<Card>) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : col
      ),
    }));

    console.log('✏️ Card updated (mock):', { columnId, cardId, updates });
  }, []);

  const addColumn = useCallback((column: Column) => {
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, column],
    }));

    console.log('➕ Column added (mock):', column);
  }, []);

  const startEditingCard = useCallback((cardId: string) => {
    console.log('🔒 Started editing card (mock):', cardId);
  }, []);

  const stopEditingCard = useCallback((cardId: string) => {
    console.log('🔓 Stopped editing card (mock):', cardId);
  }, []);

  return {
    board,
    onlineUsers,
    editingUsers,
    moveCard,
    updateCard,
    addColumn,
    startEditingCard,
    stopEditingCard,
  };
}
