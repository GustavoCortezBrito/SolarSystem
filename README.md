# SolarSystem CRM

> **Status**: ✅ Fase 1 Concluída (100%) | 🎯 Próxima: Backend e Persistência

Sistema de CRM inspirado no SolarMarket para gestão de processos fotovoltaicos com funcionalidade principal de board estilo Trello.

## 🚀 Tecnologias

- **Next.js 16.2** - Framework React com App Router
- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **TailwindCSS** - Framework CSS utility-first
- **Framer Motion** - Biblioteca de animações para React
- **Lucide React** - Ícones modernos e customizáveis

## 🏢 Arquitetura Multi-Tenant

O SolarSystem é um **SaaS multi-tenant** onde múltiplas empresas podem usar o sistema simultaneamente:

### Estrutura de Usuários
```
User (Pessoa Física)
  ↓
Membership (Liga usuário à empresa + role)
  ↓
Company (Empresa/Tenant)
  ↓
Boards, Leads, etc. (Dados isolados por empresa)
```

### Hierarquia de Roles
- **OWNER** - Proprietário (acesso total, incluindo faturamento)
- **ADMIN** - Administrador (quase tudo, exceto billing)
- **MANAGER** - Gerente (gestão de equipe, vê todos os leads)
- **SELLER** - Vendedor (apenas seus próprios leads)

### Características
- ✅ Um usuário pode estar em **múltiplas empresas**
- ✅ Roles diferentes em cada empresa
- ✅ Dados completamente isolados por tenant
- ✅ Sistema de permissões granular
- ✅ 4 planos de assinatura (FREE, STARTER, PROFESSIONAL, ENTERPRISE)

**Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para documentação completa da arquitetura multi-tenant.**

## 📋 Funcionalidades

### ✅ Implementadas

- **Sistema de Autenticação** 🆕
  - ✅ Tela de login e cadastro
  - ✅ Seleção de empresa (multi-tenant)
  - ✅ Proteção de rotas
  - ✅ Usuário em múltiplas empresas
  - ✅ Logout e troca de empresa

- **Gestão de Equipe (Membros)** 🆕
  - ✅ Listar membros da empresa
  - ✅ Convidar novos membros
  - ✅ Definir e alterar cargos (OWNER, ADMIN, MANAGER, SELLER)
  - ✅ Remover membros (respeitando hierarquia)
  - ✅ Buscar membros
  - ✅ **Cargos Customizados** (OWNER pode criar cargos personalizados) 🆕

- **Gestão de Clientes** 🆕
  - ✅ Cadastrar clientes (Residencial, Comercial, Industrial, Rural)
  - ✅ Filtrar por tipo e status
  - ✅ Buscar clientes
  - ✅ **Página de detalhes editável** 🆕
  - ✅ Dados completos (consumo, projeto, valores)
  - ✅ Histórico de atividades (11 tipos)
  - ✅ Atribuir vendedor responsável
  - ✅ Tags e observações

- **Board Estilo Trello Completo**
  - ✅ Colunas arrastáveis (drag and drop)
  - ✅ **Cards arrastáveis entre colunas** (drag and drop nativo)
  - ✅ Adicionar/editar/excluir colunas
  - ✅ Adicionar/editar/excluir cards
  - ✅ **Modal completo de edição de cards**
  - ✅ **Atribuição de múltiplos membros/usuários**
  - ✅ **Sistema de tags/labels coloridas** (10 categorias pré-definidas)
  - ✅ **Prioridades** (Baixa, Média, Alta)
  - ✅ **Datas de vencimento** com indicador de atraso
  - ✅ **Filtros funcionais** (responsável, prioridade, data) 🆕
  - ✅ Descrições detalhadas
  - ✅ Indicadores visuais (comentários, anexos)
  - ✅ Timestamps de criação e atualização
  - ✅ Animações suaves com Framer Motion
  - ✅ Boards separados por empresa

- **Cargos Customizados** 🆕
  - ✅ OWNER pode criar cargos personalizados
  - ✅ 5 grupos de permissões configuráveis
  - ✅ 4 templates pré-definidos (Instalador, Engenheiro, Atendente, Coordenador)
  - ✅ Editar e excluir cargos
  - ✅ Cores personalizáveis para badges
  - ✅ Interface intuitiva com checkboxes agrupados

- **Interface Moderna**
  - Design responsivo (mobile, tablet, desktop)
  - Tema inspirado no SolarMarket
  - Gradientes e cores personalizadas
  - Ícones intuitivos
  - Modal de edição completo e intuitivo
  - Animações suaves em todas as interações

### 🔜 Próximas Funcionalidades (Baseadas no SolarMarket)

1. **CRM com Processos Simultâneos**
   - Gerenciamento de múltiplos processos paralelos
   - Acompanhamento de jornadas
   - Gestão de responsáveis

2. **Dimensionamento Fotovoltaico**
   - Cálculo de sistemas on-grid
   - Sistemas híbridos
   - Zero grid
   - Múltiplas unidades consumidoras

3. **Predificações e Propostas Personalizadas**
   - Configuração de custos
   - Geração de propostas
   - Templates personalizáveis

4. **Checklists Inteligentes**
   - Validação de dados
   - Preenchimento guiado
   - Controle de qualidade

5. **Métricas em Tempo Real**
   - Dashboards de vendas
   - Métricas de processos
   - Análise de mercado
   - Integração PowerBI

6. **Documentos e Assinatura Eletrônica**
   - Formulários próprios
   - Assinatura eletrônica
   - Validação jurídica (ClickSign)

7. **Marketplace Integrado**
   - Catálogo de equipamentos
   - Integração com distribuidores
   - Cotação automática

8. **Automatizações Poderosas**
   - Gatilhos personalizados
   - Regras condicionais
   - Ações automáticas

9. **Integrações com Plataformas**
   - Meta Ads
   - Google Ads
   - RD Station
   - Zapier
   - Make
   - Outras aplicações

## � Documentação Completa

- **[QUICKSTART.md](QUICKSTART.md)** - Guia rápido de instalação e primeiros passos
- **[FEATURES.md](FEATURES.md)** - Documentação detalhada de todas as funcionalidades
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia técnico para desenvolvedores
- **[ROADMAP.md](ROADMAP.md)** - Planejamento de funcionalidades futuras
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Checklist completo de testes
- **[SUMMARY.md](SUMMARY.md)** - Resumo executivo do projeto

## �🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

Acesse: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
solarsystem-crm/
├── app/
│   ├── board/
│   │   └── page.tsx          # Página do board Trello
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Página inicial
│   └── globals.css           # Estilos globais
├── components/
│   └── board/
│       ├── Card.tsx          # Componente de card
│       ├── Column.tsx        # Componente de coluna
│       └── AddColumnButton.tsx # Botão adicionar coluna
├── types/
│   └── board.ts              # Tipos TypeScript
├── tailwind.config.ts        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências do projeto
```

## 🎨 Paleta de Cores

- **Primary (Teal)**: Inspirado no SolarMarket
  - 500: `#16a0a0`
  - 600: `#128f8f`
  - 700: `#0e7d7d`

- **Secondary (Blue)**
  - 500: `#0ea5e9`
  - 600: `#0284c7`

## 🔧 Configuração

O projeto está configurado com:
- TypeScript strict mode
- ESLint para linting
- Prettier (recomendado adicionar)
- Path aliases (`@/*`)

## 🎯 Como Usar

### Testar o Board
1. Execute `npm run dev`
2. Acesse `http://localhost:3000/board`
3. **Arraste cards** entre colunas
4. **Clique em um card** para editar
5. **Adicione tags, membros, datas e prioridades**
6. **Crie novas colunas e cards**

### Explorar Funcionalidades
- ✅ **Drag and Drop**: Arraste cards entre colunas ou reordene na mesma coluna
- ✅ **Edição Completa**: Clique em qualquer card para abrir o modal de edição
- ✅ **Tags Coloridas**: Adicione múltiplas tags para categorizar projetos
- ✅ **Atribuir Membros**: Selecione responsáveis para cada card
- ✅ **Prioridades**: Defina prioridade (Baixa, Média, Alta)
- ✅ **Datas**: Configure datas de vencimento com alertas visuais

Consulte o **[FEATURES.md](FEATURES.md)** para guia completo de uso.

## 📝 Próximos Passos

Consulte o **[ROADMAP.md](ROADMAP.md)** para o planejamento completo das próximas 12 fases.

**Fase 2 (Próxima)**:
1. Implementar persistência de dados (PostgreSQL + Prisma)
2. Criar API REST com Next.js API Routes
3. Adicionar autenticação de usuários (NextAuth.js)
4. Sistema de sincronização em tempo real

## 🤝 Contribuindo

Este é um projeto em desenvolvimento. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto privado - Todos os direitos reservados.
