# 🗺️ Roadmap - SolarSystem CRM

## Fase 1: Board Trello ✅ CONCLUÍDO

### Funcionalidades Implementadas
- ✅ Drag and drop de cards entre colunas
- ✅ Drag and drop de cards dentro da coluna
- ✅ Modal completo de edição de cards
- ✅ Sistema de tags/labels coloridas
- ✅ Atribuição de múltiplos membros
- ✅ Prioridades (Baixa, Média, Alta)
- ✅ Datas de vencimento
- ✅ Descrições detalhadas
- ✅ Indicadores visuais
- ✅ Animações com Framer Motion
- ✅ Interface responsiva

## Fase 2: Persistência de Dados 🔄 PRÓXIMA

### Backend e Database
- [ ] Configurar banco de dados (PostgreSQL/MongoDB)
- [ ] Criar API REST ou GraphQL
- [ ] Implementar CRUD de boards
- [ ] Implementar CRUD de cards
- [ ] Implementar CRUD de membros
- [ ] Sistema de sincronização em tempo real

### Tecnologias Sugeridas
- **Database**: PostgreSQL com Prisma ORM
- **API**: Next.js API Routes ou tRPC
- **Real-time**: Pusher ou Socket.io
- **Cache**: Redis (opcional)

### Estrutura de Dados
```typescript
// Tabelas principais
- users (id, name, email, password, avatar)
- boards (id, title, userId, createdAt)
- columns (id, boardId, title, position)
- cards (id, columnId, title, description, position)
- card_labels (cardId, label)
- card_assignees (cardId, userId)
- comments (id, cardId, userId, content, createdAt)
- attachments (id, cardId, name, url, size)
```

## Fase 3: Autenticação e Autorização 🔐

### Sistema de Usuários
- [ ] Registro de usuários
- [ ] Login/Logout
- [ ] Recuperação de senha
- [ ] Perfil de usuário
- [ ] Upload de avatar

### Permissões
- [ ] Proprietário do board
- [ ] Membros do board
- [ ] Permissões por membro (admin, editor, viewer)
- [ ] Boards públicos vs privados

### Tecnologias Sugeridas
- **Auth**: NextAuth.js ou Clerk
- **Validação**: Zod
- **Segurança**: bcrypt, JWT

## Fase 4: Funcionalidades Avançadas do Board 📋

### Comentários
- [ ] Adicionar comentários nos cards
- [ ] Mencionar membros (@usuario)
- [ ] Editar/excluir comentários
- [ ] Notificações de menções

### Anexos
- [ ] Upload de arquivos
- [ ] Preview de imagens
- [ ] Download de documentos
- [ ] Limite de tamanho por arquivo

### Checklists
- [ ] Criar checklists dentro dos cards
- [ ] Marcar itens como concluídos
- [ ] Progresso visual (3/5 itens)
- [ ] Reordenar itens

### Histórico de Atividades
- [ ] Log de todas as ações
- [ ] Quem fez o quê e quando
- [ ] Filtrar por tipo de ação
- [ ] Desfazer ações (undo)

### Filtros e Busca
- [ ] Buscar cards por título
- [ ] Filtrar por membro
- [ ] Filtrar por tag
- [ ] Filtrar por data de vencimento
- [ ] Filtrar por prioridade
- [ ] Salvar filtros favoritos

## Fase 5: Dimensionamento Fotovoltaico ☀️

### Calculadora de Sistema
- [ ] Input de consumo mensal (kWh)
- [ ] Cálculo de potência necessária
- [ ] Seleção de tipo de sistema (on-grid, off-grid, híbrido)
- [ ] Cálculo de número de painéis
- [ ] Dimensionamento de inversor
- [ ] Cálculo de baterias (para híbrido/off-grid)

### Banco de Dados de Equipamentos
- [ ] Catálogo de painéis solares
- [ ] Catálogo de inversores
- [ ] Catálogo de baterias
- [ ] Preços atualizados
- [ ] Especificações técnicas

### Relatório Técnico
- [ ] Geração de PDF com dimensionamento
- [ ] Gráficos de geração estimada
- [ ] Análise de viabilidade
- [ ] Tempo de retorno (payback)

## Fase 6: Propostas Comerciais 💰

### Gerador de Propostas
- [ ] Template de proposta personalizável
- [ ] Cálculo automático de valores
- [ ] Múltiplos cenários (à vista, parcelado)
- [ ] Inclusão de garantias
- [ ] Termos e condições

### Gestão Financeira
- [ ] Tabela de preços
- [ ] Margens de lucro
- [ ] Descontos e promoções
- [ ] Formas de pagamento
- [ ] Integração com financeiras

### Envio de Propostas
- [ ] Envio por email
- [ ] Link para visualização online
- [ ] Assinatura digital
- [ ] Acompanhamento de visualizações

## Fase 7: Dashboards e Métricas 📊

### Dashboard de Vendas
- [ ] Total de leads
- [ ] Taxa de conversão por etapa
- [ ] Valor total em negociação
- [ ] Projetos concluídos no mês
- [ ] Receita gerada

### Dashboard de Equipe
- [ ] Produtividade por membro
- [ ] Cards por pessoa
- [ ] Tempo médio por etapa
- [ ] Projetos atrasados

### Relatórios
- [ ] Relatório mensal de vendas
- [ ] Relatório de performance
- [ ] Exportação para Excel/PDF
- [ ] Agendamento de relatórios

### Integração PowerBI
- [ ] Conexão com PowerBI
- [ ] Dashboards customizados
- [ ] Análises avançadas

## Fase 8: Automações ⚙️

### Regras de Automação
- [ ] Mover card automaticamente
- [ ] Atribuir membro automaticamente
- [ ] Adicionar tag automaticamente
- [ ] Enviar notificação
- [ ] Criar card automaticamente

### Gatilhos
- [ ] Quando card é criado
- [ ] Quando card muda de coluna
- [ ] Quando data de vencimento se aproxima
- [ ] Quando card é atribuído
- [ ] Quando comentário é adicionado

### Ações
- [ ] Mover para coluna X
- [ ] Atribuir para membro Y
- [ ] Adicionar tag Z
- [ ] Enviar email
- [ ] Criar notificação
- [ ] Webhook para sistemas externos

## Fase 9: Integrações 🔗

### CRM e Marketing
- [ ] RD Station
- [ ] HubSpot
- [ ] Pipedrive
- [ ] ActiveCampaign

### Anúncios
- [ ] Meta Ads (Facebook/Instagram)
- [ ] Google Ads
- [ ] Importação automática de leads

### Automação
- [ ] Zapier
- [ ] Make (Integromat)
- [ ] n8n

### Comunicação
- [ ] WhatsApp Business API
- [ ] Email (SendGrid, Mailgun)
- [ ] SMS

### Documentos
- [ ] ClickSign (assinatura eletrônica)
- [ ] Google Drive
- [ ] Dropbox

## Fase 10: Mobile e Offline 📱

### Aplicativo Mobile
- [ ] React Native ou Flutter
- [ ] Visualização de boards
- [ ] Edição de cards
- [ ] Notificações push
- [ ] Câmera para anexos

### Modo Offline
- [ ] Cache local
- [ ] Sincronização automática
- [ ] Indicador de status de conexão
- [ ] Resolução de conflitos

## Fase 11: Recursos Avançados 🚀

### Templates
- [ ] Templates de boards
- [ ] Templates de cards
- [ ] Biblioteca de templates
- [ ] Compartilhamento de templates

### Múltiplos Boards
- [ ] Criar vários boards
- [ ] Alternar entre boards
- [ ] Copiar/mover cards entre boards
- [ ] Visão geral de todos os boards

### Campos Customizados
- [ ] Adicionar campos personalizados
- [ ] Tipos: texto, número, data, seleção
- [ ] Validação de campos
- [ ] Campos obrigatórios

### Calendário
- [ ] Visualização em calendário
- [ ] Cards por data de vencimento
- [ ] Arrastar para mudar data
- [ ] Integração com Google Calendar

### Gantt Chart
- [ ] Visualização em linha do tempo
- [ ] Dependências entre cards
- [ ] Caminho crítico
- [ ] Exportar para MS Project

## Fase 12: Marketplace e Documentos 📄

### Marketplace Integrado
- [ ] Catálogo de distribuidores
- [ ] Comparação de preços
- [ ] Pedidos diretos
- [ ] Rastreamento de entregas

### Gestão de Documentos
- [ ] Biblioteca de documentos
- [ ] Versionamento
- [ ] Assinatura eletrônica
- [ ] Contratos e termos

### Checklists Inteligentes
- [ ] Checklists por tipo de projeto
- [ ] Validação de dados
- [ ] Campos obrigatórios
- [ ] Aprovações em etapas

## Cronograma Estimado

| Fase | Descrição | Duração Estimada | Status |
|------|-----------|------------------|--------|
| 1 | Board Trello | 2 semanas | ✅ Concluído |
| 2 | Persistência de Dados | 2 semanas | 🔄 Próxima |
| 3 | Autenticação | 1 semana | ⏳ Pendente |
| 4 | Funcionalidades Avançadas | 3 semanas | ⏳ Pendente |
| 5 | Dimensionamento | 2 semanas | ⏳ Pendente |
| 6 | Propostas | 2 semanas | ⏳ Pendente |
| 7 | Dashboards | 2 semanas | ⏳ Pendente |
| 8 | Automações | 2 semanas | ⏳ Pendente |
| 9 | Integrações | 3 semanas | ⏳ Pendente |
| 10 | Mobile | 4 semanas | ⏳ Pendente |
| 11 | Recursos Avançados | 3 semanas | ⏳ Pendente |
| 12 | Marketplace | 2 semanas | ⏳ Pendente |

**Total Estimado**: ~6 meses de desenvolvimento

## Priorização

### Must Have (Essencial)
1. ✅ Board Trello funcional
2. Persistência de dados
3. Autenticação de usuários
4. Dimensionamento fotovoltaico
5. Geração de propostas

### Should Have (Importante)
6. Dashboards e métricas
7. Comentários e anexos
8. Filtros e busca
9. Automações básicas
10. Integração WhatsApp

### Could Have (Desejável)
11. Templates
12. Múltiplos boards
13. Campos customizados
14. Integrações avançadas
15. Aplicativo mobile

### Won't Have (Futuro)
16. Gantt Chart
17. Marketplace completo
18. IA para recomendações
19. Análise preditiva
20. Blockchain para contratos

## Contribuindo

Para contribuir com o desenvolvimento:

1. Escolha uma funcionalidade da fase atual
2. Crie uma branch: `git checkout -b feature/nome-da-feature`
3. Desenvolva e teste
4. Faça commit: `git commit -m "feat: adiciona funcionalidade X"`
5. Push: `git push origin feature/nome-da-feature`
6. Abra um Pull Request

## Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## Notas

- Este roadmap é flexível e pode ser ajustado conforme necessário
- Prioridades podem mudar baseado em feedback dos usuários
- Algumas funcionalidades podem ser desenvolvidas em paralelo
- Estimativas de tempo são aproximadas

---

**Última atualização**: Maio 2026
**Versão atual**: 0.1.0 (Fase 1 concluída)
