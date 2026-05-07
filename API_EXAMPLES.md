# Exemplos de Uso das APIs

## 🆕 Novas APIs Implementadas

### 1. Adicionar Nota no Histórico do Cliente

```typescript
// POST /api/clients/[clientId]/activities
const response = await fetch(`/api/clients/${clientId}/activities`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'NOTE', // NOTE, CALL, EMAIL, MEETING
    description: 'Cliente demonstrou interesse em sistema de 10kWp',
    metadata: {
      // Dados adicionais opcionais
      nextFollowUp: '2026-05-15',
      priority: 'high'
    }
  })
});

const activity = await response.json();
```

**Tipos de atividade disponíveis:**
- `NOTE` - Nota geral
- `CALL` - Ligação telefônica
- `EMAIL` - Email enviado
- `MEETING` - Reunião
- `STATUS_CHANGE` - Mudança de status (automático)
- `PROPOSAL_SENT` - Proposta enviada (automático)
- `CARD_MOVED` - Card movido (automático)
- `CARD_ASSIGNED` - Card vinculado (automático)

---

### 2. Criar Nova Coluna no Board

```typescript
// POST /api/board/columns
const response = await fetch('/api/board/columns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    boardId: 'board-id',
    title: 'Aguardando Documentação',
    color: '#f59e0b', // Cor em hexadecimal
    order: 3 // Posição (opcional, se omitido vai para o final)
  })
});

const column = await response.json();
```

**Cores sugeridas:**
- Azul: `#3b82f6`
- Roxo: `#8b5cf6`
- Laranja: `#f59e0b`
- Verde: `#10b981`
- Ciano: `#06b6d4`
- Verde claro: `#22c55e`
- Vermelho: `#ef4444`
- Rosa: `#ec4899`

---

### 3. Editar Coluna Existente

```typescript
// PUT /api/board/columns/[columnId]
const response = await fetch(`/api/board/columns/${columnId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Novo Nome da Coluna',
    color: '#22c55e'
  })
});

const updatedColumn = await response.json();
```

---

### 4. Deletar Coluna

```typescript
// DELETE /api/board/columns/[columnId]
const response = await fetch(`/api/board/columns/${columnId}`, {
  method: 'DELETE'
});

if (response.ok) {
  console.log('Coluna deletada com sucesso');
} else {
  const error = await response.json();
  console.error(error.error); // Ex: "Não é possível deletar coluna com cards"
}
```

**Importante:** Não é possível deletar colunas que contêm cards. Mova os cards primeiro.

---

### 5. Reordenar Colunas

```typescript
// PUT /api/board/columns (reorder)
const response = await fetch('/api/board/columns', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    columns: [
      { id: 'col-1', order: 0 },
      { id: 'col-2', order: 1 },
      { id: 'col-3', order: 2 },
      { id: 'col-4', order: 3 }
    ]
  })
});
```

---

### 6. Listar Membros da Empresa

```typescript
// GET /api/companies/[companyId]/members
const response = await fetch(`/api/companies/${companyId}/members`, {
  headers: {
    'x-user-id': userId // Header de autenticação
  }
});

const { members } = await response.json();

// Estrutura de retorno:
// {
//   members: [
//     {
//       id: 'membership-id',
//       role: 'OWNER',
//       userId: 'user-id',
//       companyId: 'company-id',
//       user: {
//         id: 'user-id',
//         name: 'João Silva',
//         email: 'joao@empresa.com',
//         image: null
//       },
//       createdAt: '2026-05-07T...',
//       updatedAt: '2026-05-07T...'
//     }
//   ]
// }
```

---

### 7. Convidar Novo Membro

```typescript
// POST /api/companies/[companyId]/members
const response = await fetch(`/api/companies/${companyId}/members`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  },
  body: JSON.stringify({
    email: 'novomembro@empresa.com',
    role: 'MEMBER' // OWNER, ADMIN, MEMBER, VIEWER
  })
});

if (response.ok) {
  const member = await response.json();
  console.log('Membro adicionado:', member);
} else {
  const error = await response.json();
  console.error(error.error); 
  // Possíveis erros:
  // - "Usuário não encontrado. O usuário precisa criar uma conta primeiro."
  // - "Usuário já é membro desta empresa"
}
```

**Roles disponíveis:**
- `OWNER` - Proprietário (acesso total)
- `ADMIN` - Administrador (quase tudo, exceto billing)
- `MEMBER` - Membro (acesso padrão)
- `VIEWER` - Visualizador (apenas leitura)

---

### 8. Alterar Role de um Membro

```typescript
// PUT /api/companies/[companyId]/members/[memberId]
const response = await fetch(
  `/api/companies/${companyId}/members/${memberId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({
      role: 'ADMIN'
    })
  }
);

const updatedMember = await response.json();
```

---

### 9. Remover Membro

```typescript
// DELETE /api/companies/[companyId]/members/[memberId]
const response = await fetch(
  `/api/companies/${companyId}/members/${memberId}`,
  {
    method: 'DELETE',
    headers: {
      'x-user-id': userId
    }
  }
);

if (response.ok) {
  console.log('Membro removido com sucesso');
} else {
  const error = await response.json();
  console.error(error.error);
  // Possível erro: "Não é possível remover o último proprietário da empresa"
}
```

**Proteção:** Não é possível remover o último OWNER da empresa.

---

## 📝 Exemplos de Fluxos Completos

### Fluxo 1: Adicionar Nota após Ligação

```typescript
async function registrarLigacao(clientId: string, observacoes: string) {
  const response = await fetch(`/api/clients/${clientId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'CALL',
      description: `Ligação realizada: ${observacoes}`,
      metadata: {
        duration: '15 minutos',
        outcome: 'positivo'
      }
    })
  });
  
  return response.json();
}

// Uso
await registrarLigacao(
  'client-123',
  'Cliente interessado em sistema de 15kWp. Agendar visita técnica.'
);
```

---

### Fluxo 2: Personalizar Board Completo

```typescript
async function personalizarBoard(boardId: string) {
  // 1. Criar nova coluna
  const novaColuna = await fetch('/api/board/columns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      boardId,
      title: 'Aguardando Aprovação',
      color: '#f59e0b',
      order: 2
    })
  }).then(r => r.json());

  // 2. Editar coluna existente
  await fetch(`/api/board/columns/${colunaExistenteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Em Instalação',
      color: '#06b6d4'
    })
  });

  // 3. Reordenar todas as colunas
  await fetch('/api/board/columns', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      columns: [
        { id: 'col-1', order: 0 },
        { id: 'col-2', order: 1 },
        { id: novaColuna.id, order: 2 },
        { id: 'col-3', order: 3 }
      ]
    })
  });
}
```

---

### Fluxo 3: Montar Equipe Completa

```typescript
async function montarEquipe(companyId: string) {
  const membros = [
    { email: 'gerente@empresa.com', role: 'ADMIN' },
    { email: 'vendedor1@empresa.com', role: 'MEMBER' },
    { email: 'vendedor2@empresa.com', role: 'MEMBER' },
    { email: 'suporte@empresa.com', role: 'VIEWER' }
  ];

  for (const membro of membros) {
    try {
      const response = await fetch(`/api/companies/${companyId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(membro)
      });

      if (response.ok) {
        console.log(`✅ ${membro.email} adicionado como ${membro.role}`);
      } else {
        const error = await response.json();
        console.error(`❌ ${membro.email}: ${error.error}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao adicionar ${membro.email}:`, error);
    }
  }
}
```

---

## 🔐 Autenticação

Todas as APIs requerem autenticação. Use NextAuth ou envie o header `x-user-id`:

```typescript
const response = await fetch('/api/endpoint', {
  headers: {
    'x-user-id': localStorage.getItem('userId')
  }
});
```

---

## ⚠️ Tratamento de Erros

Sempre verifique o status da resposta:

```typescript
const response = await fetch('/api/endpoint', { /* ... */ });

if (!response.ok) {
  const error = await response.json();
  console.error('Erro:', error.error);
  // Mostrar mensagem para o usuário
  alert(error.error);
  return;
}

const data = await response.json();
// Processar dados com sucesso
```

---

## 📚 Documentação Completa

Para lista completa de todas as APIs disponíveis, consulte:
- `DEPLOYMENT_CHECKLIST.md` - Lista de todas as APIs
- `READY_FOR_DEPLOY.md` - Visão geral do sistema
