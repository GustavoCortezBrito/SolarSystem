# 📋 TODO - Migração de Dados Mockados para API

## ✅ Concluído

- [x] Autenticação com NextAuth
- [x] Criação de empresas
- [x] Middleware de autenticação
- [x] Board layout com NextAuth session
- [x] Scripts de manutenção do banco
- [x] Conexão com Supabase via adapter pg
- [x] **Board** (`/app/board/page.tsx`) - Migrado para API
- [x] **Propostas** (`/app/proposals/page.tsx`) - Migrado para API
- [x] **Clientes** (`/app/clients/page.tsx`) - Migrado para API
- [x] **Notificações** (`/app/notifications/page.tsx`) - Migrado para API
- [x] **Equipe/Team** (`/app/team/page.tsx`) - Migrado para API

## 🎉 Migração Completa!

Todas as páginas principais foram migradas para usar dados reais da API:

### ✅ Board
- Usa `/api/board` para buscar colunas e cards
- Usa `/api/board/cards` para criar e mover cards
- Usa `/api/notifications` para notificações

### ✅ Propostas
- Usa `/api/proposals` para listar propostas
- Usa `/api/proposals/[id]` para atualizar e deletar
- Loading states e tratamento de erros implementados

### ✅ Clientes
- Usa `/api/clients` para listar e criar clientes
- Loading states e tratamento de erros implementados
- Criação de clientes via API

### ✅ Notificações
- Usa `/api/notifications` para listar notificações
- Usa `markNotificationAsRead` e `markAllNotificationsAsRead` da API
- Loading states e tratamento de erros implementados

### ✅ Equipe/Team
- Usa `/api/companies/[id]/members` para listar membros
- Loading states e tratamento de erros implementados
- Integrado com NextAuth session

## 📝 Padrão de Migração

Para cada página:

1. **Remover imports do store mockado:**
```typescript
// REMOVER:
import { getAllProposals } from "@/lib/store";

// ADICIONAR:
import { useEffect, useState } from "react";
```

2. **Adicionar estados:**
```typescript
const [data, setData] = useState<Type[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

3. **Buscar dados da API:**
```typescript
useEffect(() => {
  async function fetchData() {
    try {
      setIsLoading(true);
      const companyId = localStorage.getItem("companyId");
      const response = await fetch(`/api/endpoint?companyId=${companyId}`);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }
  fetchData();
}, []);
```

4. **Adicionar loading UI:**
```typescript
if (isLoading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <div>Erro: {error}</div>;
}
```

## 🎯 Prioridade

1. **Alta:** Board (página principal)
2. **Alta:** Propostas (funcionalidade core)
3. **Média:** Clientes
4. **Média:** Notificações
5. **Baixa:** Equipe

## 📚 APIs Disponíveis

Todas as APIs já estão implementadas:

- ✅ `/api/clients` - GET, POST
- ✅ `/api/clients/[id]` - GET, PUT, DELETE
- ✅ `/api/proposals` - GET, POST
- ✅ `/api/proposals/[id]` - GET, PUT, DELETE
- ✅ `/api/board` - GET (auto-cria board)
- ✅ `/api/board/cards` - POST, PUT
- ✅ `/api/notifications` - GET, POST, PATCH
- ✅ `/api/companies` - GET, POST
- ✅ `/api/companies/[id]/members` - GET, POST
- ✅ `/api/equipment/modules` - GET, POST
- ✅ `/api/equipment/inverters` - GET, POST

## 🔧 Helper Functions

O arquivo `lib/api.ts` já tem funções prontas:

```typescript
import {
  getClients,
  getProposals,
  getBoard,
  getNotifications,
  // ... etc
} from "@/lib/api";
```

Use essas funções em vez de fazer fetch direto!
