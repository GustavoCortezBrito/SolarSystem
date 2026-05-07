# 💰 Guia do Sistema de Valores de Clientes

## Visão Geral

O sistema de valores permite acompanhar a evolução financeira do cliente ao longo do funil de vendas, desde a estimativa inicial até o valor final fechado.

---

## 3 Tipos de Valores

### 1. 💡 Valor Estimado
**Quando usar**: Logo no início, quando você faz a primeira análise do cliente.

**Descrição**: É o valor inicial calculado baseado nas necessidades do cliente (consumo, tipo de sistema, etc).

**Exemplo**:
- Cliente consome 350 kWh/mês
- Sistema estimado: 5 kWp
- Valor estimado: R$ 25.000

**Cor**: Cinza (neutro)

---

### 2. 📄 Valor da Proposta
**Quando usar**: Quando você envia a proposta comercial formal.

**Descrição**: É o valor que você oferece na proposta. Pode ser diferente do estimado (desconto, ajustes, etc).

**Exemplo**:
- Valor estimado era: R$ 25.000
- Após negociação inicial: R$ 24.500
- Valor da proposta: R$ 24.500

**Cor**: Azul (primary) - Destaque para valor em negociação

---

### 3. ✅ Valor Fechado
**Quando usar**: Quando o cliente assina o contrato e fecha o negócio.

**Descrição**: É o valor final acordado. Pode ser diferente da proposta (descontos finais, ajustes).

**Exemplo**:
- Valor da proposta era: R$ 24.500
- Cliente pediu desconto final
- Valor fechado: R$ 24.000

**Cor**: Verde - Sucesso! Venda fechada 🎉

---

## Fluxo Completo de Valores

### Cenário Real: Cliente João Silva

#### 1️⃣ Lead (Primeiro Contato)
```
Status: LEAD
Valor Estimado: R$ 25.000
Valor Proposta: -
Valor Fechado: -
```
**Ação**: Você fez uma estimativa rápida baseada no consumo informado.

---

#### 2️⃣ Qualificado (Após Reunião)
```
Status: QUALIFICADO
Valor Estimado: R$ 25.000
Valor Proposta: -
Valor Fechado: -
```
**Ação**: Cliente qualificado, mantém estimativa inicial.

---

#### 3️⃣ Proposta Enviada
```
Status: PROPOSTA
Valor Estimado: R$ 25.000
Valor Proposta: R$ 24.500 ✨ (novo!)
Valor Fechado: -
```
**Ação**: Você enviou proposta com pequeno desconto para fechar mais rápido.

---

#### 4️⃣ Em Negociação
```
Status: NEGOCIAÇÃO
Valor Estimado: R$ 25.000
Valor Proposta: R$ 24.500
Valor Fechado: -
```
**Ação**: Cliente está negociando, valores mantidos.

---

#### 5️⃣ Venda Fechada! 🎉
```
Status: CLIENTE (WON)
Valor Estimado: R$ 25.000
Valor Proposta: R$ 24.500
Valor Fechado: R$ 24.000 ✅ (novo!)
```
**Ação**: Cliente aceitou com desconto adicional de R$ 500. Negócio fechado!

---

## Como Editar os Valores

### Passo a Passo:

1. **Abrir página de detalhes do cliente**
   - Ir para `/clients`
   - Clicar em "Ver Detalhes" no cliente

2. **Entrar em modo de edição**
   - Clicar no botão "Editar" (canto superior direito)

3. **Editar valores na sidebar direita**
   - Seção "💰 Valores"
   - Campos aparecem como inputs editáveis
   - Digite apenas números (ex: 25000 para R$ 25.000)

4. **Salvar alterações**
   - Clicar em "Salvar"
   - Valores atualizados!

### Exemplo Visual:

**Modo Visualização:**
```
💰 Valores

Estimado
R$ 25.000

Proposta
Não definido

Fechado
Não definido
```

**Modo Edição:**
```
💰 Valores

Estimado
R$ [25000]  ← input editável

Proposta
R$ [     ]  ← input vazio

Fechado
R$ [     ]  ← input vazio

💡 Dica: Preencha os valores conforme o cliente 
avança no funil:
• Estimado: Valor inicial calculado
• Proposta: Valor enviado na proposta
• Fechado: Valor final negociado
```

---

## Boas Práticas

### ✅ Faça

1. **Preencha o Valor Estimado logo no início**
   - Mesmo que seja uma estimativa rápida
   - Ajuda a qualificar o lead

2. **Atualize o Valor da Proposta quando enviar**
   - Registre o valor exato da proposta
   - Facilita acompanhamento

3. **Preencha o Valor Fechado imediatamente após fechar**
   - Importante para métricas de vendas
   - Registra o valor real da venda

4. **Mantenha os 3 valores preenchidos após fechar**
   - Permite análise de desconto
   - Mostra evolução da negociação

5. **Use valores realistas**
   - Não infle valores estimados
   - Seja honesto nas propostas

### ❌ Não Faça

1. **Não deixe valores em branco após enviar proposta**
   - Dificulta análise de conversão

2. **Não altere valores históricos sem motivo**
   - Mantém integridade dos dados

3. **Não use valores arredondados demais**
   - R$ 25.000 é ok
   - R$ 25.000,00 é melhor
   - R$ 20.000 (muito arredondado) não é ideal

---

## Análises Possíveis

### 1. Taxa de Conversão de Valor
```
Valor Estimado Total: R$ 100.000
Valor Fechado Total: R$ 85.000
Taxa de Conversão: 85%
```

### 2. Desconto Médio
```
Valor Proposta: R$ 24.500
Valor Fechado: R$ 24.000
Desconto: R$ 500 (2%)
```

### 3. Ticket Médio
```
Total de Vendas Fechadas: R$ 240.000
Número de Clientes: 10
Ticket Médio: R$ 24.000
```

### 4. Funil de Valores
```
Leads (Estimado): R$ 500.000
Propostas: R$ 300.000
Fechados: R$ 150.000
Taxa de Fechamento: 30%
```

---

## Perguntas Frequentes

### P: Posso deixar valores em branco?
**R:** Sim! Os valores são opcionais. Mas recomendamos preencher ao menos o "Estimado" para qualificar o lead.

### P: Posso editar valores após fechar a venda?
**R:** Sim, mas não é recomendado. Altere apenas se houver erro de digitação.

### P: O que acontece se eu mudar o Valor Fechado?
**R:** Nada automático. Mas recomendamos adicionar uma atividade no histórico explicando o motivo.

### P: Os valores geram histórico automático?
**R:** Atualmente não. Planejado para versão futura.

### P: Posso adicionar outros tipos de valores?
**R:** Atualmente não. Mas você pode usar o campo "Observações" para registrar outros valores.

### P: Como funciona com parcelamento?
**R:** O valor fechado é o valor total. Use o campo "Observações" para registrar forma de pagamento.

---

## Exemplos por Tipo de Cliente

### Residencial (5 kWp)
```
Estimado: R$ 25.000
Proposta: R$ 24.500 (desconto de 2%)
Fechado: R$ 24.000 (desconto adicional de 2%)
```

### Comercial (50 kWp)
```
Estimado: R$ 250.000
Proposta: R$ 245.000 (desconto de 2%)
Fechado: R$ 240.000 (desconto adicional de 2%)
```

### Industrial (100 kWp)
```
Estimado: R$ 500.000
Proposta: R$ 480.000 (desconto de 4%)
Fechado: R$ 475.000 (desconto adicional de 1%)
```

### Rural (20 kWp)
```
Estimado: R$ 100.000
Proposta: R$ 95.000 (desconto de 5%)
Fechado: R$ 92.000 (desconto adicional de 3%)
```

---

## Integração com Status

### Recomendação de Preenchimento por Status:

| Status | Estimado | Proposta | Fechado |
|--------|----------|----------|---------|
| **LEAD** | ✅ Preencher | ❌ Vazio | ❌ Vazio |
| **CONTACT** | ✅ Preencher | ❌ Vazio | ❌ Vazio |
| **QUALIFIED** | ✅ Preencher | ❌ Vazio | ❌ Vazio |
| **PROPOSAL** | ✅ Preenchido | ✅ Preencher | ❌ Vazio |
| **NEGOTIATION** | ✅ Preenchido | ✅ Preenchido | ❌ Vazio |
| **WON** | ✅ Preenchido | ✅ Preenchido | ✅ Preencher |
| **LOST** | ✅ Preenchido | ⚠️ Opcional | ❌ Vazio |
| **INACTIVE** | ⚠️ Opcional | ❌ Vazio | ❌ Vazio |

---

## Próximas Funcionalidades

### 🔜 Em Desenvolvimento

- [ ] **Histórico automático de valores** - Registrar quando valores são alterados
- [ ] **Gráfico de evolução** - Visualizar evolução dos valores
- [ ] **Alertas de desconto** - Avisar quando desconto é muito alto
- [ ] **Comparação com mercado** - Comparar valores com média do mercado
- [ ] **Valores por etapa** - Múltiplos valores de proposta
- [ ] **Moedas diferentes** - Suporte a USD, EUR, etc
- [ ] **Impostos e taxas** - Calcular impostos automaticamente
- [ ] **Margem de lucro** - Calcular margem baseada em custos

---

## Resumo Rápido

| Valor | Quando | Cor | Obrigatório |
|-------|--------|-----|-------------|
| **Estimado** | Início (Lead) | Cinza | Recomendado |
| **Proposta** | Ao enviar proposta | Azul | Recomendado |
| **Fechado** | Ao fechar venda | Verde | Obrigatório |

**Regra de Ouro:** Preencha os valores conforme o cliente avança no funil! 💰

---

**Última atualização**: Maio 2026  
**Versão**: 1.0.0
