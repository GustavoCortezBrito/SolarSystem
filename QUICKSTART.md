# 🚀 Guia Rápido - SolarSystem CRM

## Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo de desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## Estrutura do Projeto

```
solarsystem-crm/
├── app/
│   ├── board/
│   │   └── page.tsx          # Página do Board Trello
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Página inicial (Home)
│   └── globals.css           # Estilos globais
├── components/
│   └── board/
│       ├── Card.tsx          # Card individual
│       ├── Column.tsx        # Coluna do board
│       ├── CardModal.tsx     # Modal de edição
│       └── AddColumnButton.tsx
├── lib/
│   └── mockData.ts           # Dados de exemplo
├── types/
│   └── board.ts              # Tipos TypeScript
└── README.md
```

## Navegação

### Página Inicial
- **URL**: `http://localhost:3000`
- **Conteúdo**: 
  - Hero section com apresentação
  - Grid de funcionalidades do CRM
  - Link para o Board

### Board Trello
- **URL**: `http://localhost:3000/board`
- **Conteúdo**:
  - Board completo com drag and drop
  - 6 colunas pré-configuradas
  - 13 cards de exemplo
  - 7 membros da equipe

## Funcionalidades Principais

### ✅ Drag and Drop
- Arraste cards entre colunas
- Reordene cards dentro da coluna
- Indicador visual de posição

### ✅ Edição de Cards
- Clique em qualquer card para editar
- Modal completo com todas as opções
- Salvar alterações automaticamente

### ✅ Gestão de Equipe
- 7 membros pré-cadastrados
- Atribuição múltipla de responsáveis
- Avatares com iniciais

### ✅ Tags e Categorias
- 10 tags pré-definidas
- Cores personalizadas
- Múltiplas tags por card

### ✅ Prioridades
- Baixa (cinza)
- Média (amarelo)
- Alta (vermelho)

### ✅ Datas de Vencimento
- Seletor de data
- Indicador visual de atraso
- Formato brasileiro (DD/MMM)

## Dados de Exemplo

O projeto vem com dados completos de exemplo:

### Membros
1. João Silva
2. Maria Santos
3. Pedro Costa
4. Ana Oliveira
5. Carlos Souza
6. Juliana Lima
7. Roberto Alves

### Colunas
1. 📥 Leads (3 cards)
2. 📐 Dimensionamento (2 cards)
3. 📄 Proposta (2 cards)
4. 🤝 Negociação (2 cards)
5. 🔧 Instalação (2 cards)
6. ✅ Concluído (2 cards)

### Tags Disponíveis
- Residencial
- Comercial
- Industrial
- Urgente
- Híbrido
- On-Grid
- Off-Grid
- Aguardando Cliente
- Revisão Técnica
- Aprovado

## Personalização

### Adicionar Novos Membros
Edite `lib/mockData.ts`:

```typescript
export const mockMembers: User[] = [
  { id: "8", name: "Seu Nome", email: "seu@email.com" },
  // ...
];
```

### Adicionar Novas Tags
Edite `lib/mockData.ts`:

```typescript
export const mockLabels = [
  "Nova Tag",
  // ...
];
```

### Personalizar Cores das Tags
Edite `components/board/Card.tsx` e `components/board/CardModal.tsx`:

```typescript
const labelColors: Record<string, string> = {
  "Nova Tag": "bg-pink-100 text-pink-800",
  // ...
};
```

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## Tecnologias

- **Next.js 16.2** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## Próximos Passos

1. ✅ Explore o board e teste o drag and drop
2. ✅ Edite alguns cards e adicione informações
3. ✅ Crie novas colunas e cards
4. ✅ Atribua membros e defina prioridades
5. 📝 Personalize os dados de exemplo
6. 🔧 Implemente persistência de dados (API/Database)
7. 🔐 Adicione autenticação de usuários
8. 📊 Desenvolva as outras funcionalidades do CRM

## Suporte

Para dúvidas ou problemas:
1. Consulte o `README.md` para visão geral
2. Leia o `FEATURES.md` para funcionalidades detalhadas
3. Verifique os tipos em `types/board.ts`
4. Analise os componentes em `components/board/`

## Dicas

💡 **Dica 1**: Use Ctrl+Click (Cmd+Click no Mac) para abrir links em nova aba

💡 **Dica 2**: O modal de edição fecha automaticamente ao clicar fora dele

💡 **Dica 3**: Pressione ESC para fechar o modal rapidamente

💡 **Dica 4**: Use Enter para adicionar cards e colunas rapidamente

💡 **Dica 5**: As alterações são salvas automaticamente ao clicar em "Salvar"

## Troubleshooting

### Erro ao instalar dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta 3000 já em uso
```bash
# Use outra porta
npm run dev -- -p 3001
```

### Erro de TypeScript
```bash
# Verifique a versão do Node.js
node --version  # Deve ser 18+

# Reinstale as dependências de tipos
npm install --save-dev @types/react @types/node
```

## Licença

Projeto privado - Todos os direitos reservados.
