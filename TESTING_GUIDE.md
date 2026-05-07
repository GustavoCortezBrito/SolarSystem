# 🧪 Guia de Testes - SolarSystem CRM

## Checklist de Funcionalidades

Use este guia para testar todas as funcionalidades implementadas no board.

## 1. Navegação Básica

### ✅ Página Inicial
- [ ] Acessar `http://localhost:3000`
- [ ] Verificar se o logo "SolarSystem" aparece
- [ ] Verificar se o hero section está visível
- [ ] Verificar se o grid de 6 funcionalidades está presente
- [ ] Clicar em "Acessar Board" e verificar redirecionamento

### ✅ Página do Board
- [ ] Acessar `http://localhost:3000/board`
- [ ] Verificar se o título "Projetos Fotovoltaicos 2026" aparece
- [ ] Verificar se 6 colunas estão visíveis
- [ ] Verificar se há cards nas colunas
- [ ] Verificar se o contador de colunas e cards está correto

## 2. Gestão de Colunas

### ✅ Visualização de Colunas
- [ ] Verificar se todas as 6 colunas aparecem:
  - 📥 Leads
  - 📐 Dimensionamento
  - 📄 Proposta
  - 🤝 Negociação
  - 🔧 Instalação
  - ✅ Concluído
- [ ] Verificar se o contador de cards em cada coluna está correto

### ✅ Adicionar Coluna
1. [ ] Clicar no botão "Adicionar coluna" (último item)
2. [ ] Verificar se o campo de input aparece
3. [ ] Digitar "Nova Coluna"
4. [ ] Pressionar Enter ou clicar em "Adicionar"
5. [ ] Verificar se a nova coluna aparece no final
6. [ ] Verificar se o contador de colunas aumentou

### ✅ Editar Coluna
1. [ ] Clicar no ícone ⋮ (três pontos) no cabeçalho de qualquer coluna
2. [ ] Selecionar "Editar título"
3. [ ] Verificar se o campo de input aparece
4. [ ] Alterar o nome para "Coluna Editada"
5. [ ] Pressionar Enter ou clicar fora
6. [ ] Verificar se o nome foi atualizado

### ✅ Excluir Coluna
1. [ ] Clicar no ícone ⋮ em uma coluna vazia
2. [ ] Selecionar "Excluir coluna"
3. [ ] Verificar se a coluna foi removida
4. [ ] Verificar se o contador de colunas diminuiu

## 3. Gestão de Cards

### ✅ Visualização de Cards
- [ ] Verificar se os cards mostram:
  - Título
  - Tags coloridas
  - Ícone de prioridade (se houver)
  - Data de vencimento (se houver)
  - Avatares dos membros
- [ ] Verificar se cards com data vencida aparecem em vermelho

### ✅ Adicionar Card
1. [ ] Clicar em "Adicionar card" no final de qualquer coluna
2. [ ] Verificar se o campo de texto aparece
3. [ ] Digitar "Novo Card de Teste"
4. [ ] Pressionar Enter ou clicar em "Adicionar"
5. [ ] Verificar se o card aparece na coluna
6. [ ] Verificar se o contador da coluna aumentou

### ✅ Visualizar Card
1. [ ] Clicar em qualquer card
2. [ ] Verificar se o modal de edição abre
3. [ ] Verificar se todas as informações do card aparecem
4. [ ] Clicar fora do modal ou no X
5. [ ] Verificar se o modal fecha

## 4. Drag and Drop

### ✅ Arrastar Card Entre Colunas
1. [ ] Clicar e segurar em um card
2. [ ] Arrastar para outra coluna
3. [ ] Verificar se aparece um indicador azul mostrando a posição
4. [ ] Soltar o card
5. [ ] Verificar se o card mudou de coluna
6. [ ] Verificar se os contadores foram atualizados

### ✅ Reordenar Cards na Mesma Coluna
1. [ ] Clicar e segurar em um card
2. [ ] Arrastar para cima ou para baixo na mesma coluna
3. [ ] Verificar o indicador de posição
4. [ ] Soltar o card
5. [ ] Verificar se a ordem mudou

### ✅ Arrastar para Coluna Vazia
1. [ ] Arrastar um card para uma coluna sem cards
2. [ ] Verificar se o card é adicionado
3. [ ] Verificar se o contador da coluna mostra "1"

## 5. Edição de Cards (Modal)

### ✅ Abrir Modal
1. [ ] Clicar em qualquer card
2. [ ] Verificar se o modal abre com animação suave
3. [ ] Verificar se o backdrop (fundo escuro) aparece

### ✅ Editar Título
1. [ ] No modal, clicar no campo "Título"
2. [ ] Alterar o texto para "Título Editado"
3. [ ] Verificar se o botão "Salvar" aparece
4. [ ] Clicar em "Salvar alterações"
5. [ ] Fechar o modal
6. [ ] Verificar se o título foi atualizado no card

### ✅ Editar Descrição
1. [ ] Abrir o modal de um card
2. [ ] Clicar no campo "Descrição"
3. [ ] Digitar ou editar a descrição
4. [ ] Salvar as alterações
5. [ ] Reabrir o card
6. [ ] Verificar se a descrição foi salva

### ✅ Adicionar/Remover Tags
1. [ ] No modal, clicar em "Adicionar tag"
2. [ ] Verificar se o menu de tags aparece
3. [ ] Clicar em uma tag (ex: "Urgente")
4. [ ] Verificar se a tag aparece no card
5. [ ] Clicar novamente na mesma tag
6. [ ] Verificar se a tag é removida
7. [ ] Adicionar múltiplas tags
8. [ ] Salvar e verificar no card

### ✅ Atribuir Membros
1. [ ] No modal, clicar em "Adicionar membro"
2. [ ] Verificar se a lista de membros aparece
3. [ ] Clicar em um membro (ex: "João Silva")
4. [ ] Verificar se o membro aparece na lista de atribuídos
5. [ ] Verificar se o avatar aparece
6. [ ] Adicionar mais membros
7. [ ] Clicar no X para remover um membro
8. [ ] Salvar e verificar os avatares no card

### ✅ Definir Data de Vencimento
1. [ ] No modal, clicar no campo de data
2. [ ] Selecionar uma data futura
3. [ ] Salvar as alterações
4. [ ] Verificar se a data aparece no card
5. [ ] Editar para uma data passada
6. [ ] Verificar se o card mostra a data em vermelho

### ✅ Definir Prioridade
1. [ ] No modal, clicar em "Prioridade"
2. [ ] Verificar se as 3 opções aparecem (Baixa, Média, Alta)
3. [ ] Selecionar "Alta"
4. [ ] Verificar se o ícone de alerta vermelho aparece
5. [ ] Salvar e verificar no card
6. [ ] Testar com outras prioridades

### ✅ Salvar Alterações
1. [ ] Fazer múltiplas alterações no card
2. [ ] Verificar se o botão "Salvar" aparece automaticamente
3. [ ] Clicar em "Salvar alterações"
4. [ ] Verificar se as mudanças foram aplicadas
5. [ ] Reabrir o card
6. [ ] Confirmar que tudo foi salvo

### ✅ Cancelar Alterações
1. [ ] Abrir um card
2. [ ] Fazer algumas alterações
3. [ ] Clicar em "Fechar" sem salvar
4. [ ] Reabrir o card
5. [ ] Verificar se as alterações não foram salvas

### ✅ Excluir Card
1. [ ] Abrir o modal de um card
2. [ ] Clicar em "Excluir card" (botão vermelho no rodapé)
3. [ ] Verificar se o card foi removido
4. [ ] Verificar se o contador da coluna diminuiu
5. [ ] Verificar se o modal fechou automaticamente

## 6. Interface e UX

### ✅ Animações
- [ ] Verificar animação ao abrir o modal (fade + scale)
- [ ] Verificar animação ao fechar o modal
- [ ] Verificar animação ao adicionar card (slide up)
- [ ] Verificar animação ao adicionar coluna
- [ ] Verificar hover nos cards (scale up)
- [ ] Verificar transições suaves em todos os botões

### ✅ Responsividade
1. [ ] Redimensionar a janela do navegador
2. [ ] Verificar se o layout se adapta
3. [ ] Testar em diferentes tamanhos:
   - Desktop (1920x1080)
   - Laptop (1366x768)
   - Tablet (768x1024)
   - Mobile (375x667)

### ✅ Scroll
- [ ] Verificar scroll horizontal no board (se houver muitas colunas)
- [ ] Verificar scroll vertical nas colunas (se houver muitos cards)
- [ ] Verificar scroll no modal (se houver muito conteúdo)
- [ ] Verificar se o scroll é suave

### ✅ Feedback Visual
- [ ] Hover nos cards (sombra aumenta)
- [ ] Hover nos botões (cor muda)
- [ ] Indicador de drag (linha azul)
- [ ] Botão "Salvar" aparece quando há mudanças
- [ ] Cores das tags são distintas
- [ ] Ícones de prioridade são claros

## 7. Dados de Exemplo

### ✅ Verificar Cards Pré-existentes
- [ ] Coluna "Leads" tem 3 cards
- [ ] Coluna "Dimensionamento" tem 2 cards
- [ ] Coluna "Proposta" tem 2 cards
- [ ] Coluna "Negociação" tem 2 cards
- [ ] Coluna "Instalação" tem 2 cards
- [ ] Coluna "Concluído" tem 2 cards
- [ ] Total de 13 cards

### ✅ Verificar Membros
- [ ] 7 membros disponíveis
- [ ] Avatares com iniciais corretas
- [ ] Nomes e emails corretos

### ✅ Verificar Tags
- [ ] 10 tags disponíveis
- [ ] Cores distintas para cada tag
- [ ] Tags aplicadas corretamente nos cards

## 8. Edge Cases

### ✅ Limites e Validações
- [ ] Tentar adicionar coluna com nome vazio (deve ignorar)
- [ ] Tentar adicionar card com título vazio (deve ignorar)
- [ ] Arrastar card para a mesma posição (não deve fazer nada)
- [ ] Clicar rapidamente múltiplas vezes (não deve duplicar)

### ✅ Múltiplas Ações
1. [ ] Adicionar 5 cards rapidamente
2. [ ] Mover múltiplos cards entre colunas
3. [ ] Editar vários cards em sequência
4. [ ] Adicionar e remover tags rapidamente

### ✅ Dados Complexos
- [ ] Card com todas as tags
- [ ] Card com todos os membros
- [ ] Card com descrição muito longa
- [ ] Card com título muito longo

## 9. Performance

### ✅ Velocidade
- [ ] Modal abre instantaneamente
- [ ] Drag and drop é fluido
- [ ] Animações não travam
- [ ] Não há lag ao adicionar cards
- [ ] Scroll é suave

### ✅ Memória
- [ ] Abrir e fechar modal 10 vezes (não deve travar)
- [ ] Adicionar 20 cards (deve funcionar normalmente)
- [ ] Mover cards 50 vezes (deve continuar fluido)

## 10. Compatibilidade

### ✅ Navegadores
Testar em:
- [ ] Chrome (versão mais recente)
- [ ] Firefox (versão mais recente)
- [ ] Safari (versão mais recente)
- [ ] Edge (versão mais recente)

### ✅ Sistemas Operacionais
- [ ] Windows
- [ ] macOS
- [ ] Linux

## Relatório de Bugs

Se encontrar algum problema, documente:

```markdown
### Bug: [Título do Bug]

**Descrição**: O que aconteceu?

**Passos para Reproduzir**:
1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado**: O que deveria acontecer?

**Comportamento Atual**: O que realmente aconteceu?

**Ambiente**:
- Navegador: Chrome 120
- SO: Windows 11
- Resolução: 1920x1080

**Screenshots**: (se aplicável)

**Prioridade**: Alta / Média / Baixa
```

## Checklist Final

Antes de considerar os testes completos:

- [ ] Todos os itens de "Navegação Básica" passaram
- [ ] Todos os itens de "Gestão de Colunas" passaram
- [ ] Todos os itens de "Gestão de Cards" passaram
- [ ] Todos os itens de "Drag and Drop" passaram
- [ ] Todos os itens de "Edição de Cards" passaram
- [ ] Todos os itens de "Interface e UX" passaram
- [ ] Todos os itens de "Dados de Exemplo" passaram
- [ ] Todos os itens de "Edge Cases" passaram
- [ ] Todos os itens de "Performance" passaram
- [ ] Todos os itens de "Compatibilidade" passaram

## Resultado dos Testes

**Data**: ___/___/______  
**Testador**: _________________  
**Versão**: 0.1.0

**Resumo**:
- Total de testes: ___
- Testes passados: ___
- Testes falhos: ___
- Bugs encontrados: ___

**Status Geral**: ✅ Aprovado / ⚠️ Aprovado com ressalvas / ❌ Reprovado

**Observações**:
_______________________________________
_______________________________________
_______________________________________

---

**Próxima revisão**: Após implementação da Fase 2
