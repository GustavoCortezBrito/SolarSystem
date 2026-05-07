# Sistema de Propostas - Implementação

## ✅ O que foi implementado

### 1. Tipos e Estrutura de Dados

**Arquivo:** `types/proposal.ts`
- ✅ Interface `Proposal` completa com todos os campos necessários
- ✅ Interface `ProposalSystem` para dados técnicos do sistema
- ✅ Interface `ProposalFinancial` para dados financeiros
- ✅ Interface `ProposalInput` para entrada de dados
- ✅ Enum `ProposalStatus` com 6 status: RASCUNHO, GERADA, ENVIADA, ACEITA, REJEITADA, EXPIRADA

### 2. Dados Mock

**Arquivo:** `lib/mockProposalData.ts`
- ✅ 2 propostas de exemplo (residencial e comercial)
- ✅ Helpers para buscar propostas por empresa, cliente e ID
- ✅ Dados completos incluindo sistema, financeiro e cliente

### 3. Página de Lista de Propostas

**Arquivo:** `app/proposals/page.tsx`
- ✅ Tabela com todas as propostas
- ✅ Filtros por busca (nome/ID) e status
- ✅ Cards de estatísticas (Total, Enviadas, Aceitas, Valor Total)
- ✅ Ações por proposta:
  - Visualizar (Eye)
  - Baixar PDF (Download)
  - Enviar (Send)
  - Duplicar (Copy)
  - Editar (Edit) - apenas rascunhos
  - Excluir (Trash) - apenas rascunhos
- ✅ Status coloridos com badges
- ✅ Formatação de moeda e datas em PT-BR
- ✅ Botão "Nova Proposta" no header

### 4. Página de Gerador de Propostas (Wizard)

**Arquivo:** `app/proposals/new/page.tsx`
- ✅ Wizard com 4 passos:
  1. **Cliente**: Seleção ou cadastro de cliente
  2. **Consumo**: Dados de consumo e conta de energia
  3. **Equipamentos**: (a implementar)
  4. **Valores**: (a implementar)
- ✅ Barra de progresso visual com ícones
- ✅ Navegação entre passos (Anterior/Próximo)
- ✅ Validação de campos obrigatórios
- ✅ Preview de estimativas no passo 2

### 5. Integração com o Sistema

**Arquivo:** `app/board/page.tsx`
- ✅ Link "Propostas" adicionado ao header do board
- ✅ Posicionado entre "Clientes" e "Cadastros"

### 6. Dados da Empresa para Propostas

**Arquivos:** `types/auth.ts` e `lib/mockAuthData.ts`
- ✅ Interface `Company` atualizada com campos:
  - CNPJ, endereço, cidade, estado, CEP
  - Telefone, WhatsApp, email, website
  - Redes sociais (Instagram, Facebook, LinkedIn)
  - Configurações de proposta (validade padrão, rodapé)
- ✅ Dados mock da empresa "Solar Tech Ltda" completos

## 🚧 Próximos Passos

### 1. Completar o Wizard de Propostas

**Passo 3: Equipamentos**
- [ ] Seleção de módulos do catálogo
- [ ] Cálculo automático de quantidade baseado na potência necessária
- [ ] Seleção de inversor compatível
- [ ] Opção de adicionar bateria (opcional)
- [ ] Opção de adicionar otimizadores (opcional)
- [ ] Preview do sistema com imagens dos equipamentos

**Passo 4: Valores**
- [ ] Custo dos equipamentos (calculado automaticamente)
- [ ] Custo de instalação (editável)
- [ ] Custo de projeto (editável)
- [ ] Cálculo automático de:
  - Preço por Wp
  - Economia mensal/anual
  - Payback
  - ROI
- [ ] Configuração de formas de pagamento
- [ ] Validade da proposta (padrão da empresa)
- [ ] Campo de observações

### 2. Preview da Proposta

**Arquivo:** `app/proposals/[id]/page.tsx` (a criar)
- [ ] Visualização completa da proposta
- [ ] Estilo similar ao PDF de exemplo
- [ ] Seções:
  - Cabeçalho com dados do cliente
  - Cards com potência, geração e valor
  - Detalhes do sistema proposto
  - Equipamentos com especificações
  - Análise financeira
  - Formas de pagamento
  - Garantias
  - Termos e condições
- [ ] Botões de ação:
  - Editar
  - Gerar PDF
  - Enviar por email
  - Enviar por WhatsApp
  - Copiar link

### 3. Geração de PDF

**Biblioteca sugerida:** `react-pdf` ou `jspdf`
- [ ] Template baseado no arquivo `2023-06-20_11-43-01_Marcos_Mercado_Sumar_.pdf`
- [ ] Capa com:
  - Logo da empresa
  - "PROPOSTA COMERCIAL"
  - Dados do cliente
  - Data e validade
- [ ] Páginas internas:
  - Resumo executivo
  - Análise de consumo
  - Sistema proposto
  - Equipamentos detalhados
  - Investimento e formas de pagamento
  - Economia estimada
  - Garantias
  - Termos e condições
- [ ] Rodapé com dados da empresa
- [ ] Numeração de páginas

### 4. Funcionalidades Adicionais

**Envio de Propostas**
- [ ] Envio por email com PDF anexo
- [ ] Envio por WhatsApp (integração futura)
- [ ] Geração de link público para visualização
- [ ] Tracking de visualizações

**Gestão de Propostas**
- [ ] Edição de propostas em rascunho
- [ ] Duplicação de propostas
- [ ] Exclusão de propostas
- [ ] Histórico de alterações
- [ ] Comentários internos

**Relatórios**
- [ ] Taxa de conversão (enviadas vs aceitas)
- [ ] Valor médio de propostas
- [ ] Tempo médio de resposta
- [ ] Propostas por vendedor
- [ ] Propostas por período

### 5. Integrações

**Com Clientes**
- [ ] Vincular proposta ao cliente no CRM
- [ ] Adicionar proposta ao histórico do cliente
- [ ] Notificação quando proposta é aceita/rejeitada

**Com Board**
- [ ] Criar card automaticamente quando proposta é aceita
- [ ] Mover card conforme status da proposta

**Com Notificações**
- [ ] Notificar quando proposta expira
- [ ] Notificar quando cliente visualiza proposta
- [ ] Notificar quando proposta é aceita/rejeitada

## 📋 Checklist de Implementação

### Fase 1: Estrutura Básica ✅
- [x] Tipos de dados
- [x] Dados mock
- [x] Página de lista
- [x] Início do wizard
- [x] Link no header

### Fase 2: Wizard Completo 🚧
- [x] Passo 1: Cliente
- [x] Passo 2: Consumo
- [ ] Passo 3: Equipamentos
- [ ] Passo 4: Valores
- [ ] Validações
- [ ] Cálculos automáticos

### Fase 3: Preview e PDF 📝
- [ ] Página de preview
- [ ] Componente de visualização
- [ ] Geração de PDF
- [ ] Download de PDF

### Fase 4: Ações e Envio 📤
- [ ] Envio por email
- [ ] Envio por WhatsApp
- [ ] Link público
- [ ] Tracking

### Fase 5: Gestão Avançada 🔧
- [ ] Edição
- [ ] Duplicação
- [ ] Exclusão
- [ ] Histórico
- [ ] Comentários

### Fase 6: Relatórios e Analytics 📊
- [ ] Dashboard de propostas
- [ ] Métricas de conversão
- [ ] Relatórios por período
- [ ] Relatórios por vendedor

## 🎨 Design e UX

### Cores de Status
- **Rascunho**: Cinza (`bg-gray-100 text-gray-800`)
- **Gerada**: Azul (`bg-blue-100 text-blue-800`)
- **Enviada**: Amarelo (`bg-yellow-100 text-yellow-800`)
- **Aceita**: Verde (`bg-green-100 text-green-800`)
- **Rejeitada**: Vermelho (`bg-red-100 text-red-800`)
- **Expirada**: Cinza claro (`bg-gray-100 text-gray-600`)

### Ícones
- Lista: `FileText`
- Nova: `Plus`
- Visualizar: `Eye`
- Download: `Download`
- Enviar: `Send`
- Duplicar: `Copy`
- Editar: `Edit`
- Excluir: `Trash2`
- Cliente: `User`
- Consumo: `Zap`
- Equipamentos: `FileText`
- Valores: `DollarSign`

## 📝 Notas Técnicas

### Cálculos Automáticos

**Potência Necessária (kWp)**
```
potência = (consumo_mensal * 1.2) / (30 * 5)
// 1.2 = margem de segurança
// 30 = dias do mês
// 5 = horas de sol médias
```

**Geração Mensal (kWh)**
```
geração = potência * 30 * 5 * 0.8
// 0.8 = fator de eficiência
```

**Quantidade de Módulos**
```
quantidade = Math.ceil(potência * 1000 / potência_módulo)
```

**Payback (meses)**
```
payback = investimento_total / economia_mensal
```

**ROI (%)**
```
roi = ((economia_25_anos - investimento_total) / investimento_total) * 100
```

### Validações

- Cliente: nome, telefone, endereço, cidade, estado obrigatórios
- Consumo: valores > 0
- Equipamentos: pelo menos módulo e inversor selecionados
- Valores: custos > 0

### Formatações

- Moeda: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Data: `toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })`
- Potência: `X.X kWp`
- Geração: `XXX kWh/mês`

## 🔗 Arquivos Relacionados

- `types/proposal.ts` - Tipos
- `types/auth.ts` - Tipos da empresa
- `lib/mockProposalData.ts` - Dados mock
- `lib/mockAuthData.ts` - Dados da empresa
- `app/proposals/page.tsx` - Lista
- `app/proposals/new/page.tsx` - Wizard
- `app/board/page.tsx` - Header com link
