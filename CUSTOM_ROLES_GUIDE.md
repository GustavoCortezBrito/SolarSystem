# Guia de Cargos Customizados

## Visão Geral

O sistema de cargos customizados permite que o **OWNER** da empresa crie cargos personalizados com permissões específicas, além dos 4 cargos padrão (OWNER, ADMIN, MANAGER, SELLER).

## Acesso

- **Rota**: `/team/roles`
- **Permissão**: Apenas **OWNER** pode acessar
- **Acesso via**: Botão "Cargos Customizados" na página `/team`

## Funcionalidades

### 1. Criar Novo Cargo

1. Clique em "Novo Cargo"
2. Opcionalmente, escolha um template pré-definido:
   - **Instalador**: Acesso limitado aos próprios boards e leads
   - **Engenheiro**: Acesso amplo a boards, leads e relatórios da equipe
   - **Atendente**: Foco em atendimento e criação de leads
   - **Coordenador**: Coordenação de equipes com permissões de gestão

3. Preencha os dados:
   - **Nome**: Nome do cargo (ex: "Instalador", "Engenheiro")
   - **Descrição**: Responsabilidades do cargo
   - **Cor**: Cor do badge que aparecerá no sistema
   - **Permissões**: Selecione as permissões específicas

### 2. Grupos de Permissões

As permissões são organizadas em 5 grupos:

#### 📊 Leads e Clientes
- Ver todos os leads
- Ver próprios leads
- Criar leads
- Editar leads
- Excluir leads
- Atribuir leads

#### 📋 Boards e Cards
- Ver todos os boards
- Ver próprios boards
- Criar boards
- Editar boards
- Excluir boards

#### 👥 Usuários e Equipe
- Ver usuários
- Convidar usuários
- Remover usuários
- Alterar cargos

#### ⚙️ Configurações
- Ver configurações
- Editar configurações

#### 📈 Relatórios
- Ver todos os relatórios
- Ver relatórios da equipe
- Ver próprios relatórios

### 3. Editar Cargo

1. Clique no ícone de edição (✏️) no card do cargo
2. Modifique os dados desejados
3. Clique em "Salvar Alterações"

### 4. Excluir Cargo

1. Clique no ícone de lixeira (🗑️) no card do cargo
2. Confirme a exclusão

**⚠️ Atenção**: Não é possível excluir cargos que estão sendo usados por membros ativos.

## Estrutura de Dados

```typescript
interface CustomRole {
  id: string;
  companyId: string;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

## Templates Disponíveis

### 🔧 Instalador
**Descrição**: Responsável pela instalação dos sistemas

**Permissões**:
- Ver próprios boards
- Editar boards
- Ver próprios leads
- Editar leads

**Cor**: Laranja

---

### 🎓 Engenheiro
**Descrição**: Responsável por dimensionamento e projetos técnicos

**Permissões**:
- Ver todos os boards
- Criar boards
- Editar boards
- Ver todos os leads
- Editar leads
- Ver relatórios da equipe

**Cor**: Índigo

---

### 💬 Atendente
**Descrição**: Atendimento e suporte ao cliente

**Permissões**:
- Ver próprios leads
- Criar leads
- Editar leads
- Ver próprios boards
- Editar boards

**Cor**: Rosa

---

### 📊 Coordenador
**Descrição**: Coordena equipes e projetos

**Permissões**:
- Ver todos os leads
- Criar leads
- Editar leads
- Atribuir leads
- Ver todos os boards
- Criar boards
- Editar boards
- Ver usuários
- Ver relatórios da equipe

**Cor**: Teal

## Uso dos Cargos Customizados

### Ao Convidar Membros

Quando o OWNER ou ADMIN convida um novo membro, além dos cargos padrão, também pode selecionar os cargos customizados criados.

### Alteração de Cargo

O OWNER pode alterar o cargo de um membro para um cargo customizado a qualquer momento.

### Hierarquia

Os cargos customizados ficam abaixo de ADMIN na hierarquia, mas acima de MANAGER e SELLER (dependendo das permissões configuradas).

## Boas Práticas

1. **Nomes Claros**: Use nomes que reflitam claramente a função
2. **Descrições Detalhadas**: Explique as responsabilidades do cargo
3. **Permissões Mínimas**: Conceda apenas as permissões necessárias
4. **Cores Distintas**: Use cores diferentes para facilitar identificação
5. **Revisão Regular**: Revise periodicamente se as permissões ainda fazem sentido

## Exemplos de Uso

### Exemplo 1: Equipe de Instalação
Crie um cargo "Instalador" com acesso apenas aos próprios cards e leads, permitindo que atualizem o status das instalações.

### Exemplo 2: Equipe Técnica
Crie um cargo "Engenheiro" com acesso amplo a boards e leads, mas sem permissões administrativas.

### Exemplo 3: Atendimento
Crie um cargo "Atendente" focado em criar e gerenciar leads, sem acesso a configurações ou relatórios financeiros.

### Exemplo 4: Coordenação
Crie um cargo "Coordenador" com permissões de visualização ampla e capacidade de atribuir tarefas, mas sem poder remover usuários.

## Limitações

- Apenas o OWNER pode criar, editar e excluir cargos customizados
- Não é possível editar os cargos padrão (OWNER, ADMIN, MANAGER, SELLER)
- Cargos em uso não podem ser excluídos
- Cada cargo deve ter pelo menos uma permissão

## Próximos Passos

Para implementar completamente o sistema de cargos customizados:

1. ✅ Criar tipos e estruturas de dados
2. ✅ Criar página de gerenciamento de cargos
3. ✅ Implementar CRUD de cargos
4. ⏳ Integrar com o sistema de convites (permitir selecionar cargo customizado)
5. ⏳ Integrar com alteração de cargo de membros existentes
6. ⏳ Adicionar validação de permissões em todas as rotas
7. ⏳ Persistir dados no banco de dados (atualmente usando mock)

## Arquivos Relacionados

- `app/team/roles/page.tsx` - Página de gerenciamento de cargos
- `types/customRole.ts` - Tipos e templates
- `types/auth.ts` - Permissões e roles
- `lib/permissions.ts` - Funções de verificação de permissões
- `app/team/page.tsx` - Página de equipe com link para cargos
