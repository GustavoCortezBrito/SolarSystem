# 🔔 Sistema de Notificações

## 📊 Status Atual

**PROBLEMA:** As notificações **NÃO estão sendo criadas automaticamente** no sistema.

A API `/api/notifications` existe e funciona, mas nenhuma ação do sistema está gerando notificações.

---

## 🎯 Quando Notificações DEVERIAM Ser Criadas

### 1. **Board / Cards**

#### Criar Card
- ✅ **Atividade criada:** Sim (ClientActivity)
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Membros da equipe quando um card é criado

#### Mover Card
- ✅ **Atividade criada:** Sim (ClientActivity)
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Responsável pelo card quando ele é movido

#### Atribuir Card
- ❌ **Atividade criada:** Não
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Usuário atribuído ao card

---

### 2. **Propostas**

#### Criar Proposta
- ✅ **Atividade criada:** Sim (ClientActivity)
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Gerentes quando proposta é criada

#### Aceitar Proposta
- ❌ **Atividade criada:** Não
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Criador da proposta e gerentes

#### Rejeitar Proposta
- ❌ **Atividade criada:** Não
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Criador da proposta

#### Proposta Expirando
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Criador quando proposta está próxima de expirar (3 dias antes)

---

### 3. **Clientes**

#### Criar Cliente
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Gerentes quando novo cliente é cadastrado

#### Atualizar Status
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Responsável pelo cliente quando status muda

#### Adicionar Atividade
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Responsável pelo cliente sobre nova atividade

---

### 4. **Equipe**

#### Novo Membro
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Admins quando novo membro entra

#### Membro Removido
- ❌ **Notificação criada:** Não
- **Deveria notificar:** Admins quando membro é removido

---

## 🔧 Como Implementar

### Opção 1: Adicionar nas APIs Existentes

Adicionar criação de notificação em cada API:

```typescript
// Exemplo: app/api/board/cards/route.ts
export async function POST(request: NextRequest) {
  // ... criar card ...

  // ADICIONAR: Criar notificação
  await prisma.notification.create({
    data: {
      userId: session.user.id, // ou userId do responsável
      type: "CARD_CREATED",
      title: "Novo card criado",
      message: `Card "${title}" foi criado no board`,
      actionUrl: `/board`,
      read: false,
    },
  });

  return NextResponse.json(card);
}
```

### Opção 2: Criar Serviço de Notificações

Criar um serviço centralizado:

```typescript
// lib/notifications.ts
export async function notifyCardCreated(cardId: string, userId: string) {
  await prisma.notification.create({
    data: {
      userId,
      type: "CARD_CREATED",
      title: "Novo card criado",
      message: `Um novo card foi criado no board`,
      actionUrl: `/board`,
      read: false,
    },
  });
}

export async function notifyProposalAccepted(proposalId: string, userId: string) {
  await prisma.notification.create({
    data: {
      userId,
      type: "PROPOSAL_ACCEPTED",
      title: "Proposta aceita!",
      message: `Sua proposta foi aceita pelo cliente`,
      actionUrl: `/proposals/${proposalId}`,
      read: false,
    },
  });
}
```

Depois usar nas APIs:

```typescript
import { notifyCardCreated } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const card = await prisma.card.create({...});
  
  // Notificar
  await notifyCardCreated(card.id, session.user.id);
  
  return NextResponse.json(card);
}
```

### Opção 3: Usar Webhooks/Events (Mais Avançado)

Criar um sistema de eventos:

```typescript
// lib/events.ts
export const EventEmitter = {
  emit: async (event: string, data: any) => {
    // Processar evento e criar notificações
    switch (event) {
      case "card.created":
        await notifyCardCreated(data);
        break;
      case "proposal.accepted":
        await notifyProposalAccepted(data);
        break;
    }
  },
};

// Usar nas APIs
await EventEmitter.emit("card.created", { cardId, userId });
```

---

## 📝 Tipos de Notificação

Baseado no schema do Prisma:

```typescript
enum NotificationType {
  CARD_CREATED       // Card criado
  CARD_MOVED         // Card movido
  CARD_ASSIGNED      // Card atribuído
  PROPOSAL_CREATED   // Proposta criada
  PROPOSAL_ACCEPTED  // Proposta aceita
  PROPOSAL_REJECTED  // Proposta rejeitada
  PROPOSAL_EXPIRING  // Proposta expirando
  CLIENT_CREATED     // Cliente criado
  CLIENT_UPDATED     // Cliente atualizado
  MEMBER_ADDED       // Membro adicionado
  MEMBER_REMOVED     // Membro removido
  SYSTEM             // Notificação do sistema
}
```

---

## 🎯 Prioridade de Implementação

### Alta Prioridade
1. ✅ **Proposta Aceita/Rejeitada** - Importante para vendedores
2. ✅ **Card Atribuído** - Importante para gestão de tarefas
3. ✅ **Novo Cliente** - Importante para gerentes

### Média Prioridade
4. **Card Movido** - Útil para acompanhamento
5. **Proposta Expirando** - Útil para follow-up
6. **Cliente Atualizado** - Útil para equipe

### Baixa Prioridade
7. **Card Criado** - Pode gerar muito ruído
8. **Membro Adicionado/Removido** - Menos frequente

---

## 🚀 Implementação Recomendada

### Passo 1: Criar Serviço de Notificações

```bash
# Criar arquivo
touch lib/notifications.ts
```

```typescript
// lib/notifications.ts
import { prisma } from "@/lib/prisma";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: any;
}) {
  try {
    await prisma.notification.create({
      data: {
        ...data,
        read: false,
      },
    });
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
  }
}

// Funções específicas
export async function notifyProposalAccepted(proposalId: string, creatorId: string) {
  await createNotification({
    userId: creatorId,
    type: "PROPOSAL_ACCEPTED",
    title: "🎉 Proposta Aceita!",
    message: "Sua proposta foi aceita pelo cliente",
    actionUrl: `/proposals/${proposalId}`,
  });
}

export async function notifyCardAssigned(cardId: string, assignedUserId: string, cardTitle: string) {
  await createNotification({
    userId: assignedUserId,
    type: "CARD_ASSIGNED",
    title: "📌 Card Atribuído",
    message: `Você foi atribuído ao card "${cardTitle}"`,
    actionUrl: `/board`,
  });
}

export async function notifyNewClient(clientId: string, managerIds: string[], clientName: string) {
  for (const managerId of managerIds) {
    await createNotification({
      userId: managerId,
      type: "CLIENT_CREATED",
      title: "👤 Novo Cliente",
      message: `Cliente "${clientName}" foi cadastrado`,
      actionUrl: `/clients/${clientId}`,
    });
  }
}
```

### Passo 2: Adicionar nas APIs

```typescript
// app/api/proposals/[id]/route.ts
import { notifyProposalAccepted } from "@/lib/notifications";

export async function PUT(request: NextRequest) {
  // ... atualizar proposta ...
  
  if (status === "ACEITA") {
    await notifyProposalAccepted(proposal.id, proposal.createdBy);
  }
  
  return NextResponse.json(proposal);
}
```

---

## 📊 Resultado Esperado

Após implementação:

- ✅ Usuários recebem notificações em tempo real
- ✅ Badge com contador de não lidas no header
- ✅ Som/vibração quando nova notificação (opcional)
- ✅ Histórico completo de notificações
- ✅ Marcar como lida individual ou todas

---

## 🧪 Como Testar

1. **Criar proposta** → Gerente deve receber notificação
2. **Aceitar proposta** → Criador deve receber notificação
3. **Criar card** → Equipe deve receber notificação
4. **Atribuir card** → Usuário atribuído deve receber notificação
5. **Criar cliente** → Gerentes devem receber notificação

---

## 📝 Notas

- **Performance:** Criar notificações é assíncrono, não bloqueia a resposta da API
- **Escalabilidade:** Para muitos usuários, considerar usar fila (Redis, Bull, etc.)
- **Real-time:** Para notificações em tempo real, considerar WebSockets ou Server-Sent Events
- **Email:** Considerar enviar email para notificações importantes

---

**Status:** ⚠️ **NÃO IMPLEMENTADO**  
**Prioridade:** 🔴 **ALTA**  
**Esforço:** 🟡 **MÉDIO** (2-4 horas)

---

**Quer que eu implemente agora?** 🚀
