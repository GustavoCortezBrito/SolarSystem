# 🛠️ Guia de Desenvolvimento - SolarSystem CRM

## Arquitetura do Projeto

### Estrutura de Pastas

```
solarsystem-crm/
├── app/                      # Next.js App Router
│   ├── board/               # Página do board
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Home page
│   └── globals.css          # Estilos globais
├── components/              # Componentes React
│   └── board/              # Componentes do board
├── lib/                     # Utilitários e helpers
├── types/                   # Definições TypeScript
├── public/                  # Arquivos estáticos
└── styles/                  # Estilos adicionais
```

### Padrões de Código

#### Componentes
- Use `"use client"` para componentes com interatividade
- Prefira componentes funcionais com hooks
- Extraia lógica complexa para hooks customizados
- Mantenha componentes pequenos e focados

#### Nomenclatura
- Componentes: `PascalCase` (ex: `CardModal.tsx`)
- Funções: `camelCase` (ex: `handleCardMove`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_CARDS`)
- Tipos: `PascalCase` (ex: `Card`, `Board`)

#### TypeScript
- Sempre defina tipos explícitos
- Use interfaces para objetos
- Use types para unions e intersections
- Evite `any`, prefira `unknown`

## Componentes Principais

### Card Component

```typescript
// components/board/Card.tsx
interface CardProps {
  card: Card;
  onClick: () => void;
  onDelete: () => void;
  members: User[];
}

export function Card({ card, onClick, members }: CardProps) {
  // Renderiza um card individual
  // Mostra labels, prioridade, data, membros
  // Suporta drag and drop
}
```

### Column Component

```typescript
// components/board/Column.tsx
interface ColumnProps {
  column: Column;
  onDelete: (columnId: string) => void;
  onUpdate: (columnId: string, title: string) => void;
  onCardMove: (cardId: string, sourceColumnId: string, 
               targetColumnId: string, targetIndex: number) => void;
  // ... outros props
}

export function Column({ column, ... }: ColumnProps) {
  // Renderiza uma coluna
  // Gerencia cards dentro da coluna
  // Implementa drag and drop
}
```

### CardModal Component

```typescript
// components/board/CardModal.tsx
interface CardModalProps {
  card: Card;
  columnId: string;
  board: Board;
  onClose: () => void;
  onSave: (updates: Partial<Card>) => void;
  onDelete: () => void;
}

export function CardModal({ card, board, ... }: CardModalProps) {
  // Modal completo de edição
  // Gerencia estado local
  // Detecta mudanças não salvas
}
```

## Gerenciamento de Estado

### Estado Local (useState)

Usado para estado de componente individual:

```typescript
const [isEditing, setIsEditing] = useState(false);
const [title, setTitle] = useState(card.title);
```

### Estado do Board

Atualmente gerenciado no componente `BoardPage`:

```typescript
const [board, setBoard] = useState<Board>(initialBoard);

// Atualizar card
const handleUpdateCard = (columnId: string, cardId: string, 
                          updates: Partial<Card>) => {
  setBoard({
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date().toISOString() }
                : card
            ),
          }
        : col
    ),
  });
};
```

### Próximos Passos: Context API

Para compartilhar estado entre componentes:

```typescript
// contexts/BoardContext.tsx
import { createContext, useContext, useState } from 'react';

interface BoardContextType {
  board: Board;
  updateCard: (columnId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  // ... outras funções
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<Board>(initialBoard);
  
  // Implementar funções...
  
  return (
    <BoardContext.Provider value={{ board, updateCard, deleteCard }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
}
```

### Futuro: Zustand ou Redux

Para estado global mais complexo:

```typescript
// store/boardStore.ts
import { create } from 'zustand';

interface BoardStore {
  board: Board;
  updateCard: (columnId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (columnId: string, cardId: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: initialBoard,
  updateCard: (columnId, cardId, updates) =>
    set((state) => ({
      board: {
        ...state.board,
        columns: state.board.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((card) =>
                  card.id === cardId ? { ...card, ...updates } : card
                ),
              }
            : col
        ),
      },
    })),
  // ... outras funções
}));
```

## Drag and Drop

### Implementação Atual (HTML5 Drag and Drop)

```typescript
// Iniciar drag
const handleDragStart = (e: React.DragEvent, cardId: string) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("cardId", cardId);
  e.dataTransfer.setData("sourceColumnId", column.id);
};

// Permitir drop
const handleDragOver = (e: React.DragEvent, index: number) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  setDragOverIndex(index);
};

// Executar drop
const handleDrop = (e: React.DragEvent, targetIndex: number) => {
  e.preventDefault();
  const cardId = e.dataTransfer.getData("cardId");
  const sourceColumnId = e.dataTransfer.getData("sourceColumnId");
  
  onCardMove(cardId, sourceColumnId, column.id, targetIndex);
  setDragOverIndex(null);
};
```

### Alternativa: React DnD ou dnd-kit

Para funcionalidades mais avançadas:

```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function Board() {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // Lógica de reordenação
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cards} strategy={verticalListSortingStrategy}>
        {cards.map(card => <Card key={card.id} card={card} />)}
      </SortableContext>
    </DndContext>
  );
}
```

## Animações com Framer Motion

### Animações Básicas

```typescript
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Conteúdo
</motion.div>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo
</motion.div>

// Scale on hover
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Botão
</motion.div>
```

### Layout Animations

```typescript
// Anima mudanças de layout automaticamente
<motion.div layout>
  Conteúdo que muda de posição
</motion.div>

// Reorder list
import { Reorder } from 'framer-motion';

<Reorder.Group values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item.id} value={item}>
      {item.content}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

## Estilização com TailwindCSS

### Classes Utilitárias

```typescript
// Layout
className="flex items-center justify-between"
className="grid grid-cols-3 gap-4"

// Espaçamento
className="p-4 m-2"  // padding e margin
className="space-x-2 space-y-4"  // espaço entre elementos

// Cores
className="bg-primary-500 text-white"
className="hover:bg-primary-600"

// Bordas e sombras
className="rounded-lg border border-gray-200 shadow-md"

// Responsividade
className="w-full md:w-1/2 lg:w-1/3"
```

### Classes Customizadas

```css
/* app/globals.css */
@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

### Configuração de Cores

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#e6f7f7',
        500: '#16a0a0',
        900: '#065a5a',
      },
    },
  },
}
```

## API Routes (Próxima Fase)

### Estrutura de API

```
app/
└── api/
    ├── boards/
    │   ├── route.ts              # GET, POST /api/boards
    │   └── [id]/
    │       ├── route.ts          # GET, PUT, DELETE /api/boards/:id
    │       └── cards/
    │           └── route.ts      # GET, POST /api/boards/:id/cards
    ├── cards/
    │   └── [id]/
    │       └── route.ts          # GET, PUT, DELETE /api/cards/:id
    └── users/
        └── route.ts              # GET /api/users
```

### Exemplo de API Route

```typescript
// app/api/boards/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Buscar boards do banco de dados
  const boards = await db.board.findMany();
  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Validar dados
  // Criar board no banco
  const board = await db.board.create({ data: body });
  return NextResponse.json(board, { status: 201 });
}
```

### Fetch de Dados

```typescript
// lib/api.ts
export async function getBoards() {
  const response = await fetch('/api/boards');
  if (!response.ok) throw new Error('Failed to fetch boards');
  return response.json();
}

export async function updateCard(cardId: string, updates: Partial<Card>) {
  const response = await fetch(`/api/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update card');
  return response.json();
}

// Uso no componente
import { useQuery, useMutation } from '@tanstack/react-query';

function BoardPage() {
  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });
  
  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, updates }) => updateCard(cardId, updates),
    onSuccess: () => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}
```

## Banco de Dados (Prisma)

### Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  avatar    String?
  boards    Board[]
  cards     Card[]   @relation("CardAssignees")
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Board {
  id        String   @id @default(cuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  columns   Column[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Column {
  id        String   @id @default(cuid())
  title     String
  position  Int
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  cards     Card[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Card {
  id          String    @id @default(cuid())
  title       String
  description String?
  position    Int
  priority    String?
  dueDate     DateTime?
  columnId    String
  column      Column    @relation(fields: [columnId], references: [id], onDelete: Cascade)
  assignees   User[]    @relation("CardAssignees")
  labels      Label[]
  comments    Comment[]
  attachments Attachment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Label {
  id     String @id @default(cuid())
  name   String
  color  String
  cardId String
  card   Card   @relation(fields: [cardId], references: [id], onDelete: Cascade)
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  cardId    String
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Attachment {
  id        String   @id @default(cuid())
  name      String
  url       String
  size      Int
  type      String
  cardId    String
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

### Comandos Prisma

```bash
# Instalar Prisma
npm install prisma @prisma/client

# Inicializar Prisma
npx prisma init

# Criar migração
npx prisma migrate dev --name init

# Gerar cliente
npx prisma generate

# Abrir Prisma Studio
npx prisma studio
```

## Testes

### Jest + React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/board/Card';

describe('Card Component', () => {
  const mockCard = {
    id: '1',
    title: 'Test Card',
    description: 'Test description',
    labels: ['Test'],
    assignees: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders card title', () => {
    render(<Card card={mockCard} onClick={() => {}} onDelete={() => {}} members={[]} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Card card={mockCard} onClick={handleClick} onDelete={() => {}} members={[]} />);
    fireEvent.click(screen.getByText('Test Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Performance

### Otimizações

```typescript
// Memoização de componentes
import { memo } from 'react';

export const Card = memo(function Card({ card, onClick }: CardProps) {
  // ...
});

// useMemo para cálculos pesados
const sortedCards = useMemo(() => {
  return cards.sort((a, b) => a.position - b.position);
}, [cards]);

// useCallback para funções
const handleCardClick = useCallback((cardId: string) => {
  // ...
}, []);

// Lazy loading de componentes
const CardModal = lazy(() => import('@/components/board/CardModal'));
```

### Code Splitting

```typescript
// Carregar componente apenas quando necessário
import dynamic from 'next/dynamic';

const CardModal = dynamic(() => import('@/components/board/CardModal'), {
  loading: () => <div>Carregando...</div>,
});
```

## Debugging

### React DevTools
- Instale a extensão React DevTools
- Inspecione componentes e props
- Visualize hierarquia de componentes

### Console Logs Úteis

```typescript
// Log estruturado
console.log('Card moved:', { cardId, sourceColumnId, targetColumnId });

// Log condicional
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Breakpoint no código
debugger;
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Algo deu errado. Por favor, recarregue a página.</div>;
    }

    return this.props.children;
  }
}
```

## Recursos Úteis

### Documentação
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Prisma](https://www.prisma.io/docs)

### Ferramentas
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) - Testar APIs
- [Prisma Studio](https://www.prisma.io/studio) - Visualizar banco
- [Vercel](https://vercel.com) - Deploy

### Extensões VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- ESLint
- Prettier
- GitLens

---

**Última atualização**: Maio 2026
