# 🔄 Guia de Sincronização em Tempo Real

## Problema

Quando 2+ usuários editam o mesmo board simultaneamente:
- ❌ Mudanças de um usuário sobrescrevem as do outro
- ❌ Cards "pulam" de posição inesperadamente
- ❌ Dados ficam inconsistentes
- ❌ Usuários não veem as mudanças dos outros

## Solução: Sincronização em Tempo Real

### Tecnologias Recomendadas

#### 1. **WebSockets** (Recomendado para MVP)
- ✅ Comunicação bidirecional em tempo real
- ✅ Baixa latência
- ✅ Simples de implementar
- ✅ Suporte nativo no navegador
- 📦 Bibliotecas: Socket.IO, ws

#### 2. **Server-Sent Events (SSE)**
- ✅ Unidirecional (servidor → cliente)
- ✅ Mais simples que WebSockets
- ❌ Não permite cliente → servidor em tempo real
- 📦 Nativo no navegador

#### 3. **Firebase Realtime Database**
- ✅ Sincronização automática
- ✅ Offline-first
- ✅ Fácil de usar
- ❌ Vendor lock-in
- ❌ Custo pode escalar

#### 4. **Supabase Realtime**
- ✅ Open source
- ✅ PostgreSQL com realtime
- ✅ Sincronização automática
- ✅ Self-hosted ou cloud

---

## Arquitetura Recomendada

### Opção 1: WebSockets com Socket.IO (Recomendado)

```
┌─────────────┐         WebSocket          ┌─────────────┐
│  Usuário 1  │ ←─────────────────────────→ │             │
│  (Browser)  │                             │   Servidor  │
└─────────────┘                             │   Node.js   │
                                            │  Socket.IO  │
┌─────────────┐         WebSocket          │             │
│  Usuário 2  │ ←─────────────────────────→ │             │
│  (Browser)  │                             └─────────────┘
└─────────────┘                                    ↓
                                            ┌─────────────┐
┌─────────────┐         WebSocket          │  PostgreSQL │
│  Usuário 3  │ ←─────────────────────────→ │  (Banco)    │
│  (Browser)  │                             └─────────────┘
└─────────────┘
```

### Fluxo de Dados

1. **Usuário 1** move um card
2. **Cliente** envia evento via WebSocket: `card:moved`
3. **Servidor** valida e salva no banco
4. **Servidor** broadcast para todos os clientes: `card:moved`
5. **Usuários 2 e 3** recebem e atualizam UI automaticamente

---

## Implementação com Socket.IO

### 1. Instalar Dependências

```bash
npm install socket.io socket.io-client
```

### 2. Servidor (Backend)

```typescript
// server/socket.ts
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Namespace por board (isolamento)
  io.of(/^\/board-\w+$/).on('connection', (socket) => {
    const boardId = socket.nsp.name.replace('/board-', '');
    console.log(`User connected to board ${boardId}`);

    // Entrar na sala do board
    socket.join(boardId);

    // Evento: Card movido
    socket.on('card:moved', async (data) => {
      try {
        // Validar permissões
        const userId = socket.data.userId;
        const hasPermission = await checkPermission(userId, boardId);
        if (!hasPermission) {
          socket.emit('error', { message: 'Sem permissão' });
          return;
        }

        // Salvar no banco
        await updateCardPosition(data);

        // Broadcast para todos (exceto quem enviou)
        socket.to(boardId).emit('card:moved', {
          ...data,
          userId,
          timestamp: Date.now(),
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Evento: Card editado
    socket.on('card:updated', async (data) => {
      try {
        await updateCard(data);
        socket.to(boardId).emit('card:updated', {
          ...data,
          userId: socket.data.userId,
          timestamp: Date.now(),
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Evento: Coluna adicionada
    socket.on('column:added', async (data) => {
      try {
        await createColumn(data);
        socket.to(boardId).emit('column:added', {
          ...data,
          userId: socket.data.userId,
          timestamp: Date.now(),
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Evento: Usuário está editando card
    socket.on('card:editing', (data) => {
      socket.to(boardId).emit('card:editing', {
        cardId: data.cardId,
        userId: socket.data.userId,
        userName: socket.data.userName,
      });
    });

    // Evento: Usuário parou de editar
    socket.on('card:editing:stop', (data) => {
      socket.to(boardId).emit('card:editing:stop', {
        cardId: data.cardId,
        userId: socket.data.userId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from board ${boardId}`);
    });
  });

  return io;
}
```

### 3. Cliente (Frontend)

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectToBoard(boardId: string, userId: string, userName: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/board-${boardId}`, {
    auth: {
      userId,
      userName,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to board:', boardId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from board');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
}

export function disconnectFromBoard() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
```

### 4. Usar no Componente Board

```typescript
// app/board/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { connectToBoard, disconnectFromBoard, getSocket } from '@/lib/socket';

export default function BoardPage() {
  const [board, setBoard] = useState<Board>(mockBoard);
  const [editingUsers, setEditingUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const boardId = 'board-1';
    const userId = localStorage.getItem('userId') || 'user-1';
    const userName = localStorage.getItem('userName') || 'Usuário';

    // Conectar ao WebSocket
    const socket = connectToBoard(boardId, userId, userName);

    // Escutar eventos de outros usuários
    socket.on('card:moved', (data) => {
      console.log('Card moved by another user:', data);
      // Atualizar board localmente
      handleCardMoveFromServer(data);
    });

    socket.on('card:updated', (data) => {
      console.log('Card updated by another user:', data);
      handleCardUpdateFromServer(data);
    });

    socket.on('column:added', (data) => {
      console.log('Column added by another user:', data);
      handleColumnAddFromServer(data);
    });

    socket.on('card:editing', (data) => {
      console.log('User is editing card:', data);
      setEditingUsers((prev) => ({
        ...prev,
        [data.cardId]: data.userName,
      }));
    });

    socket.on('card:editing:stop', (data) => {
      setEditingUsers((prev) => {
        const newState = { ...prev };
        delete newState[data.cardId];
        return newState;
      });
    });

    // Cleanup ao desmontar
    return () => {
      disconnectFromBoard();
    };
  }, []);

  const handleCardMove = (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
    // Atualizar localmente (otimista)
    const newColumns = [...board.columns];
    const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
    const targetColumn = newColumns.find((col) => col.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;

    const [card] = sourceColumn.cards.splice(cardIndex, 1);
    targetColumn.cards.splice(targetIndex, 0, card);

    setBoard({ ...board, columns: newColumns });

    // Enviar para servidor
    const socket = getSocket();
    if (socket) {
      socket.emit('card:moved', {
        cardId,
        sourceColumnId,
        targetColumnId,
        targetIndex,
      });
    }
  };

  const handleCardMoveFromServer = (data: any) => {
    // Atualizar board com dados do servidor
    const newColumns = [...board.columns];
    const sourceColumn = newColumns.find((col) => col.id === data.sourceColumnId);
    const targetColumn = newColumns.find((col) => col.id === data.targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const cardIndex = sourceColumn.cards.findIndex((c) => c.id === data.cardId);
    if (cardIndex === -1) return;

    const [card] = sourceColumn.cards.splice(cardIndex, 1);
    targetColumn.cards.splice(data.targetIndex, 0, card);

    setBoard({ ...board, columns: newColumns });
  };

  // ... resto do código
}
```

---

## Estratégias de Resolução de Conflitos

### 1. **Last Write Wins (LWW)**
- Última mudança sobrescreve as anteriores
- ✅ Simples de implementar
- ❌ Pode perder dados

### 2. **Operational Transformation (OT)**
- Transforma operações concorrentes
- ✅ Não perde dados
- ❌ Complexo de implementar
- 📦 Usado por: Google Docs

### 3. **Conflict-free Replicated Data Types (CRDT)**
- Estruturas de dados que convergem automaticamente
- ✅ Não perde dados
- ✅ Funciona offline
- ❌ Muito complexo
- 📦 Usado por: Figma, Notion

### 4. **Locking (Pessimista)**
- Usuário "trava" o card ao editar
- ✅ Evita conflitos
- ❌ Ruim para UX
- ❌ Pode travar se usuário sair sem desbloquear

### 5. **Optimistic UI + Merge (Recomendado)**
- Atualiza UI imediatamente
- Envia para servidor
- Servidor valida e faz merge
- ✅ Boa UX
- ✅ Resolve conflitos
- ⚠️ Requer lógica de merge

---

## Implementação Recomendada para SolarSystem

### Fase 1: Básico (MVP)
1. ✅ WebSocket com Socket.IO
2. ✅ Broadcast de mudanças
3. ✅ Optimistic UI
4. ✅ Last Write Wins

### Fase 2: Melhorias
1. ✅ Indicador de "quem está editando"
2. ✅ Cursor de outros usuários
3. ✅ Notificações de mudanças
4. ✅ Histórico de ações (undo/redo)

### Fase 3: Avançado
1. ✅ Operational Transformation
2. ✅ Suporte offline
3. ✅ Sincronização ao reconectar
4. ✅ Versionamento de dados

---

## Indicadores Visuais

### 1. Quem Está Editando

```typescript
// Mostrar badge no card
{editingUsers[card.id] && (
  <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center space-x-1">
    <Edit2 className="w-3 h-3" />
    <span>{editingUsers[card.id]} está editando</span>
  </div>
)}
```

### 2. Usuários Online

```typescript
// Mostrar avatares de usuários online
<div className="flex -space-x-2">
  {onlineUsers.map((user) => (
    <div
      key={user.id}
      className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-white text-xs"
      title={user.name}
    >
      {user.name.charAt(0)}
    </div>
  ))}
</div>
```

### 3. Notificação de Mudança

```typescript
// Toast quando outro usuário faz mudança
toast.info(`${userName} moveu o card "${cardTitle}"`);
```

---

## Alternativas Mais Simples

### 1. **Polling (Não Recomendado)**
```typescript
// Buscar atualizações a cada X segundos
useEffect(() => {
  const interval = setInterval(async () => {
    const updatedBoard = await fetchBoard(boardId);
    setBoard(updatedBoard);
  }, 5000); // A cada 5 segundos

  return () => clearInterval(interval);
}, []);
```
- ❌ Alta latência
- ❌ Muitas requisições desnecessárias
- ❌ Não é tempo real

### 2. **Supabase Realtime (Recomendado para Prototipagem)**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Escutar mudanças
supabase
  .channel('board-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'cards',
    filter: `board_id=eq.${boardId}`,
  }, (payload) => {
    console.log('Change received!', payload);
    handleCardUpdate(payload.new);
  })
  .subscribe();
```
- ✅ Muito fácil de usar
- ✅ Sincronização automática
- ✅ Funciona com PostgreSQL
- ✅ Open source

---

## Checklist de Implementação

### Backend
- [ ] Instalar Socket.IO
- [ ] Criar servidor WebSocket
- [ ] Implementar namespaces por board
- [ ] Adicionar autenticação
- [ ] Validar permissões
- [ ] Salvar mudanças no banco
- [ ] Broadcast para clientes

### Frontend
- [ ] Instalar socket.io-client
- [ ] Criar hook useSocket
- [ ] Conectar ao board ao montar
- [ ] Escutar eventos do servidor
- [ ] Enviar eventos ao fazer mudanças
- [ ] Atualizar UI com mudanças de outros
- [ ] Mostrar indicadores visuais
- [ ] Desconectar ao desmontar

### Testes
- [ ] Testar com 2+ usuários simultâneos
- [ ] Testar perda de conexão
- [ ] Testar reconexão
- [ ] Testar conflitos
- [ ] Testar performance (100+ usuários)

---

## Custos Estimados

### Self-Hosted (Socket.IO)
- **Servidor**: $20-50/mês (DigitalOcean, AWS)
- **Banco**: $25/mês (PostgreSQL)
- **Total**: ~$50/mês

### Supabase
- **Free Tier**: Até 500MB, 2GB bandwidth
- **Pro**: $25/mês (8GB, 50GB bandwidth)
- **Total**: $0-25/mês

### Firebase
- **Spark (Free)**: 1GB storage, 10GB/mês
- **Blaze (Pay as you go)**: $0.18/GB
- **Total**: $0-50/mês

---

## Recomendação Final

Para o **SolarSystem CRM**, recomendo:

### Curto Prazo (MVP)
**Supabase Realtime**
- ✅ Rápido de implementar
- ✅ Funciona out-of-the-box
- ✅ Grátis para começar
- ✅ Escalável

### Longo Prazo (Produção)
**Socket.IO + PostgreSQL**
- ✅ Controle total
- ✅ Customizável
- ✅ Sem vendor lock-in
- ✅ Melhor performance

---

## Próximos Passos

1. **Escolher tecnologia** (Supabase ou Socket.IO)
2. **Implementar backend** (WebSocket server)
3. **Atualizar frontend** (conectar ao WebSocket)
4. **Adicionar indicadores visuais** (quem está editando)
5. **Testar com múltiplos usuários**
6. **Otimizar performance**
7. **Adicionar offline support**

---

**Última atualização**: Maio 2026  
**Versão**: 1.0.0  
**Status**: Guia Completo ✅
