# 📋 Guia do Sistema de Histórico de Clientes

## Visão Geral

O sistema de histórico de clientes registra **automaticamente** todas as ações importantes e permite que usuários adicionem atividades manualmente.

---

## Como Funciona

### 1. Histórico Automático ✨

O sistema registra automaticamente:

#### 🔄 Mudança de Status
Quando você altera o status do cliente (ex: de "Lead" para "Em Contato"), o sistema cria automaticamente uma entrada no histórico:

```
🔄 Status alterado de "Lead" para "Em Contato"
Carlos Silva • 4 de mai, 14:30
```

**Como fazer:**
1. Abra a página de detalhes do cliente
2. Clique em "Editar"
3. Altere o status no dropdown
4. Clique em "Salvar"
5. ✅ Histórico criado automaticamente!

#### ✨ Cliente Criado
Quando um novo cliente é cadastrado:

```
✨ Cliente criado
Carlos Silva • 4 de mai, 10:00
```

---

### 2. Histórico Manual 📝

Você pode adicionar atividades manualmente para registrar interações:

#### Tipos de Atividades Disponíveis:

| Ícone | Tipo | Quando Usar |
|-------|------|-------------|
| 📞 | Ligação | Após fazer uma ligação telefônica |
| 📧 | Email | Quando enviar um email |
| 💬 | WhatsApp | Após conversa no WhatsApp |
| 🤝 | Reunião | Após reunião presencial ou online |
| 📄 | Proposta Enviada | Quando enviar proposta comercial |
| 📝 | Contrato Assinado | Quando cliente assinar contrato |
| 📊 | Dimensionamento | Após fazer dimensionamento do sistema |
| 🏗️ | Instalação | Durante/após instalação |
| ✅ | Vistoria | Após vistoria técnica |
| 💰 | Pagamento | Quando receber pagamento |
| 📌 | Observação | Qualquer outra anotação |

#### Como Adicionar Atividade Manual:

1. Abra a página de detalhes do cliente
2. Na seção "Histórico de Atividades", clique em **"+ Adicionar"**
3. Selecione o tipo de atividade
4. Escreva a descrição (ex: "Cliente solicitou proposta com 3 opções de financiamento")
5. Clique em "Adicionar Atividade"
6. ✅ Atividade registrada!

---

## Fluxo Completo de Exemplo

### Cenário: Novo Lead até Venda Fechada

#### 1. Cadastro do Cliente
```
✨ Cliente criado
Carlos Silva • 1 de mai, 10:00
```
**Automático** - Gerado ao cadastrar

---

#### 2. Primeira Ligação
```
📞 Ligação telefônica realizada. Cliente demonstrou interesse em sistema de 5kWp.
Carlos Silva • 1 de mai, 11:30
```
**Manual** - Você adiciona após a ligação

---

#### 3. Mudança de Status: Lead → Em Contato
```
🔄 Status alterado de "Lead" para "Em Contato"
Carlos Silva • 1 de mai, 11:35
```
**Automático** - Gerado ao salvar a edição

---

#### 4. Reunião Agendada
```
🤝 Reunião agendada para 3 de maio às 14h. Cliente quer ver exemplos de instalações.
Carlos Silva • 1 de mai, 15:00
```
**Manual** - Você adiciona

---

#### 5. Reunião Realizada
```
🤝 Reunião realizada. Cliente aprovou o projeto e solicitou proposta formal.
Carlos Silva • 3 de mai, 15:30
```
**Manual** - Você adiciona após a reunião

---

#### 6. Mudança de Status: Em Contato → Qualificado
```
🔄 Status alterado de "Em Contato" para "Qualificado"
Carlos Silva • 3 de mai, 15:35
```
**Automático** - Gerado ao salvar

---

#### 7. Dimensionamento
```
📊 Dimensionamento realizado: Sistema de 5kWp com 12 módulos de 450W.
Ana Santos • 4 de mai, 10:00
```
**Manual** - Engenheiro adiciona

---

#### 8. Proposta Enviada
```
📄 Proposta comercial enviada por email com 3 opções de pagamento.
Carlos Silva • 4 de mai, 14:00
```
**Manual** - Você adiciona

---

#### 9. Mudança de Status: Qualificado → Proposta
```
🔄 Status alterado de "Qualificado" para "Proposta Enviada"
Carlos Silva • 4 de mai, 14:05
```
**Automático** - Gerado ao salvar

---

#### 10. Negociação
```
💬 Cliente solicitou desconto via WhatsApp. Negociando valor final.
Carlos Silva • 5 de mai, 09:00
```
**Manual** - Você adiciona

---

#### 11. Mudança de Status: Proposta → Negociação
```
🔄 Status alterado de "Proposta Enviada" para "Em Negociação"
Carlos Silva • 5 de mai, 09:05
```
**Automático** - Gerado ao salvar

---

#### 12. Contrato Assinado
```
📝 Contrato assinado! Valor fechado: R$ 24.500,00 em 12x.
Carlos Silva • 6 de mai, 16:00
```
**Manual** - Você adiciona

---

#### 13. Mudança de Status: Negociação → Cliente
```
🔄 Status alterado de "Em Negociação" para "Cliente (Venda Fechada)"
Carlos Silva • 6 de mai, 16:05
```
**Automático** - Gerado ao salvar

---

#### 14. Pagamento Recebido
```
💰 Primeira parcela recebida: R$ 2.041,67
Financeiro • 10 de mai, 10:00
```
**Manual** - Financeiro adiciona

---

#### 15. Instalação
```
🏗️ Instalação iniciada. Previsão de conclusão: 2 dias.
João Instalador • 15 de mai, 08:00
```
**Manual** - Instalador adiciona

---

#### 16. Vistoria
```
✅ Vistoria realizada. Sistema aprovado e conectado à rede.
Engenheiro • 17 de mai, 14:00
```
**Manual** - Engenheiro adiciona

---

## Boas Práticas

### ✅ Faça

1. **Registre todas as interações importantes**
   - Ligações, emails, reuniões, WhatsApp
   
2. **Seja específico nas descrições**
   - ❌ "Ligação feita"
   - ✅ "Ligação realizada. Cliente solicitou proposta com 3 opções de financiamento"

3. **Registre imediatamente após a ação**
   - Não deixe para depois, você pode esquecer detalhes

4. **Use o tipo correto de atividade**
   - Facilita filtros e relatórios futuros

5. **Inclua informações relevantes**
   - Valores discutidos
   - Prazos acordados
   - Próximos passos

### ❌ Não Faça

1. **Não registre manualmente mudanças de status**
   - O sistema já faz isso automaticamente

2. **Não use descrições genéricas**
   - "Contato feito" não ajuda ninguém

3. **Não esqueça de registrar interações**
   - Histórico incompleto = perda de informação

---

## Benefícios do Histórico

### 1. 📊 Rastreabilidade Total
- Veja todo o caminho do cliente desde o primeiro contato
- Identifique em que etapa o cliente está
- Saiba quem fez cada ação

### 2. 🤝 Colaboração em Equipe
- Qualquer membro da equipe pode ver o histórico
- Evita perguntas repetidas ao cliente
- Facilita passagem de bastão entre vendedores

### 3. 📈 Análise de Performance
- Quanto tempo leva cada etapa?
- Quantas interações até fechar venda?
- Quais ações geram mais conversão?

### 4. 🎯 Melhor Atendimento
- Contexto completo antes de contatar cliente
- Não repete perguntas já feitas
- Demonstra profissionalismo

### 5. 📝 Documentação Legal
- Registro de todas as tratativas
- Prova de acordos verbais
- Histórico para auditoria

---

## Perguntas Frequentes

### P: Posso editar ou excluir atividades?
**R:** Atualmente não. O histórico é imutável para garantir integridade. Em versões futuras, ADMIN poderá editar.

### P: Quem pode ver o histórico?
**R:** Todos os membros da empresa podem ver o histórico de todos os clientes da empresa.

### P: O histórico é compartilhado entre empresas?
**R:** Não. Cada empresa vê apenas o histórico dos seus próprios clientes.

### P: Posso exportar o histórico?
**R:** Funcionalidade planejada para versão futura.

### P: Há limite de atividades?
**R:** Não há limite. Registre quantas atividades precisar.

### P: As atividades aparecem em ordem?
**R:** Sim, sempre da mais recente para a mais antiga.

---

## Próximas Funcionalidades

### 🔜 Em Desenvolvimento

- [ ] **Filtros de histórico** - Filtrar por tipo de atividade, período, usuário
- [ ] **Anexos** - Adicionar arquivos às atividades (propostas, contratos, fotos)
- [ ] **Menções** - Mencionar outros usuários (@usuario)
- [ ] **Notificações** - Receber notificação quando alguém adiciona atividade
- [ ] **Exportar histórico** - Exportar para PDF ou Excel
- [ ] **Histórico automático de emails** - Integração com email
- [ ] **Histórico automático de WhatsApp** - Integração com WhatsApp Business API
- [ ] **Lembretes** - Criar lembretes baseados em atividades
- [ ] **Templates de atividades** - Criar templates para atividades recorrentes

---

## Resumo

| Tipo | Como Funciona | Exemplos |
|------|---------------|----------|
| **Automático** | Sistema registra sozinho | Mudança de status, criação de cliente |
| **Manual** | Você adiciona clicando em "+ Adicionar" | Ligações, emails, reuniões, observações |

**Regra de Ouro:** Se você interagiu com o cliente, registre no histórico! 📝

---

**Última atualização**: Maio 2026  
**Versão**: 1.0.0
