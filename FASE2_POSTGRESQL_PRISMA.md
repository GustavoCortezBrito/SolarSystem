# 🎯 FASE 2: PostgreSQL + Prisma - Implementação

## ✅ O que foi feito

### 1. **Dependências Instaladas**
```bash
✅ prisma
✅ @prisma/client
✅ next-auth
✅ @next-auth/prisma-adapter
✅ bcryptjs
✅ @types/bcryptjs
```

### 2. **Schema Prisma Completo** (`prisma/schema.prisma`)

Criado schema com **16 modelos**:

#### Autenticação (NextAuth.js)
- ✅ `User` - Usuários do sistema
- ✅ `Account` - Contas OAuth
- ✅ `Session` - Sessões ativas
- ✅ `VerificationToken` - Tokens de verificação

#### Empresas
- ✅ `Company` - Empresas/organizações
- ✅ `CompanyMember` - Membros e permissões

#### CRM
- ✅ `Client` - Clientes (leads, prospects, won, lost)
- ✅ `ClientActivity` - Histórico completo de atividades
- ✅ `Proposal` - Propostas comerciais (JSON fields para flexibilidade)

#### Board Kanban
- ✅ `Board` - Boards por empresa
- ✅ `Column` - Colunas customizáveis
- ✅ `Card` - Cards com vinculação a clientes

#### Sistema
- ✅ `Notification` - Notificações em tempo real

#### Catálogos de Equipamentos
- ✅ `Module` - Módulos solares
- ✅ `Inverter` - Inversores
- ✅ `Battery` - Baterias
- ✅ `Optimizer` - Otimizadores

### 3. **Configuração**
- ✅ `.env` configurado com DATABASE_URL e NEXTAUTH
- ✅ `.env.example` criado para documentação
- ✅ `lib/prisma.ts` - Singleton do Prisma Client
- ✅ `DATABASE_SETUP.md` - Guia completo de setup

---

## 🚀 Próximos Passos

### Passo 1: Configurar PostgreSQL

**Escolha uma opção:**

#### Opção A: PostgreSQL Local (Recomendado para desenvolvimento)
```bash
# Windows: Baixe e instale
https://www.postgresql.org/download/windows/

# Crie o banco
psql -U postgres
CREATE DATABASE solarsystem;
\q
```

#### Opção B: Supabase (Cloud - Grátis)
1. Acesse https://supabase.com
2. Crie um projeto
3. Copie a connection string
4. Cole no `.env`

#### Opção C: Railway (Cloud - Grátis)
1. Acesse https://railway.app
2. New Project → Provision PostgreSQL
3. Copie a connection string

**Veja detalhes completos em:** `DATABASE_SETUP.md`

---

### Passo 2: Rodar Migrations

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma migrate dev --name init

# Visualizar banco (opcional)
npx prisma studio
```

---

### Passo 3: Criar API Routes

Precisamos criar endpoints REST para substituir o `localStorage`:

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth.js
├── clients/
│   ├── route.ts                  # GET /api/clients, POST /api/clients
│   └── [id]/route.ts             # GET, PUT, DELETE /api/clients/:id
├── proposals/
│   ├── route.ts                  # GET /api/proposals, POST /api/proposals
│   └── [id]/route.ts             # GET, PUT, DELETE /api/proposals/:id
├── board/
│   ├── route.ts                  # GET /api/board
│   ├── columns/route.ts          # POST /api/board/columns
│   └── cards/route.ts            # POST /api/board/cards
├── notifications/
│   └── route.ts                  # GET /api/notifications
└── equipment/
    ├── modules/route.ts          # GET /api/equipment/modules
    ├── inverters/route.ts        # GET /api/equipment/inverters
    ├── batteries/route.ts        # GET /api/equipment/batteries
    └── optimizers/route.ts       # GET /api/equipment/optimizers
```

---

### Passo 4: Migrar `lib/store.ts`

Substituir funções do `store.ts` para usar API calls:

**Antes (localStorage):**
```typescript
export function getClients(): Client[] {
  return loadFromStorage(KEYS.clients, mockClients);
}
```

**Depois (API):**
```typescript
export async function getClients(): Promise<Client[]> {
  const res = await fetch('/api/clients');
  return res.json();
}
```

---

### Passo 5: Implementar NextAuth.js

Criar autenticação completa:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validar usuário
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.password) return null;
        
        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        return valid ? user : null;
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### Passo 6: Seed do Banco (Dados Iniciais)

Criar `prisma/seed.ts` para popular o banco com dados de teste:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@solarsystem.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });

  // Criar empresa
  const company = await prisma.company.create({
    data: {
      name: 'Solar Energy LTDA',
      cnpj: '12.345.678/0001-90',
      email: 'contato@solarenergy.com',
      phone: '(11) 98765-4321'
    }
  });

  // Vincular admin à empresa
  await prisma.companyMember.create({
    data: {
      companyId: company.id,
      userId: admin.id,
      role: 'OWNER'
    }
  });

  // Criar módulos de exemplo
  await prisma.module.createMany({
    data: [
      {
        manufacturer: 'Canadian Solar',
        model: 'CS3W-450P',
        power: 450,
        efficiency: 20.5,
        warranty: 25,
        price: 650
      },
      {
        manufacturer: 'Jinko Solar',
        model: 'Tiger Pro 550W',
        power: 550,
        efficiency: 21.2,
        warranty: 25,
        price: 780
      }
    ]
  });

  console.log('✅ Seed concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Adicionar no `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 📊 Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Clientes │  │Propostas │  │  Board   │  │  Login   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │    fetch()  │   fetch()   │  fetch()    │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   API ROUTES (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │/api/     │  │/api/     │  │/api/     │  │/api/auth │   │
│  │clients   │  │proposals │  │board     │  │[...]     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │   Prisma    │   Prisma    │   Prisma    │  NextAuth
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  PRISMA CLIENT (ORM)                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL DATABASE                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ clients  │  │proposals │  │  boards  │  │  users   │   │
│  │activities│  │  cards   │  │ columns  │  │companies │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Benefícios da Migração

### Antes (localStorage)
❌ Dados apenas no navegador
❌ Sem sincronização entre dispositivos
❌ Sem autenticação real
❌ Sem multi-usuário
❌ Sem backup automático

### Depois (PostgreSQL + Prisma)
✅ Dados persistentes no servidor
✅ Sincronização em tempo real
✅ Autenticação segura (NextAuth.js)
✅ Multi-usuário e multi-empresa
✅ Backup e recuperação
✅ Escalável para produção
✅ Queries otimizadas
✅ Relações entre entidades
✅ Migrations versionadas

---

## 🔥 Comandos Rápidos

```bash
# Setup inicial
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Desenvolvimento
npx prisma studio              # Visualizar dados
npx prisma migrate dev         # Criar migration
npx prisma migrate reset       # Resetar banco

# Produção
npx prisma migrate deploy      # Aplicar migrations
npx prisma generate            # Gerar client

# Debug
npx prisma validate            # Validar schema
npx prisma format              # Formatar schema
```

---

## 📚 Próxima Sessão

Na próxima sessão, vamos implementar:

1. ✅ **API Routes completas** (CRUD para todas as entidades)
2. ✅ **NextAuth.js** (login, registro, sessões)
3. ✅ **Migração do store.ts** (substituir localStorage por API)
4. ✅ **Seed do banco** (dados iniciais)
5. ✅ **Middleware de autenticação** (proteger rotas)
6. ✅ **Sincronização em tempo real** (opcional: WebSockets ou Polling)

**Quer que eu continue implementando agora?** 🚀

Posso criar:
- Todas as API Routes
- Sistema de autenticação completo
- Migração do store.ts
- Seed com dados de teste
