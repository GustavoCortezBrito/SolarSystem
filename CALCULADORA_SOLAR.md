# 🌞 Calculadora Solar - Documentação Técnica

## 📋 Visão Geral

A Calculadora Solar é uma ferramenta completa para dimensionamento de sistemas fotovoltaicos, desenvolvida para integrar-se ao SolarSystem CRM. Ela permite calcular com precisão o tamanho do sistema necessário, custos, economia e impacto ambiental.

---

## 🎯 Funcionalidades

### 1. **Tipos de Propriedade**
- ✅ Residencial
- ✅ Comercial
- ✅ Industrial

Cada tipo tem custos de instalação diferentes (R$/kWp):
- Residencial: R$ 4.500/kWp
- Comercial: R$ 4.200/kWp
- Industrial: R$ 4.000/kWp

### 2. **Dados de Consumo**
- **Conta de Luz Mensal (R$)**: Valor atual da conta
- **Consumo Médio (kWh/mês)**: Consumo em quilowatt-hora
- **Tarifa (R$/kWh)**: Preço por kWh cobrado pela concessionária

### 3. **Localização e Irradiação Solar**
Irradiação solar média por região (kWh/m²/dia):
- **3.5**: Região Sul (inverno)
- **4.5**: Região Sul (média anual)
- **5.0**: Região Sudeste
- **5.5**: Região Centro-Oeste
- **6.0**: Região Nordeste
- **6.5**: Região Norte

### 4. **Tipo de Telhado**
- Cerâmico
- Metálico
- Laje de Concreto
- Fibrocimento

### 5. **Configuração do Sistema**
- **Potência do Painel**: 450W, 500W, 550W (recomendado), 600W
- **Tipo de Sistema**:
  - On-Grid (conectado à rede)
  - Off-Grid (isolado)
  - Híbrido
- **Banco de Baterias**: Opcional para sistemas Off-Grid e Híbridos

---

## 🧮 Fórmulas de Cálculo

### 1. Consumo Diário
```
Consumo Diário (kWh/dia) = Consumo Mensal / 30
```

### 2. Potência do Sistema
```
Potência (kWp) = (Consumo Diário / Irradiação Solar) / Eficiência do Sistema

Onde:
- Eficiência do Sistema = 0.80 (80%)
- Perdas consideradas: cabeamento, sujeira, temperatura, inversor
```

### 3. Número de Painéis
```
Número de Painéis = ARREDONDAR_PARA_CIMA(Potência do Sistema / Potência do Painel)

Exemplo:
- Sistema: 5.2 kWp
- Painel: 550Wp (0.55 kWp)
- Painéis = 5.2 / 0.55 = 9.45 → 10 painéis
```

### 4. Geração de Energia
```
Geração Diária (kWh) = Potência Real × Irradiação × Eficiência
Geração Mensal (kWh) = Geração Diária × 30
Geração Anual (kWh) = Geração Diária × 365
```

### 5. Inversor Recomendado
```
Potência do Inversor = Potência dos Painéis × 1.1

Nota: O inversor deve ter entre 100% e 130% da potência dos painéis
```

### 6. Custo do Sistema
```
Custo Base = Potência do Sistema × Custo por kWp

Se incluir bateria:
  Capacidade Necessária = Consumo Diário × 2 (2 dias de autonomia)
  Custo Total = Custo Base + Custo da Bateria
```

### 7. Análise Financeira
```
Conta Atual = Valor informado pelo usuário
Nova Conta = MAX(0, Conta Atual - (Geração Mensal × Tarifa))
Economia Mensal = Conta Atual - Nova Conta
Economia Anual = Economia Mensal × 12

Payback (anos) = Custo do Sistema / Economia Anual

ROI 25 anos = ((Economia Total 25 anos - Custo) / Custo) × 100
```

### 8. Área Necessária
```
Área por Painel:
- 450-500Wp: 2.0 m²
- 550-600Wp: 2.3 m²

Área Total = Número de Painéis × Área por Painel × 1.2
(+20% para espaçamento entre painéis)
```

### 9. Impacto Ambiental
```
CO₂ Evitado (kg/ano) = Geração Anual × 0.5
(1 kWh evita ~0.5 kg de CO₂)

Árvores Equivalentes = CO₂ Evitado / 21
(1 árvore absorve ~21 kg de CO₂ por ano)
```

---

## 📊 Resultado do Cálculo

O resultado apresenta:

### **Sistema**
- Potência do Sistema (kWp)
- Número de Painéis
- Potência dos Painéis (Wp)
- Potência do Inversor (kW)
- Área Necessária (m²)

### **Geração de Energia**
- Geração Mensal (kWh)
- Geração Anual (kWh)

### **Análise Financeira**
- Investimento Total (R$)
- Economia Mensal (R$)
- Economia Anual (R$)
- Payback (anos)
- ROI em 25 anos (%)

### **Impacto Ambiental**
- CO₂ Evitado por Ano (kg)
- Equivalente em Árvores

---

## 🎨 Interface

### **Layout**
- **Coluna Esquerda (2/3)**: Formulário de entrada
- **Coluna Direita (1/3)**: Resultado (sticky)

### **Seções do Formulário**
1. Tipo de Propriedade (cards clicáveis)
2. Consumo de Energia (3 campos)
3. Localização e Telhado (2 selects)
4. Configuração do Sistema (2 selects + checkbox)
5. Botão "Calcular Sistema Solar"

### **Painel de Resultado**
- Design em card branco com sombra
- Seções separadas por bordas
- Valores destacados em cores:
  - Primary: Potência do sistema
  - Verde: Economia e geração
  - Cinza: Dados técnicos
- Botões de ação:
  - Salvar Cálculo
  - Baixar PDF

---

## 🔄 Integrações Futuras

### 1. **Salvar Cálculo**
```typescript
// Salvar no banco de dados vinculado a um cliente
POST /api/calculations
{
  clientId: string,
  propertyType: string,
  consumption: number,
  result: CalculationResult,
  createdBy: string,
  companyId: string
}
```

### 2. **Gerar PDF**
- Usar biblioteca `jsPDF` ou `react-pdf`
- Incluir logo da empresa
- Dados do cliente
- Resultado completo do dimensionamento
- Gráficos de geração e economia

### 3. **Vincular a Proposta**
- Ao criar proposta, permitir importar dados da calculadora
- Preencher automaticamente:
  - Potência do sistema
  - Número de painéis
  - Equipamentos recomendados
  - Custo estimado

### 4. **Histórico de Cálculos**
- Página para listar todos os cálculos salvos
- Filtrar por cliente, data, tipo de sistema
- Comparar diferentes cenários

---

## 📱 Responsividade

- ✅ Desktop: Layout em 2 colunas
- ✅ Tablet: Layout em 2 colunas (ajustado)
- ✅ Mobile: Layout em 1 coluna (resultado abaixo do formulário)

---

## 🚀 Melhorias Futuras

### **Cálculos Avançados**
1. **Múltiplas Unidades Consumidoras**
   - Calcular sistema para várias UCs
   - Distribuição de créditos

2. **Orientação e Inclinação**
   - Considerar orientação do telhado (Norte, Sul, etc.)
   - Ajustar cálculo pela inclinação

3. **Sombreamento**
   - Fator de sombreamento
   - Redução de geração

4. **Degradação dos Painéis**
   - Considerar perda de 0.5% ao ano
   - Projeção de geração em 25 anos

### **Equipamentos**
1. **Buscar da API**
   - Listar módulos reais cadastrados
   - Listar inversores compatíveis
   - Listar baterias disponíveis

2. **Recomendação Inteligente**
   - Sugerir melhor combinação de equipamentos
   - Considerar disponibilidade em estoque

### **Financeiro**
1. **Financiamento**
   - Calcular parcelas
   - Diferentes taxas de juros
   - Comparar com economia

2. **Inflação Energética**
   - Considerar aumento anual da tarifa (média 5-7%)
   - Projeção de economia ajustada

### **Relatórios**
1. **PDF Profissional**
   - Template customizável
   - Logo da empresa
   - Gráficos e tabelas

2. **Comparação de Cenários**
   - Comparar diferentes potências
   - Comparar com/sem bateria
   - Análise de sensibilidade

---

## 🎯 Casos de Uso

### **Caso 1: Residência Pequena**
- Consumo: 200 kWh/mês
- Conta: R$ 170,00
- Resultado: ~8 painéis de 550Wp (4.4 kWp)
- Investimento: ~R$ 19.800
- Payback: ~5 anos

### **Caso 2: Residência Média**
- Consumo: 350 kWh/mês
- Conta: R$ 300,00
- Resultado: ~14 painéis de 550Wp (7.7 kWp)
- Investimento: ~R$ 34.650
- Payback: ~4.5 anos

### **Caso 3: Comércio**
- Consumo: 1.000 kWh/mês
- Conta: R$ 850,00
- Resultado: ~40 painéis de 550Wp (22 kWp)
- Investimento: ~R$ 92.400
- Payback: ~4 anos

### **Caso 4: Indústria**
- Consumo: 5.000 kWh/mês
- Conta: R$ 4.250,00
- Resultado: ~200 painéis de 550Wp (110 kWp)
- Investimento: ~R$ 440.000
- Payback: ~3.5 anos

---

## 📚 Referências

- **ANEEL**: Regulamentação de geração distribuída
- **CRESESB**: Atlas Solarimétrico do Brasil
- **INMETRO**: Tabelas de eficiência de equipamentos
- **Mercado Solar**: Preços médios de sistemas fotovoltaicos

---

## ✅ Status de Implementação

- ✅ Interface completa
- ✅ Cálculos básicos funcionando
- ✅ Integração com equipamentos cadastrados
- ✅ Design responsivo
- ⏳ Salvar cálculo no banco (TODO)
- ⏳ Gerar PDF (TODO)
- ⏳ Vincular a proposta (TODO)
- ⏳ Histórico de cálculos (TODO)

---

## 🎨 Acesso

**URL**: `/calculator`

**Menu**: 
- Página inicial (card "Dimensionamento Fotovoltaico")
- Header do Board (botão "Calculadora")
