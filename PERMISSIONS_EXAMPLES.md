# 🔐 Exemplos Práticos de Permissões

## Casos de Uso Reais

### 1. Vendedor Tentando Ver Leads de Outro Vendedor

```typescript
// Contexto: Maria (SELLER) tenta ver leads de Pedro (SELLER)
const context = {
  user: { id: "user-4", name: "Maria" },
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.SELLER },
};

// Buscar leads
const filter = getLeadsFilter(context);
// Resultado: { companyId: "company-1", assignedToId: "user-4" }

const leads = await db.lead.findMany({ where: filter });
// Maria só vê seus próprios leads ✅
```

### 2. Gerente Distribuindo Leads

```typescript
// Contexto: Pedro (MANAGER) distribui leads para a equipe
const context = {
  user: { id: "user-3", name: "Pedro" },
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.MANAGER },
};

// Verificar permissão
if (can(context, Permission.LEADS_ASSIGN)) {
  // Pedro pode atribuir leads ✅
  await db.lead.update({
    where: { id: leadId },
    data: { assignedToId: "user-4" }, // Atribui para Maria
  });
}

// Verificar se pode ver todos os leads
if (canViewAllLeads(context)) {
  // Pedro vê todos os leads da empresa ✅
  const allLeads = await db.lead.findMany({
    where: { companyId: context.company.id },
  });
}
```

### 3. Admin Tentando Gerenciar Faturamento

```typescript
// Contexto: Ana (ADMIN) tenta acessar faturamento
const context = {
  user: { id: "user-2", name: "Ana" },
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.ADMIN },
};

// Verificar permissão de faturamento
if (canManageBilling(context)) {
  // Ana NÃO pode gerenciar faturamento ❌
  // Apenas OWNER pode
} else {
  // Mostrar mensagem: "Apenas o proprietário pode gerenciar faturamento"
}
```

### 4. Owner Convidando Novo Membro

```typescript
// Contexto: Carlos (OWNER) convida novo vendedor
const context = {
  user: { id: "user-1", name: "Carlos" },
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.OWNER },
};

// Verificar se pode convidar
if (can(context, Permission.USERS_INVITE)) {
  // Carlos pode convidar ✅
  const invite = await db.invite.create({
    data: {
      email: "novo@vendedor.com",
      companyId: context.company.id,
      role: Role.SELLER,
      invitedBy: context.user.id,
      token: generateToken(),
      expiresAt: addDays(new Date(), 7),
    },
  });

  // Enviar email de convite
  await sendInviteEmail(invite);
}
```

### 5. Manager Tentando Alterar Role de Admin

```typescript
// Contexto: Pedro (MANAGER) tenta promover Maria para ADMIN
const context = {
  user: { id: "user-3", name: "Pedro" },
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.MANAGER },
};

const targetRole = Role.ADMIN;

// Verificar se pode alterar role
if (canChangeRole(context, targetRole)) {
  // Pedro NÃO pode ❌
  // MANAGER não pode criar ADMIN (role superior)
} else {
  throw new Error("Você não tem permissão para atribuir este cargo");
}
```

### 6. Usuário em Múltiplas Empresas

```typescript
// Gustavo está em 2 empresas com roles diferentes
const user = { id: "user-8", name: "Gustavo" };

// Na Solar Tech - OWNER
const solarTechContext = {
  user,
  company: { id: "company-1", name: "Solar Tech" },
  membership: { role: Role.OWNER },
};

if (canManageBilling(solarTechContext)) {
  // Gustavo PODE gerenciar faturamento na Solar Tech ✅
}

// Na Energia Verde - SELLER
const energiaVerdeContext = {
  user,
  company: { id: "company-2", name: "Energia Verde" },
  membership: { role: Role.SELLER },
};

if (canManageBilling(energiaVerdeContext)) {
  // Gustavo NÃO pode gerenciar faturamento na Energia Verde ❌
}

// Gustavo vê diferentes dados dependendo da empresa ativa
```

## Componentes React com Permissões

### Botão Condicional

```typescript
// components/InviteUserButton.tsx
import { can, Permission } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

export function InviteUserButton() {
  const { context } = useAuth();

  if (!can(context, Permission.USERS_INVITE)) {
    return null; // Não mostra o botão
  }

  return (
    <button onClick={handleInvite}>
      Convidar Usuário
    </button>
  );
}
```

### Menu Baseado em Permissões

```typescript
// components/Sidebar.tsx
import { can, Permission, isOwnerOrAdmin } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const { context } = useAuth();

  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/board">Board</Link>
      
      {can(context, Permission.LEADS_VIEW_ALL) && (
        <Link href="/leads">Todos os Leads</Link>
      )}
      
      {can(context, Permission.REPORTS_VIEW_TEAM) && (
        <Link href="/reports">Relatórios</Link>
      )}
      
      {isOwnerOrAdmin(context) && (
        <Link href="/settings">Configurações</Link>
      )}
      
      {can(context, Permission.BILLING_MANAGE) && (
        <Link href="/billing">Faturamento</Link>
      )}
    </nav>
  );
}
```

### Lista de Membros com Ações

```typescript
// components/MembersList.tsx
import { canRemoveMember, getRoleLabel, getRoleColor } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

export function MembersList({ members }: { members: Member[] }) {
  const { context } = useAuth();

  return (
    <div>
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div>
            <p>{member.user.name}</p>
            <span className={getRoleColor(member.membership.role)}>
              {getRoleLabel(member.membership.role)}
            </span>
          </div>
          
          {canRemoveMember(context, member.membership) && (
            <button onClick={() => handleRemove(member.id)}>
              Remover
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Formulário de Card com Filtro de Atribuição

```typescript
// components/CardForm.tsx
import { canViewAllLeads } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

export function CardForm() {
  const { context } = useAuth();
  const [assignees, setAssignees] = useState([]);

  // Buscar membros disponíveis para atribuição
  useEffect(() => {
    async function loadMembers() {
      if (canViewAllLeads(context)) {
        // MANAGER/ADMIN/OWNER veem todos os membros
        const members = await getCompanyMembers(context.company.id);
        setAssignees(members);
      } else {
        // SELLER só pode atribuir para si mesmo
        setAssignees([context.user]);
      }
    }
    loadMembers();
  }, [context]);

  return (
    <select>
      {assignees.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
```

## API Routes com Autorização

### GET /api/leads

```typescript
// app/api/leads/route.ts
import { requireAuth } from '@/lib/auth';
import { getLeadsFilter } from '@/lib/permissions';

export async function GET(req: Request) {
  // 1. Verificar autenticação
  const context = await requireAuth(req);

  // 2. Aplicar filtro baseado em permissões
  const filter = getLeadsFilter(context);

  // 3. Buscar leads
  const leads = await db.lead.findMany({
    where: filter,
    include: {
      assignedTo: true,
      company: true,
    },
  });

  return Response.json(leads);
}
```

### POST /api/leads/:id/assign

```typescript
// app/api/leads/[id]/assign/route.ts
import { requireAuth } from '@/lib/auth';
import { can, Permission } from '@/lib/permissions';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const context = await requireAuth(req);
  const { assignToUserId } = await req.json();

  // Verificar permissão de atribuir leads
  if (!can(context, Permission.LEADS_ASSIGN)) {
    return Response.json(
      { error: 'Você não tem permissão para atribuir leads' },
      { status: 403 }
    );
  }

  // Verificar se o lead pertence à empresa
  const lead = await db.lead.findFirst({
    where: {
      id: params.id,
      companyId: context.company.id, // Isolamento!
    },
  });

  if (!lead) {
    return Response.json(
      { error: 'Lead não encontrado' },
      { status: 404 }
    );
  }

  // Verificar se o usuário alvo pertence à empresa
  const targetMembership = await db.membership.findFirst({
    where: {
      userId: assignToUserId,
      companyId: context.company.id,
      status: 'ACTIVE',
    },
  });

  if (!targetMembership) {
    return Response.json(
      { error: 'Usuário não encontrado nesta empresa' },
      { status: 400 }
    );
  }

  // Atribuir lead
  const updatedLead = await db.lead.update({
    where: { id: params.id },
    data: { assignedToId: assignToUserId },
  });

  return Response.json(updatedLead);
}
```

### DELETE /api/members/:id

```typescript
// app/api/members/[id]/route.ts
import { requireAuth } from '@/lib/auth';
import { canRemoveMember } from '@/lib/permissions';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const context = await requireAuth(req);

  // Buscar membership alvo
  const targetMembership = await db.membership.findFirst({
    where: {
      id: params.id,
      companyId: context.company.id, // Isolamento!
    },
  });

  if (!targetMembership) {
    return Response.json(
      { error: 'Membro não encontrado' },
      { status: 404 }
    );
  }

  // Verificar permissão
  if (!canRemoveMember(context, targetMembership)) {
    return Response.json(
      { error: 'Você não tem permissão para remover este membro' },
      { status: 403 }
    );
  }

  // Remover membership
  await db.membership.delete({
    where: { id: params.id },
  });

  return Response.json({ success: true });
}
```

## Hooks Customizados

### useAuth Hook

```typescript
// hooks/useAuth.ts
import { createContext, useContext } from 'react';
import { AuthContext } from '@/types/auth';

const AuthContext = createContext<AuthContext | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return { context };
}

export function usePermission(permission: Permission) {
  const { context } = useAuth();
  return can(context, permission);
}

export function useRole() {
  const { context } = useAuth();
  return context.membership.role;
}

export function useIsOwner() {
  const { context } = useAuth();
  return isOwner(context);
}
```

### Uso nos Componentes

```typescript
// components/Dashboard.tsx
import { useAuth, usePermission, useIsOwner } from '@/hooks/useAuth';
import { Permission } from '@/types/auth';

export function Dashboard() {
  const { context } = useAuth();
  const canViewAllLeads = usePermission(Permission.LEADS_VIEW_ALL);
  const isOwner = useIsOwner();

  return (
    <div>
      <h1>Bem-vindo, {context.user.name}!</h1>
      <p>Empresa: {context.company.name}</p>
      <p>Cargo: {getRoleLabel(context.membership.role)}</p>

      {canViewAllLeads && (
        <section>
          <h2>Todos os Leads</h2>
          {/* Lista de leads */}
        </section>
      )}

      {isOwner && (
        <section>
          <h2>Faturamento</h2>
          {/* Informações de billing */}
        </section>
      )}
    </div>
  );
}
```

## Testes de Permissões

```typescript
// __tests__/permissions.test.ts
import { can, Permission, Role } from '@/lib/permissions';

describe('Permissions', () => {
  const ownerContext = {
    user: { id: '1', name: 'Owner' },
    company: { id: 'company-1' },
    membership: { role: Role.OWNER },
  };

  const sellerContext = {
    user: { id: '2', name: 'Seller' },
    company: { id: 'company-1' },
    membership: { role: Role.SELLER },
  };

  it('OWNER can manage billing', () => {
    expect(can(ownerContext, Permission.BILLING_MANAGE)).toBe(true);
  });

  it('SELLER cannot manage billing', () => {
    expect(can(sellerContext, Permission.BILLING_MANAGE)).toBe(false);
  });

  it('SELLER can only view own leads', () => {
    expect(can(sellerContext, Permission.LEADS_VIEW_ALL)).toBe(false);
    expect(can(sellerContext, Permission.LEADS_VIEW_OWN)).toBe(true);
  });

  it('OWNER can view all leads', () => {
    expect(can(ownerContext, Permission.LEADS_VIEW_ALL)).toBe(true);
  });
});
```

## Mensagens de Erro Amigáveis

```typescript
// lib/errors.ts
export function getPermissionErrorMessage(permission: Permission): string {
  const messages: Record<Permission, string> = {
    [Permission.BILLING_MANAGE]: 
      'Apenas o proprietário da empresa pode gerenciar o faturamento.',
    [Permission.USERS_REMOVE]: 
      'Você não tem permissão para remover membros da equipe.',
    [Permission.LEADS_VIEW_ALL]: 
      'Você só pode visualizar seus próprios leads.',
    [Permission.COMPANY_DELETE]: 
      'Apenas o proprietário pode excluir a empresa.',
    // ... outras mensagens
  };

  return messages[permission] || 'Você não tem permissão para esta ação.';
}

// Uso
if (!can(context, Permission.BILLING_MANAGE)) {
  toast.error(getPermissionErrorMessage(Permission.BILLING_MANAGE));
}
```

---

**Dica**: Sempre teste as permissões tanto no frontend quanto no backend. O frontend é para UX, o backend é para segurança!
