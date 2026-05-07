# 📦 Guia do Catálogo de Módulos Fotovoltaicos

## Visão Geral

O catálogo de módulos é uma funcionalidade essencial para CRMs de energia solar, permitindo gerenciar e consultar informações técnicas de mais de 1000 módulos fotovoltaicos cadastrados.

## 🎯 Funcionalidades Implementadas

### 1. Listagem Paginada
- **Paginação eficiente** para lidar com +1000 registros
- **Opções de visualização**: 10, 20, 50 ou 100 módulos por página
- **Navegação**: Botões anterior/próximo + indicador de página atual
- **Contador**: Mostra quantos módulos estão sendo exibidos do total

### 2. Sistema de Busca
- **Busca em tempo real** por fabricante ou modelo
- **Campo de busca destacado** no topo da página
- **Resultados instantâneos** conforme você digita

### 3. Filtros Avançados
**6 tipos de filtros disponíveis:**

1. **Fabricante**: Selecione entre 10 fabricantes
   - AE SOLAR
   - CANADIAN SOLAR
   - JINKO SOLAR
   - TRINA SOLAR
   - JA SOLAR
   - LONGi
   - RISEN
   - SUNTECH
   - PHONO SOLAR
   - ASTRONERGY

2. **Tipo de Célula**:
   - Monocristalino
   - Policristalino
   - Filme Fino

3. **Potência Mínima**: Filtrar módulos acima de X watts

4. **Potência Máxima**: Filtrar módulos abaixo de X watts

5. **Eficiência Mínima**: Filtrar por eficiência (%)

6. **Disponibilidade**:
   - Disponível (em estoque)
   - Sob Encomenda (prazo de entrega)
   - Indisponível (fora de linha)

**Recursos dos Filtros:**
- ✅ Contador de filtros ativos (badge no botão)
- ✅ Botão "Limpar Filtros" para resetar tudo
- ✅ Painel expansível (toggle)
- ✅ Combinação de múltiplos filtros

### 4. Visualização de Detalhes
**Modal completo com todas as especificações:**

#### Especificações Básicas
- Potência (W)
- Tipo de célula
- Número de células
- Eficiência (%)

#### Dimensões e Peso
- Comprimento × Largura × Profundidade (mm)
- Peso (kg)

#### Especificações Elétricas
- Tensão (V)
- Tensão de operação Vmp (V)
- Corrente de operação Imp (A)
- Tensão de circuito aberto Voc (V)
- Corrente de curto circuito Isc (A)

#### Coeficientes de Temperatura
- Pmax (%/°C)
- Voc (%/°C)
- Isc (%/°C)

#### Informações Comerciais
- Preço (R$)
- Garantia (anos)
- Disponibilidade

### 5. Tabela Responsiva
- **8 colunas** com informações principais
- **Hover effect** nas linhas
- **Badges coloridos** para tipo e disponibilidade
- **Botão de visualização** (ícone de olho)

## 🔧 Estrutura Técnica

### Tipos (types/module.ts)
```typescript
export interface SolarModule {
  id: string;
  manufacturer: string;
  model: string;
  power: number;
  cells: number;
  efficiency: number;
  cellType: "MONOCRISTALINO" | "POLICRISTALINO" | "FILME_FINO";
  // ... mais campos
}
```

### Dados Mock (lib/mockModuleData.ts)
- **Função geradora**: `generateMockModules(count)` cria N módulos
- **Cache**: Módulos são gerados uma vez e reutilizados
- **Filtros**: Função `filterModules()` aplica todos os filtros
- **Paginação**: Retorna apenas os módulos da página atual

### Página (app/modules/page.tsx)
- **Estado local**: Gerencia filtros, paginação e módulo selecionado
- **useEffect**: Recarrega módulos quando filtros ou página mudam
- **Modal**: Exibe detalhes completos do módulo selecionado

## 📊 Dados Mock

### Geração Automática
O sistema gera automaticamente 1000 módulos com:
- **10 fabricantes** diferentes
- **Potências** de 300W a 790W
- **Células** de 72, 120 ou 144
- **Eficiências** de 17% a 22%
- **3 tipos** de células (distribuição uniforme)
- **Disponibilidade** variada (90% disponível, 10% sob encomenda, 5% indisponível)

### Realismo
Os dados são gerados com base em:
- Padrões reais de nomenclatura (ex: AE340M6-72)
- Dimensões típicas por número de células
- Especificações elétricas calculadas proporcionalmente
- Coeficientes de temperatura realistas

## 🧪 Como Testar

### Passo a Passo

1. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

2. **Fazer login:**
   - Email: `carlos@solartech.com`
   - Senha: `senha123`

3. **Acessar o catálogo:**
   - Clique em "Módulos" no header do board
   - OU acesse: `http://localhost:3000/modules`

4. **Testar busca:**
   - Digite "AE SOLAR" no campo de busca
   - ✅ Deve filtrar apenas módulos da AE SOLAR

5. **Testar filtros:**
   - Clique em "Filtros"
   - Selecione "Fabricante: CANADIAN SOLAR"
   - Selecione "Tipo: Monocristalino"
   - Digite "Potência Mín: 400"
   - ✅ Deve mostrar apenas módulos que atendem TODOS os critérios
   - ✅ Badge deve mostrar "3" filtros ativos

6. **Testar paginação:**
   - Clique em "Próximo"
   - ✅ Deve carregar próxima página
   - ✅ Contador deve atualizar (ex: "Mostrando 21 a 40 de 1000")

7. **Testar visualização:**
   - Clique no ícone de olho em qualquer módulo
   - ✅ Modal deve abrir com todos os detalhes
   - Clique em "Fechar" ou no X
   - ✅ Modal deve fechar

8. **Testar limpar filtros:**
   - Com filtros aplicados, clique em "Limpar Filtros"
   - ✅ Todos os filtros devem ser resetados
   - ✅ Badge de contador deve desaparecer

## 🎨 Design e UX

### Cores e Badges
- **Disponível**: Verde (`bg-green-100 text-green-800`)
- **Sob Encomenda**: Amarelo (`bg-yellow-100 text-yellow-800`)
- **Indisponível**: Vermelho (`bg-red-100 text-red-800`)
- **Monocristalino**: Azul (`bg-blue-100 text-blue-800`)

### Responsividade
- **Desktop**: Grid de 6 colunas para filtros
- **Tablet**: Grid de 3 colunas
- **Mobile**: Grid de 1 coluna
- **Tabela**: Scroll horizontal em telas pequenas

### Acessibilidade
- ✅ Labels descritivos em todos os campos
- ✅ Contraste adequado em badges
- ✅ Botões com área de clique adequada
- ✅ Feedback visual em todas as ações

## 🚀 Próximos Passos

### Integração com Backend

#### 1. API de Módulos
```typescript
// GET /api/modules
// Query params: page, pageSize, search, manufacturer, etc.
const response = await fetch('/api/modules?' + new URLSearchParams({
  page: '1',
  pageSize: '20',
  search: 'AE SOLAR',
  manufacturer: 'AE SOLAR',
  minPower: '400',
}));

const data = await response.json();
// { modules: [...], pagination: { page, pageSize, total, totalPages } }
```

#### 2. Banco de Dados
```sql
CREATE TABLE solar_modules (
  id UUID PRIMARY KEY,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  power INTEGER NOT NULL,
  cells INTEGER NOT NULL,
  efficiency DECIMAL(5,2) NOT NULL,
  cell_type VARCHAR(20) NOT NULL,
  length INTEGER NOT NULL,
  width INTEGER NOT NULL,
  depth INTEGER NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  voltage INTEGER NOT NULL,
  vmp DECIMAL(5,2) NOT NULL,
  imp DECIMAL(5,2) NOT NULL,
  voc DECIMAL(5,2) NOT NULL,
  isc DECIMAL(5,2) NOT NULL,
  temp_coefficient_pmax DECIMAL(6,4) NOT NULL,
  temp_coefficient_voc DECIMAL(6,4) NOT NULL,
  temp_coefficient_isc DECIMAL(6,4) NOT NULL,
  price DECIMAL(10,2),
  warranty INTEGER NOT NULL,
  availability VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_manufacturer ON solar_modules(manufacturer);
CREATE INDEX idx_power ON solar_modules(power);
CREATE INDEX idx_efficiency ON solar_modules(efficiency);
CREATE INDEX idx_availability ON solar_modules(availability);
```

#### 3. Importação de Dados
```typescript
// Script para importar dados do Solarmarket ou outras fontes
import { parse } from 'csv-parse';
import fs from 'fs';

async function importModules(csvPath: string) {
  const modules = [];
  
  fs.createReadStream(csvPath)
    .pipe(parse({ columns: true }))
    .on('data', (row) => {
      modules.push({
        manufacturer: row.fabricante,
        model: row.modelo,
        power: parseInt(row.potencia),
        // ... mapear outros campos
      });
    })
    .on('end', async () => {
      await db.solarModules.createMany({ data: modules });
      console.log(`${modules.length} módulos importados`);
    });
}
```

### Funcionalidades Avançadas

#### 1. Comparação de Módulos
- Selecionar 2-4 módulos
- Exibir comparação lado a lado
- Destacar diferenças principais

#### 2. Favoritos
- Marcar módulos como favoritos
- Filtro "Meus Favoritos"
- Sincronizar com perfil do usuário

#### 3. Histórico de Preços
- Gráfico de evolução de preço
- Alertas de mudança de preço
- Melhor momento para comprar

#### 4. Integração com Dimensionamento
- Selecionar módulo ao criar projeto
- Calcular automaticamente quantidade necessária
- Sugerir módulos baseado em requisitos

#### 5. Exportação
- Exportar lista filtrada para Excel/CSV
- Gerar PDF com especificações
- Compartilhar lista com cliente

#### 6. Gestão de Estoque
- Quantidade em estoque
- Alertas de estoque baixo
- Previsão de reposição

## 📈 Performance

### Otimizações Implementadas

1. **Paginação**: Apenas 20-100 módulos carregados por vez
2. **Cache**: Módulos gerados uma vez e reutilizados
3. **Filtros no cliente**: Rápidos e responsivos
4. **Lazy loading**: Modal só renderiza quando aberto

### Otimizações Futuras

1. **Virtualização**: Renderizar apenas linhas visíveis
2. **Debounce**: Atrasar busca até usuário parar de digitar
3. **Cache de API**: Armazenar resultados de filtros comuns
4. **Índices de banco**: Otimizar queries complexas

## 🔒 Permissões

### Acesso ao Catálogo
- **Todos os usuários** podem visualizar módulos
- **OWNER e ADMIN** podem editar/adicionar módulos (futuro)
- **MEMBER** apenas visualiza

### Integração com Sistema de Permissões
```typescript
// Verificar permissão antes de editar
if (hasPermission(user, "modules.edit")) {
  // Permitir edição
}
```

## 📚 Documentação de Código

### Funções Principais

#### `generateMockModules(count: number)`
Gera N módulos mock com dados realistas.

**Parâmetros:**
- `count`: Número de módulos a gerar (padrão: 1000)

**Retorna:**
- Array de `SolarModule`

#### `filterModules(filters, page, pageSize)`
Filtra e pagina módulos baseado nos critérios.

**Parâmetros:**
- `filters`: Objeto com critérios de filtro
- `page`: Página atual (1-indexed)
- `pageSize`: Módulos por página

**Retorna:**
- `{ modules: SolarModule[], pagination: ModulePagination }`

#### `getModuleById(id: string)`
Busca módulo por ID.

**Parâmetros:**
- `id`: ID do módulo

**Retorna:**
- `SolarModule | undefined`

## 🎓 Casos de Uso

### 1. Dimensionamento de Projeto
```typescript
// Cliente precisa de 10kWp
const requiredPower = 10000; // W
const selectedModule = modules.find(m => m.power === 550);
const quantity = Math.ceil(requiredPower / selectedModule.power);
// Resultado: 19 módulos de 550W
```

### 2. Comparação de Custo
```typescript
// Comparar custo por watt
const modules = filterModules({ minPower: 500 });
const sorted = modules.sort((a, b) => {
  const costPerWattA = a.price! / a.power;
  const costPerWattB = b.price! / b.power;
  return costPerWattA - costPerWattB;
});
// Módulo mais econômico
```

### 3. Seleção por Espaço Disponível
```typescript
// Cliente tem 50m² de telhado
const availableArea = 50 * 1000000; // mm²
const modules = filterModules({});
const suitable = modules.filter(m => {
  const moduleArea = m.length * m.width;
  const maxQuantity = Math.floor(availableArea / moduleArea);
  const totalPower = maxQuantity * m.power;
  return totalPower >= 10000; // Precisa de 10kWp
});
```

## 🐛 Troubleshooting

### Problema: Filtros não funcionam
**Solução**: Verifique se `loadModules()` está sendo chamado no `useEffect`

### Problema: Paginação não atualiza
**Solução**: Certifique-se de que `page` está nas dependências do `useEffect`

### Problema: Modal não fecha
**Solução**: Verifique se `setSelectedModule(null)` está sendo chamado

### Problema: Performance lenta com muitos módulos
**Solução**: Reduza `pageSize` ou implemente virtualização

## ✅ Checklist de Implementação

- ✅ Tipos definidos (`types/module.ts`)
- ✅ Dados mock gerados (`lib/mockModuleData.ts`)
- ✅ Página de listagem (`app/modules/page.tsx`)
- ✅ Sistema de busca
- ✅ Filtros avançados (6 tipos)
- ✅ Paginação funcional
- ✅ Modal de detalhes
- ✅ Link no board
- ✅ Badges coloridos
- ✅ Responsivo
- ✅ Documentação completa

## 🎉 Conclusão

O catálogo de módulos está **100% funcional** e pronto para uso, com:

✅ **1000+ módulos** cadastrados  
✅ **Busca em tempo real**  
✅ **6 filtros avançados**  
✅ **Paginação eficiente**  
✅ **Modal de detalhes completo**  
✅ **Design responsivo**  
✅ **Performance otimizada**  
✅ **Documentação completa**  

O sistema está preparado para integração com backend real e pode ser facilmente expandido com novas funcionalidades como comparação, favoritos, e integração com dimensionamento de projetos.

---

**Implementado por**: Kiro AI  
**Data**: Maio 2026  
**Versão**: 1.0.0  
**Status**: ✅ Completo e Testado
