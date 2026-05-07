# Guia de Cores de Colunas

## Visão Geral

As colunas do board agora podem ser personalizadas com cores diferentes, similar ao Trello. Cada coluna pode ter uma cor de fundo e cabeçalho customizada para melhor organização visual.

## Funcionalidades Implementadas

### 1. Seletor de Cores
- **9 opções de cores disponíveis:**
  - Padrão (cinza)
  - Azul
  - Verde
  - Amarelo
  - Laranja
  - Vermelho
  - Roxo
  - Rosa
  - Índigo

### 2. Interface de Usuário
- **Menu da coluna** (ícone ⋮):
  - Editar título
  - **Alterar cor** (novo)
  - Excluir coluna

- **Modal de seleção de cores:**
  - Grid 3x3 com todas as cores disponíveis
  - Preview visual de cada cor
  - Indicação visual da cor atualmente selecionada
  - Botão X para fechar
  - Fecha automaticamente ao clicar fora

### 3. Aplicação Visual
- **Background da coluna:** Cor suave (ex: `bg-blue-50`)
- **Cabeçalho da coluna:** Cor mais intensa (ex: `bg-blue-100`)
- **Transição suave** ao mudar de cor

## Estrutura Técnica

### Tipo Column (types/board.ts)
```typescript
export interface Column {
  id: string;
  title: string;
  color?: string; // Cor da coluna (opcional)
  cards: Card[];
}
```

### Cores Disponíveis (components/board/Column.tsx)
```typescript
const columnColors = [
  { name: "Padrão", value: "", bg: "bg-gray-100", header: "bg-gray-100" },
  { name: "Azul", value: "blue", bg: "bg-blue-50", header: "bg-blue-100" },
  { name: "Verde", value: "green", bg: "bg-green-50", header: "bg-green-100" },
  { name: "Amarelo", value: "yellow", bg: "bg-yellow-50", header: "bg-yellow-100" },
  { name: "Laranja", value: "orange", bg: "bg-orange-50", header: "bg-orange-100" },
  { name: "Vermelho", value: "red", bg: "bg-red-50", header: "bg-red-100" },
  { name: "Roxo", value: "purple", bg: "bg-purple-50", header: "bg-purple-100" },
  { name: "Rosa", value: "pink", bg: "bg-pink-50", header: "bg-pink-100" },
  { name: "Índigo", value: "indigo", bg: "bg-indigo-50", header: "bg-indigo-100" },
];
```

## Como Usar

### Para o Usuário Final

1. **Abrir o menu da coluna:**
   - Clique no ícone ⋮ (três pontos verticais) no canto superior direito da coluna

2. **Selecionar "Alterar cor":**
   - Um modal com 9 opções de cores será exibido

3. **Escolher uma cor:**
   - Clique na cor desejada
   - A coluna será atualizada imediatamente
   - O modal fecha automaticamente

4. **Voltar à cor padrão:**
   - Selecione a opção "Padrão" (cinza)

### Para Desenvolvedores

#### Atualizar uma coluna com cor
```typescript
handleUpdateColumn(columnId, "Novo Título", "blue");
```

#### Criar uma coluna com cor
```typescript
const newColumn: Column = {
  id: "col-123",
  title: "Minha Coluna",
  color: "green", // Opcional
  cards: [],
};
```

## Comportamento

### Fechamento Automático
- O modal de cores fecha ao:
  - Clicar em uma cor
  - Clicar no botão X
  - Clicar fora do modal

### Persistência
- A cor selecionada é mantida no estado do board
- **Nota:** Em produção, deve ser salva no backend

### Indicação Visual
- A cor atualmente selecionada tem:
  - Borda azul (`border-primary-500`)
  - Ring azul (`ring-2 ring-primary-200`)
  - Escala ligeiramente maior ao hover

## Integração com Backend

Quando integrar com backend real, certifique-se de:

1. **Salvar a cor ao atualizar:**
```typescript
await api.updateColumn(columnId, {
  title: column.title,
  color: column.color,
});
```

2. **Carregar a cor ao buscar o board:**
```typescript
const board = await api.getBoard(boardId);
// board.columns já incluirá o campo color
```

3. **Validar valores de cor:**
```typescript
const validColors = ["", "blue", "green", "yellow", "orange", "red", "purple", "pink", "indigo"];
```

## Melhorias Futuras

### Possíveis Extensões
1. **Cores customizadas:** Permitir que o usuário escolha qualquer cor via color picker
2. **Temas:** Conjuntos de cores pré-definidos para o board inteiro
3. **Gradientes:** Suporte para cores gradientes
4. **Ícones:** Adicionar ícones às colunas além das cores
5. **Presets:** Salvar combinações de cores favoritas

### Acessibilidade
- Considerar adicionar indicadores além de cor (ícones, padrões)
- Garantir contraste adequado para texto sobre fundos coloridos
- Adicionar labels ARIA para leitores de tela

## Arquivos Modificados

1. **types/board.ts**
   - Adicionado campo `color?: string` ao tipo `Column`

2. **components/board/Column.tsx**
   - Adicionado estado `showColorPicker`
   - Adicionado array `columnColors` com 9 opções
   - Adicionado função `handleChangeColor`
   - Adicionado botão "Alterar cor" no menu
   - Adicionado modal de seleção de cores
   - Aplicado cores ao background e header da coluna
   - Adicionado ref `colorPickerRef` para fechar ao clicar fora

3. **app/board/page.tsx**
   - Atualizado `handleUpdateColumn` para aceitar parâmetro `color?: string`
   - Atualizado estado do board ao mudar cor

## Conclusão

O sistema de cores de colunas está totalmente funcional e pronto para uso. A implementação segue os padrões do Trello, oferecendo uma experiência familiar aos usuários e facilitando a organização visual do board.
