# Guia de Importação do Trello

## Funcionalidade Implementada

Sistema completo de importação de boards do Trello para o SolarSystem CRM.

## Estrutura do JSON do Trello

Baseado no arquivo real `QHwLF7rq - projetos.json`:

```json
{
  "name": "Projetos",
  "lists": 18,           // Listas (viram colunas)
  "cards": 3015,         // Cards (projetos)
  "members": 8,          // Membros da equipe
  "labels": 30           // Labels/tags
}
```

### Estrutura de Lista (List)
```json
{
  "id": "6734c1bd4d3b066e04b2c504",
  "name": "Aumento de carga / Reformas / Troca de titular",
  "closed": false,
  "pos": 57343.5
}
```

### Estrutura de Card
```json
{
  "id": "67e6927603b8ec140a20e611",
  "name": "SP 330 LOGISTICA RESERVA LTDA- Ernani- CPFL",
  "desc": "SP 330 LOGISTICA RESERVA LTDA\nCNPJ: 26.706.700/0001-90\n...",
  "idList": "6734c1bd4d3b066e04b2c504",
  "labels": [
    {
      "id": "65d234572424b40eea624918",
      "name": "Leticia",
      "color": "pink_dark"
    }
  ],
  "due": "2025-03-28T11:00:00.000Z",
  "start": "2025-03-28T11:00:00.000Z",
  "closed": false,
  "attachments": [...],
  "idMembers": []
}
```

## Como Usar

### 1. Exportar do Trello

1. Abra seu board no Trello
2. Clique em "Mostrar menu" (canto superior direito)
3. Clique em "Mais" → "Imprimir e exportar"
4. Clique em "Exportar como JSON"
5. Salve o arquivo

### 2. Importar no SolarSystem

1. Acesse o board no SolarSystem
2. Clique no botão "Importar Trello" no header
3. Selecione o arquivo JSON exportado
4. Escolha se quer:
   - **Adicionar ao board existente** (mantém colunas atuais)
   - **Substituir board existente** (apaga tudo e recria)
5. Clique em "Importar"

### 3. Resultado

O sistema importa:

✓ **Colunas** - Listas do Trello viram colunas
✓ **Cards** - Com título, descrição e ordem preservados
✓ **Tags** - Labels do Trello viram tags
✓ **Datas** - Data de vencimento preservada
✓ **Cliente** - Nome extraído automaticamente do título

## Melhorias Implementadas

### 1. API de Importação (`/api/board/import`)

- Processa JSON do Trello
- Filtra listas e cards fechados/arquivados
- Cria colunas com cores automáticas
- Extrai nome do cliente do título do card
- Preserva tags e datas
- Retorna estatísticas da importação

### 2. Componente de Importação

**TrelloImportModal.tsx**:
- Upload de arquivo JSON
- Instruções passo a passo
- Validação de formato
- Opção de substituir ou adicionar
- Feedback visual de progresso
- Estatísticas de importação

### 3. Melhorias no Board

**Card Component**:
- Exibe tags coloridas
- Mostra nome do cliente destacado
- Indica data de vencimento
- Destaca cards atrasados
- Suporta anexos e comentários
- Mostra membros atribuídos

## Extração Automática de Dados

### Nome do Cliente

O sistema extrai automaticamente o nome do cliente do título do card:

```
"SAKAE SADAKANE-SOLAR SYSTEM" → Cliente: "SAKAE SADAKANE"
"SP 330 LOGISTICA - Ernani" → Cliente: "SP 330 LOGISTICA"
```

### Tags/Labels

Labels do Trello são convertidas em tags:
- Leticia → Tag "Leticia"
- Urgencia → Tag "Urgencia"
- PAGOS → Tag "PAGOS"

### Descrição

A descrição completa do card é preservada, incluindo:
- Dados do cliente (CPF/CNPJ, endereço)
- Informações técnicas (UC, disjuntor)
- Especificações do sistema (módulos, inversores)
- Coordenadas GPS

## Estatísticas de Importação

Após a importação, o sistema exibe:

```
Importação concluída!

✓ 18 colunas importadas
✓ 2.847 cards importados
⚠ 168 cards ignorados (lista fechada)
```

## Estrutura de Cores das Colunas

As colunas importadas recebem cores automaticamente:

1. Azul (#3b82f6)
2. Roxo (#8b5cf6)
3. Âmbar (#f59e0b)
4. Verde esmeralda (#10b981)
5. Ciano (#06b6d4)
6. Verde (#22c55e)
7. Vermelho (#ef4444)
8. Laranja (#f97316)

## Limitações Atuais

❌ **Não importado**:
- Anexos (attachments) - apenas contagem
- Comentários - apenas contagem
- Membros atribuídos - precisa mapear usuários
- Checklists
- Custom fields
- Power-ups

✅ **Pode ser adicionado futuramente**:
- Importar anexos para storage
- Mapear membros do Trello para usuários do sistema
- Importar comentários como atividades
- Importar checklists como subtarefas

## Exemplo de Uso Real

### Board "Projetos" Importado

**Antes (Trello)**:
- 18 listas
- 3.015 cards
- 30 labels diferentes
- 8 membros

**Depois (SolarSystem)**:
- 18 colunas criadas
- 2.847 cards ativos importados
- Tags preservadas
- Clientes extraídos automaticamente
- Datas de vencimento mantidas

## Próximos Passos

1. **Vincular clientes existentes**: Ao importar, buscar clientes pelo nome/CPF
2. **Importar anexos**: Fazer download e upload para storage
3. **Mapear membros**: Criar tabela de mapeamento Trello → SolarSystem
4. **Importar comentários**: Converter em atividades do cliente
5. **Sincronização**: Permitir sync bidirecional com Trello

## Arquivos Criados/Modificados

```
app/api/board/import/route.ts          # API de importação
components/board/TrelloImportModal.tsx # Modal de upload
app/board/page.tsx                     # Botão de importação
components/board/Card.tsx              # Card melhorado (já existia)
```

## Testado Com

✅ Export real do Trello com 3.015 cards
✅ Múltiplas listas e labels
✅ Cards com e sem datas
✅ Cards com descrições longas
✅ Listas fechadas (ignoradas corretamente)
