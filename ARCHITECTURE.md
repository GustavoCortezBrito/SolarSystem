# 🏗️ Arquitetura Multi-Tenant - SolarSystem CRM

## Visão Geral

O SolarSystem CRM é um **SaaS multi-tenant** onde múltiplas empresas podem usar o sistema simultaneamente, cada uma com seus próprios dados, usuários e configurações isoladas.

## Conceitos Fundamentais

### 1. Multi-Tenancy

**Tenant** = Empresa/Organização que usa o sistema

Cada tenant tem:
- ✅ Dados completamente isolados
- ✅ Usuários próprios com permissões específicas
- ✅ Configurações personalizadas
- ✅ Plano de assinatura independente

### 2. Estrutura de Dados

```
User (Pessoa Física)
  ↓
Membership (Liga usuário à empresa)
  ↓
Company (Empresa/Tenant)
  ↓
Boards, Leads, etc. (Dados da empresa)
```

## Entidades Principais

### User - Pessoa Física

```typescript
interface User {
  id: string;
  name: string;
  email: string;        // Único no sistema
  password: string;     // Hash bcrypt
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Características**:
- ✅ Um usuário pode estar em **múltiplas empresas**
- ✅ Email é único no sistema inteiro
- ✅ Faz login uma vez e escolhe a empresa

**Exemplo**:
```
Gustavo (gustavo@consultor.com)
├── OWNER na Solar Tech Ltda
└── SELLER na Energia Verde S.A.
```

### Company - Empresa/Tenant

```typescript
interface Company {
  id: string;
  name: string;
  slug: string;         // URL: /empresa-abc
  logo?: string;
  plan: SubscriptionPlan;
  maxUsers: number;
  maxBoards: number;
  settings: CompanySettings;
  createdAt: string;
  updatedAt: string;
}
```

**Características**:
- ✅ Slug único para URLs amigáveis
- ✅ Plano de assinatura define limites
- ✅ Configurações independentes
- ✅ Isolamento total de dados

**Planos Disponíveis**:
| Plano | Usuários | Boards | Leads/mês | Preço |
|-------|----------|--------|-----------|-------|
| FREE | 2 | 1 | 50 | R$ 0 |
| STARTER | 5 | 3 | 200 | R$ 97 |
| PROFESSIONAL | 15 | 10 | 1.000 | R$ 297 |
| ENTERPRISE | ∞ | ∞ | ∞ | Custom |

### Membership - Liga Usuário à Empresa

```typescript
interface Membership {
  id: string;
  userId: string;
  companyId: string;
  role: Role;           // OWNER, ADMIN, MANAGER, SELLER
  status: MembershipStatus;
  invitedBy?: string;
  invitedAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

**⚠️ IMPORTANTE**: 
- ❌ **NUNCA** coloque `role` direto no `User`
- ✅ **SEMPRE** use `Membership.role`
- 🎯 Um usuário pode ter roles diferentes em empresas diferentes

**Exemplo Correto**:
```typescript
// ❌ ERRADO
user.role = "ADMIN"

// ✅ CERTO
membership.role = "ADMIN"
```

## Hierarquia de Roles

### 1. OWNER (Proprietário)

**Pode fazer tudo**:
- ✅ Gerenciar assinatura e faturamento
- ✅ Apagar a empresa
- ✅ Convidar/remover qualquer usuário
- ✅ Alterar qualquer permissão
- ✅ Ver e editar tudo
- ✅ Acessar configurações críticas

**Casos de uso**:
- Dono da empresa
- Sócio principal
- CEO/Diretor

### 2. ADMIN (Administrador)

**Quase tudo, exceto**:
- ❌ Gerenciar faturamento
- ❌ Apagar a empresa
- ✅ Gerenciar usuários
- ✅ Ver todos os leads
- ✅ Editar configurações
- ✅ Criar etapas do funil

**Casos de uso**:
- Gerente geral
- Coordenador de TI
- Pessoa de confiança do owner

### 3. MANAGER (Gerente)

**Gestão de equipe**:
- ✅ Ver equipe completa
- ✅ Ver todos os leads
- ✅ Distribuir leads
- ✅ Ver relatórios da equipe
- ❌ Gerenciar usuários
- ❌ Alterar configurações críticas

**Casos de uso**:
- Gerente comercial
- Supervisor de vendas
- Coordenador de projetos

### 4. SELLER (Vendedor)

**Apenas seus dados**:
- ✅ Ver apenas próprios leads
- ✅ Editar próprios atendimentos
- ✅ Mover cards no funil
- ✅ Registrar observações
- ❌ Ver leads de outros
- ❌ Ver relatórios gerais

**Casos de uso**:
- Vendedor
- Atendente
- Consultor comercial

## Sistema de Permissões

### Permissões por Categoria

```typescript
enum Permission {
  // Leads
  LEADS_VIEW_ALL,      // Ver todos os leads
  LEADS_VIEW_OWN,      // Ver apenas próprios
  LEADS_CREATE,        // Criar leads
  LEADS_UPDATE,        // Editar leads
  LEADS_DELETE,        // Deletar leads
  LEADS_ASSIGN,        // Atribuir leads

  // Usuários
  USERS_VIEW,          // Ver usuários
  USERS_INVITE,        // Convidar usuários
  USERS_REMOVE,        // Remover usuários
  USERS_UPDATE_ROLE,   // Alterar roles

  // Boards
  BOARDS_VIEW_ALL,     // Ver todos os boards
  BOARDS_VIEW_OWN,     // Ver apenas próprios
  BOARDS_CREATE,       // Criar boards
  BOARDS_UPDATE,       // Editar boards
  BOARDS_DELETE,       // Deletar boards

  // Configurações
  SETTINGS_VIEW,       // Ver configurações
  SETTINGS_UPDATE,     // Editar configurações

  // Faturamento
  BILLING_VIEW,        // Ver faturamento
  BILLING_MANAGE,      // Gerenciar faturamento

  // Empresa
  COMPANY_UPDATE,      // Editar empresa
  COMPANY_DELETE,      // Deletar empresa

  // Relatórios
  REPORTS_VIEW_ALL,    // Ver todos relatórios
  REPORTS_VIEW_TEAM,   // Ver relatórios da equipe
  REPORTS_VIEW_OWN,    // Ver apenas próprios
}
```

### Mapeamento Role → Permissões

```typescript
ROLE_PERMISSIONS = {
  OWNER: [/* todas as permissões */],
  ADMIN: [/* quase todas, exceto billing e company.delete */],
  MANAGER: [/* gestão de equipe e visualização ampla */],
  SELLER: [/* apenas dados próprios */],
}
```

## Isolamento de Dados

### Regra de Ouro

**TODA query DEVE filtrar por `companyId`**

```typescript
// ✅ CERTO
const leads = await db.lead.findMany({
  where: {
    companyId: currentCompanyId,
  },
});

// ❌ ERRADO - Vazamento de dados entre empresas!
const leads = await db.lead.findMany();
```

### Filtros por Role

#### OWNER, ADMIN, MANAGER
```typescript
// Veem todos os leads da empresa
const leads = await db.lead.findMany({
  where: {
    companyId: currentCompanyId,
  },
});
```

#### SELLER
```typescript
// Veem apenas próprios leads
const leads = await db.lead.findMany({
  where: {
    companyId: currentCompanyId,
    assignedToId: currentUserId,
  },
});
```

## Helpers de Permissões

### Verificação Básica

```typescript
import { can, Permission } from '@/lib/permissions';

// Verificar permissão específica
if (can(context, Permission.LEADS_VIEW_ALL)) {
  // Mostrar todos os leads
}

// Verificar se é owner
if (isOwner(context)) {
  // Mostrar opções de billing
}

// Verificar se é owner ou admin
if (isOwnerOrAdmin(context)) {
  // Mostrar configurações
}
```

### Filtros Automáticos

```typescript
import { getLeadsFilter, getBoardsFilter } from '@/lib/permissions';

// Filtro automático baseado no role
const filter = getLeadsFilter(context);
const leads = await db.lead.findMany({ where: filter });
```

### Verificações Avançadas

```typescript
// Verificar se pode alterar role de outro membro
if (canChangeRole(context, targetRole)) {
  // Permitir alteração
}

// Verificar se pode remover membro
if (canRemoveMember(context, targetMembership)) {
  // Permitir remoção
}
```

## Fluxo de Autenticação

### 1. Login

```typescript
POST /api/auth/login
{
  email: "carlos@solartech.com",
  password: "senha123"
}

Response:
{
  user: { id, name, email },
  companies: [
    { id: "company-1", name: "Solar Tech", role: "OWNER" },
    { id: "company-2", name: "Outra Empresa", role: "SELLER" }
  ],
  token: "jwt-token"
}
```

### 2. Seleção de Empresa

```typescript
POST /api/auth/select-company
{
  companyId: "company-1"
}

Response:
{
  company: { id, name, slug, plan },
  membership: { role, permissions },
  token: "jwt-token-with-company-context"
}
```

### 3. Contexto na Aplicação

```typescript
// Em toda requisição
const context: AuthContext = {
  user: currentUser,
  company: currentCompany,
  membership: currentMembership,
  permissions: getPermissions(currentMembership.role),
};

// Usar em componentes
if (can(context, Permission.LEADS_CREATE)) {
  // Mostrar botão "Criar Lead"
}
```

## Convites de Usuários

### Fluxo de Convite

1. **OWNER/ADMIN convida usuário**
```typescript
POST /api/invites
{
  email: "novo@usuario.com",
  role: "SELLER",
  companyId: "company-1"
}
```

2. **Sistema envia email com link**
```
https://solarsystem.com/invite/token-abc123
```

3. **Usuário aceita convite**
- Se já tem conta: Adiciona membership
- Se não tem conta: Cria conta + membership

4. **Membership criado**
```typescript
{
  userId: "user-new",
  companyId: "company-1",
  role: "SELLER",
  status: "ACTIVE"
}
```

## Mudança de Empresa

### Trocar Empresa Ativa

```typescript
// Usuário em múltiplas empresas
const companies = getUserCompanies(userId);

// Trocar contexto
function switchCompany(companyId: string) {
  const membership = getMembership(userId, companyId);
  const company = getCompany(companyId);
  
  // Atualizar contexto global
  setCurrentContext({
    user,
    company,
    membership,
    permissions: getPermissions(membership.role),
  });
  
  // Redirecionar para dashboard da empresa
  router.push(`/${company.slug}/dashboard`);
}
```

## Estrutura de URLs

### Multi-Tenant URLs

```
# Sem empresa selecionada
/login
/register
/select-company

# Com empresa selecionada
/{company-slug}/dashboard
/{company-slug}/board
/{company-slug}/leads
/{company-slug}/settings
/{company-slug}/team

# Exemplos
/solar-tech/dashboard
/energia-verde/board
/sol-do-brasil/leads
```

## Banco de Dados (Prisma Schema)

```prisma
model User {
  id          String       @id @default(cuid())
  name        String
  email       String       @unique
  password    String
  avatar      String?
  phone       String?
  memberships Membership[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Company {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  logo        String?
  plan        String       @default("FREE")
  maxUsers    Int          @default(2)
  maxBoards   Int          @default(1)
  settings    Json
  memberships Membership[]
  boards      Board[]
  leads       Lead[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Membership {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyId  String
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  role       String   // OWNER, ADMIN, MANAGER, SELLER
  status     String   @default("ACTIVE")
  invitedBy  String?
  invitedAt  DateTime?
  acceptedAt DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([userId, companyId])
  @@index([companyId])
  @@index([userId])
}

model Board {
  id        String   @id @default(cuid())
  title     String
  companyId String
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  columns   Column[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([companyId])
}

model Lead {
  id           String   @id @default(cuid())
  title        String
  companyId    String
  company      Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  assignedToId String?
  status       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([companyId])
  @@index([assignedToId])
}
```

## Segurança

### Checklist de Segurança

- ✅ **Sempre filtrar por companyId** em queries
- ✅ **Validar membership** antes de qualquer operação
- ✅ **Verificar permissões** em todas as ações
- ✅ **Não expor dados** de outras empresas
- ✅ **Logs de auditoria** para ações críticas
- ✅ **Rate limiting** por empresa
- ✅ **Backup isolado** por tenant

### Middleware de Autorização

```typescript
// middleware/auth.ts
export async function requireAuth(req: Request) {
  const token = req.headers.get('Authorization');
  const { userId, companyId } = verifyToken(token);
  
  const membership = await getMembership(userId, companyId);
  if (!membership || membership.status !== 'ACTIVE') {
    throw new UnauthorizedError();
  }
  
  return {
    user: await getUser(userId),
    company: await getCompany(companyId),
    membership,
  };
}

// Uso em API routes
export async function GET(req: Request) {
  const context = await requireAuth(req);
  
  // Filtro automático por empresa
  const leads = await db.lead.findMany({
    where: getLeadsFilter(context),
  });
  
  return Response.json(leads);
}
```

## Testes

### Testar Isolamento

```typescript
describe('Multi-tenancy isolation', () => {
  it('should not allow access to other company data', async () => {
    const company1Lead = await createLead({ companyId: 'company-1' });
    const company2User = await loginAs('user-from-company-2');
    
    const response = await company2User.get(`/api/leads/${company1Lead.id}`);
    
    expect(response.status).toBe(404); // Não encontrado
  });
  
  it('should filter leads by company', async () => {
    await createLead({ companyId: 'company-1', title: 'Lead 1' });
    await createLead({ companyId: 'company-2', title: 'Lead 2' });
    
    const company1User = await loginAs('user-from-company-1');
    const leads = await company1User.get('/api/leads');
    
    expect(leads.data).toHaveLength(1);
    expect(leads.data[0].title).toBe('Lead 1');
  });
});
```

## Migração de Dados

### Adicionar companyId em Tabelas Existentes

```sql
-- 1. Adicionar coluna
ALTER TABLE boards ADD COLUMN company_id VARCHAR(255);

-- 2. Migrar dados (associar a uma empresa padrão)
UPDATE boards SET company_id = 'company-1' WHERE company_id IS NULL;

-- 3. Tornar obrigatório
ALTER TABLE boards ALTER COLUMN company_id SET NOT NULL;

-- 4. Adicionar índice
CREATE INDEX idx_boards_company_id ON boards(company_id);

-- 5. Adicionar foreign key
ALTER TABLE boards ADD CONSTRAINT fk_boards_company 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
```

## Próximos Passos

### Fase 2 - Implementação

1. ✅ Criar schema Prisma completo
2. ✅ Implementar autenticação (NextAuth.js)
3. ✅ Criar middleware de autorização
4. ✅ Adicionar companyId em todas as tabelas
5. ✅ Implementar seleção de empresa
6. ✅ Criar página de convites
7. ✅ Implementar gestão de membros
8. ✅ Adicionar logs de auditoria

### Recursos Futuros

- [ ] Permissões customizadas por usuário
- [ ] Grupos de usuários
- [ ] Delegação temporária de permissões
- [ ] Auditoria completa de ações
- [ ] 2FA (autenticação de dois fatores)
- [ ] SSO (Single Sign-On)
- [ ] SAML para enterprise

---

**Versão**: 1.0  
**Última atualização**: Maio 2026  
**Status**: Documentação completa ✅
