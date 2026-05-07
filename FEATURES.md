# 🎯 Funcionalidades do Board - SolarSystem CRM

## 📋 Board Estilo Trello

### Drag and Drop

#### Arrastar Cards entre Colunas
1. **Clique e segure** em qualquer card
2. **Arraste** o card para outra coluna
3. **Solte** o card na posição desejada
4. Um **indicador visual azul** mostra onde o card será posicionado

#### Reordenar Cards na Mesma Coluna
- Arraste cards para cima ou para baixo dentro da mesma coluna
- A posição é atualizada automaticamente

### Gerenciamento de Colunas

#### Adicionar Coluna
1. Clique no botão **"Adicionar coluna"** no final do board
2. Digite o nome da coluna
3. Pressione **Enter** ou clique em **"Adicionar"**

#### Editar Coluna
1. Clique no ícone **⋮** (três pontos) no cabeçalho da coluna
2. Selecione **"Editar título"**
3. Digite o novo nome
4. Pressione **Enter** ou clique fora para salvar

#### Excluir Coluna
1. Clique no ícone **⋮** no cabeçalho da coluna
2. Selecione **"Excluir coluna"**
3. A coluna e todos os cards serão removidos

### Gerenciamento de Cards

#### Adicionar Card
1. Clique em **"Adicionar card"** no final de qualquer coluna
2. Digite o título do card
3. Pressione **Enter** ou clique em **"Adicionar"**

#### Editar Card Completo
1. **Clique em qualquer card** para abrir o modal de edição
2. No modal você pode editar:

##### 📝 Informações Básicas
- **Título**: Nome do card
- **Descrição**: Detalhes completos do projeto/tarefa

##### 🏷️ Tags/Labels
- Clique em **"Adicionar tag"**
- Selecione uma ou mais tags:
  - **Residencial** (verde)
  - **Comercial** (azul)
  - **Industrial** (roxo)
  - **Urgente** (vermelho)
  - **Híbrido** (amarelo)
  - **On-Grid** (ciano)
  - **Off-Grid** (laranja)
  - **Aguardando Cliente** (cinza)
- Clique novamente para remover uma tag

##### 👥 Membros/Responsáveis
- Clique em **"Adicionar membro"**
- Selecione um ou mais membros da equipe
- Cada membro aparece com:
  - Avatar com inicial do nome
  - Nome completo
  - Email
- Clique no **X** para remover um membro

##### 📅 Data de Vencimento
- Clique no campo de data
- Selecione a data desejada
- Cards com data vencida aparecem em **vermelho**

##### ⚠️ Prioridade
- Clique em **"Prioridade"**
- Selecione:
  - **Baixa** (cinza)
  - **Média** (amarelo)
  - **Alta** (vermelho)
- Um ícone de alerta aparece no card com a cor da prioridade

#### Salvar Alterações
- O botão **"Salvar"** aparece automaticamente quando há mudanças
- Clique em **"Salvar alterações"** ou pressione o botão no topo
- As alterações são aplicadas imediatamente

#### Excluir Card
1. Abra o modal de edição do card
2. Clique em **"Excluir card"** no rodapé (vermelho)
3. O card é removido permanentemente

## 🎨 Indicadores Visuais

### No Card (Visualização Compacta)
- **Tags coloridas**: Aparecem no topo do card
- **Ícone de prioridade**: Alerta colorido (⚠️)
- **Data de vencimento**: Calendário com data
  - Vermelho se vencida
  - Cinza se ainda válida
- **Avatares dos membros**: Círculos coloridos com iniciais
  - Mostra até 3 membros
  - "+N" se houver mais membros
- **Contador de comentários**: 💬 (futuro)
- **Contador de anexos**: 📎 (futuro)

### Feedback Visual
- **Hover**: Card aumenta levemente ao passar o mouse
- **Drag**: Indicador azul mostra onde o card será solto
- **Animações**: Transições suaves em todas as ações

## 👥 Membros do Board

### Membros Pré-cadastrados
O board vem com 5 membros de exemplo:
1. João Silva (joao@email.com)
2. Maria Santos (maria@email.com)
3. Pedro Costa (pedro@email.com)
4. Ana Oliveira (ana@email.com)
5. Carlos Souza (carlos@email.com)

### Visualização de Membros
- No cabeçalho do board: **"5 membros"**
- Cada membro tem avatar com inicial do nome
- Cores automáticas para diferenciação

## 📊 Informações do Board

### Cabeçalho
- **Título do Board**: "Projetos Fotovoltaicos"
- **Estatísticas**:
  - Número de colunas
  - Total de cards
  - Número de membros
- **Botões de ação**:
  - Filtros (futuro)
  - Menu de opções

## 🔄 Fluxo de Trabalho Sugerido

### Pipeline de Vendas Solar
1. **Leads**: Novos contatos interessados
2. **Dimensionamento**: Cálculo do sistema
3. **Proposta**: Elaboração da proposta comercial
4. **Negociação**: Discussão de valores e condições
5. **Instalação**: Projeto aprovado em execução
6. **Concluído**: Projeto finalizado

### Uso de Tags
- **Residencial/Comercial/Industrial**: Tipo de cliente
- **Urgente**: Prioridade máxima
- **Híbrido/On-Grid/Off-Grid**: Tipo de sistema
- **Aguardando Cliente**: Bloqueado por resposta

### Uso de Prioridades
- **Alta**: Projetos urgentes ou de alto valor
- **Média**: Fluxo normal de trabalho
- **Baixa**: Projetos de longo prazo

### Atribuição de Membros
- **Vendedor**: Responsável pelo contato inicial
- **Engenheiro**: Responsável pelo dimensionamento
- **Financeiro**: Responsável pela proposta
- **Instalador**: Responsável pela execução

## 🚀 Próximas Funcionalidades

### Em Desenvolvimento
- [ ] Sistema de comentários nos cards
- [ ] Upload de anexos/documentos
- [ ] Histórico de atividades
- [ ] Notificações em tempo real
- [ ] Filtros avançados
- [ ] Busca de cards
- [ ] Exportação de dados
- [ ] Integração com calendário
- [ ] Checklist dentro dos cards
- [ ] Campos customizados

### Planejadas
- [ ] Automações (mover card automaticamente)
- [ ] Templates de cards
- [ ] Relatórios e dashboards
- [ ] Integração com email
- [ ] Aplicativo mobile
- [ ] Modo offline
- [ ] Permissões por membro
- [ ] Múltiplos boards

## 💡 Dicas de Uso

1. **Organize por etapas**: Use as colunas para representar o fluxo do processo
2. **Use tags consistentemente**: Defina padrões para a equipe
3. **Atribua responsáveis**: Deixe claro quem cuida de cada card
4. **Defina prazos**: Use datas de vencimento para controle
5. **Priorize visualmente**: Use o sistema de prioridades
6. **Mantenha atualizado**: Mova os cards conforme o progresso
7. **Descrições detalhadas**: Adicione todas as informações relevantes

## 🎯 Casos de Uso

### Gestão de Projetos Fotovoltaicos
- Acompanhe cada projeto desde o lead até a instalação
- Visualize rapidamente o status de todos os projetos
- Identifique gargalos no processo

### Gestão de Equipe
- Veja quem está responsável por cada projeto
- Distribua a carga de trabalho
- Acompanhe a produtividade

### Controle de Prazos
- Identifique projetos atrasados
- Priorize ações urgentes
- Planeje entregas futuras

### Categorização
- Separe projetos por tipo (residencial, comercial, industrial)
- Identifique tipos de sistema (on-grid, híbrido, off-grid)
- Marque situações especiais (urgente, aguardando cliente)
