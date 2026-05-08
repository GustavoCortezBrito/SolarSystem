# 📋 TODO - Migração de Dados Mockados para API

## ✅ Concluído

- [x] Autenticação com NextAuth
- [x] Criação de empresas
- [x] Middleware de autenticação
- [x] Board layout com NextAuth session
- [x] Scripts de manutenção do banco
- [x] Conexão com Supabase via adapter pg

## 🔄 Pendente - Páginas com Dados Mockados

### 1. Propostas (`/app/proposals/page.tsx`)
**Status:** Usando `getAllProposals()` do store mockado

**O que fazer:**
- Substituir `getAllProposals()` por chamada à API `/api/proposals`
- Usar `useEffect` para buscar propostas ao carregar
- Adicionar loading state
- Tratar erros

**Exemplo:**
```typescript
const [proposals, setProposals] = useState<Proposal[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function fetchProposals() {
    try {
      const companyId = localStorage.getItem("companyId");
      const response = await fetch(`/api/proposals?companyId=${companyId}`);
      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
    } finally {
      setIsLoading(false);
    }
  }
  fetchProposals();
}, []);
```

### 2. Equipe/Team (`/app/team/page.tsx`)
**Status:** Usando dados mockados de membros

**O que fazer:**
- Criar API `/api/companies/[id]/members` (já existe!)
- Buscar membros da empresa via API
- Atualizar página para usar dados reais

### 3. Notificações (`/app/notifications/page.tsx`)
**Status:** Usando `getNotifications()` do store mockado

**O que fazer:**
- API `/api/notifications` já existe
- Substituir `getNotifications()` por chamada à API
- Adicionar loading state

### 4. Clientes (`/app/clients/page.tsx`)
**Status:** Provavelmente usando dados mockados

**O que fazer:**
- Verificar se está usando API ou store
- Se mockado, substituir por `/api/clients`

### 5. Board (`/app/board/page.tsx`)
**Status:** Usando `getBoard()` do store mockado

**O que fazer:**
- API `/api/board` já existe
- Substituir `getBoard()` por chamada à API
- Atualizar `onCardMoved` para usar `/api/board/cards` (PUT)
- Atualizar criação de cards para usar `/api/board/cards` (POST)

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
