# 🔧 Correções Aplicadas

## 🐛 Problemas Identificados

### 1. Página de Clientes
**Erro:** "Empresa ou usuário não encontrado"

**Causa:** 
- Estava buscando `userId` do `localStorage`
- NextAuth não salva `userId` no localStorage
- Precisa buscar da session do NextAuth

**Solução:**
```typescript
// ANTES:
const storedUserId = localStorage.getItem("userId");

// DEPOIS:
const sessionRes = await fetch("/api/auth/session");
const session = await sessionRes.json();
const userId = session.user.id;
```

---

### 2. Página de Nova Proposta
**Erro:** Mostrando clientes mockados (João Silva, Empresa ABC, etc.)

**Causa:**
- Estava usando `getCompanyClients()` do store mockado
- Não estava integrado com a API real

**Solução:**
```typescript
// ANTES:
import { getCompanyClients } from "@/lib/store";
const clientes = getCompanyClients(COMPANY_ID);

// DEPOIS:
import { getClients, createProposal } from "@/lib/api";
const clientes = await getClients(companyId);
```

---

## ✅ Mudanças Aplicadas

### Arquivo: `app/clients/page.tsx`

**Mudanças:**
1. Buscar `userId` da session NextAuth
2. Adicionar validação de autenticação
3. Melhorar mensagens de erro

**Código:**
```typescript
useEffect(() => {
  async function init() {
    try {
      // Buscar session do NextAuth
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (!session?.user?.id) {
        setIsLoading(false);
        setError("Usuário não autenticado");
        return;
      }

      const storedCompanyId = localStorage.getItem("companyId");
      
      if (!storedCompanyId) {
        setIsLoading(false);
        setError("Empresa não selecionada");
        return;
      }

      setCompanyId(storedCompanyId);
      setUserId(session.user.id);
      await fetchClients(storedCompanyId);
    } catch (error) {
      console.error("Erro ao inicializar:", error);
      setIsLoading(false);
      setError("Erro ao carregar dados");
    }
  }
  
  init();
}, []);
```

---

### Arquivo: `app/proposals/new/page.tsx`

**Mudanças:**
1. Remover imports de dados mockados
2. Adicionar imports da API real
3. Buscar clientes da API
4. Criar proposta via API
5. Adicionar loading state
6. Adicionar validação de autenticação

**Imports Removidos:**
```typescript
import { addProposal, generateProposalId, getCompanyClients } from "@/lib/store";
import { mockCompanies } from "@/lib/mockAuthData";
```

**Imports Adicionados:**
```typescript
import { getClients, createProposal } from "@/lib/api";
import type { Client } from "@/types/client";
```

**Código de Inicialização:**
```typescript
const [clientes, setClientes] = useState<Client[]>([]);
const [companyId, setCompanyId] = useState<string>("");
const [userId, setUserId] = useState<string>("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function init() {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (!session?.user?.id) {
        alert("Usuário não autenticado");
        router.push("/login");
        return;
      }

      const storedCompanyId = localStorage.getItem("companyId");
      if (!storedCompanyId) {
        alert("Empresa não selecionada");
        router.push("/select-company");
        return;
      }

      setCompanyId(storedCompanyId);
      setUserId(session.user.id);

      // Buscar clientes da API
      const clientsData = await getClients(storedCompanyId);
      setClientes(clientsData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados");
      setLoading(false);
    }
  }
  init();
}, [router]);
```

**Código de Submit:**
```typescript
const handleSubmit = async () => {
  if (!calc || !moduloSelecionado || !inversorSelecionado || !financeiro) return;
  setSubmitting(true);

  try {
    // ... preparar dados ...

    const newProposal = {
      clientId: data.clienteExistenteId || undefined,
      companyId: companyId,
      createdBy: userId,
      status: "GERADA" as const,
      // ... resto dos dados ...
    };

    const created = await createProposal(newProposal);
    router.push(`/proposals/${created.id}`);
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    alert("Erro ao criar proposta. Tente novamente.");
    setSubmitting(false);
  }
};
```

---

## 🧪 Como Testar

### 1. Página de Clientes
```bash
# Acessar
http://localhost:3000/clients

# Deve mostrar:
- Lista de clientes da empresa
- Botão "Novo Cliente"
- Filtros funcionando
```

### 2. Nova Proposta
```bash
# Acessar
http://localhost:3000/proposals/new

# Deve mostrar:
- Lista de clientes REAIS (não mockados)
- Wizard de 4 passos
- Criar proposta salva no banco
```

---

## 📊 Resultado

### Antes
- ❌ Clientes: Erro "Empresa ou usuário não encontrado"
- ❌ Nova Proposta: Clientes mockados (João Silva, etc.)
- ❌ Proposta criada não persistia no banco

### Depois
- ✅ Clientes: Lista clientes reais da empresa
- ✅ Nova Proposta: Lista clientes reais da API
- ✅ Proposta criada persiste no banco via API

---

## 🚀 Deploy

**Status:** ✅ Pushed para GitHub

**Commit:** `47b2c7f`

**Mensagem:**
```
fix: Corrigir página de clientes e nova proposta

- Clientes: Buscar userId da session NextAuth em vez de localStorage
- Nova Proposta: Migrar de dados mockados para API real
- Nova Proposta: Usar getClients() e createProposal() da API
- Adicionar loading states em ambas as páginas
- Remover dependências de mockCompanies e getCompanyClients
```

---

## 📝 Próximos Passos

1. ✅ Correções aplicadas
2. 🔄 Testar localmente
3. 🔄 Verificar Vercel deploy
4. 🔄 Testar em produção

---

**Data:** 08/05/2026  
**Status:** ✅ CORRIGIDO  
**Commit:** 47b2c7f
