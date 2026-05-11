# Estratégia de Precificação SaaS - SolarSystem CRM

## 📊 Análise do Mercado

### Concorrentes (CRM para Energia Solar)
- **Zoho CRM**: R$ 52-104/usuário/mês
- **Pipedrive**: R$ 65-195/usuário/mês  
- **HubSpot**: R$ 200-800/usuário/mês
- **Monday.com**: R$ 39-79/usuário/mês

### Seu Diferencial
✓ Especializado em energia solar
✓ Calculadora integrada
✓ Gestão de equipamentos
✓ Importação do Trello
✓ Board Kanban nativo

## 💰 Modelo de Precificação Sugerido

### Plano 1: STARTER (Pequenas Empresas)
**R$ 97/mês** (anual) ou **R$ 127/mês** (mensal)

- ✓ Até 3 usuários
- ✓ 1.000 clientes
- ✓ 500 projetos ativos
- ✓ **5 GB de armazenamento** (~5.000 arquivos)
- ✓ Calculadora solar
- ✓ Propostas ilimitadas
- ✓ 1 board Kanban
- ✓ Suporte por email

**Custo por arquivo**: ~1 MB médio = 5.000 arquivos

### Plano 2: PROFESSIONAL (Empresas Médias)
**R$ 247/mês** (anual) ou **R$ 297/mês** (mensal)

- ✓ Até 10 usuários
- ✓ 5.000 clientes
- ✓ 2.000 projetos ativos
- ✓ **25 GB de armazenamento** (~25.000 arquivos)
- ✓ Tudo do Starter +
- ✓ Múltiplos boards
- ✓ Importação do Trello
- ✓ Relatórios avançados
- ✓ API access
- ✓ Suporte prioritário

### Plano 3: ENTERPRISE (Grandes Empresas)
**R$ 497/mês** (anual) ou **R$ 597/mês** (mensal)

- ✓ Usuários ilimitados
- ✓ Clientes ilimitados
- ✓ Projetos ilimitados
- ✓ **100 GB de armazenamento** (~100.000 arquivos)
- ✓ Tudo do Professional +
- ✓ White label
- ✓ Integrações customizadas
- ✓ Suporte 24/7
- ✓ Gerente de conta dedicado

### Add-ons (Extras)
- **+10 GB storage**: R$ 29/mês
- **+5 usuários**: R$ 49/mês
- **Backup diário**: R$ 39/mês
- **Treinamento**: R$ 497 (one-time)

## 🗄️ Arquitetura de Storage no Supabase

### Configuração do Supabase Storage

```sql
-- Criar bucket para arquivos dos clientes
CREATE BUCKET company_files WITH (
  public = false,
  file_size_limit = 10485760, -- 10MB por arquivo
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
);

-- Políticas de acesso (RLS)
CREATE POLICY "Users can upload to their company folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their company files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'company_files' AND
  (storage.foldername(name))[1] IN (
    SELECT company_id FROM company_members WHERE user_id = auth.uid()
  )
);
```

### Estrutura de Pastas

```
company_files/
├── {companyId}/
│   ├── clients/
│   │   ├── {clientId}/
│   │   │   ├── documents/
│   │   │   ├── photos/
│   │   │   └── proposals/
│   ├── projects/
│   │   └── {projectId}/
│   │       ├── technical/
│   │       └── contracts/
│   └── imports/
│       └── trello/
│           └── {importId}/
```

## 📈 Cálculo de Uso por Cliente

### Estimativa Baseada no Seu Trello

Analisando seu board com 3.015 cards:

```javascript
// Exemplo de um card com 10 anexos
Card médio:
- 10 attachments
- Tamanho médio: 1.5 MB por arquivo
- Total por card: 15 MB

3.015 cards × 15 MB = ~45 GB total
```

### Fórmula de Cálculo

```javascript
function calculateStorageUsage(companyId) {
  // Buscar todos os arquivos da empresa
  const files = await supabase.storage
    .from('company_files')
    .list(`${companyId}/`, { recursive: true });
  
  const totalBytes = files.reduce((sum, file) => sum + file.metadata.size, 0);
  const totalGB = totalBytes / (1024 * 1024 * 1024);
  
  return {
    totalBytes,
    totalGB: totalGB.toFixed(2),
    fileCount: files.length,
    averageFileSize: (totalBytes / files.length / 1024 / 1024).toFixed(2) + ' MB'
  };
}
```

## 💾 Schema do Banco para Controle de Storage

```prisma
model Company {
  id                String   @id @default(cuid())
  name              String
  
  // Plano e limites
  plan              String   @default("STARTER") // STARTER, PROFESSIONAL, ENTERPRISE
  maxUsers          Int      @default(3)
  maxClients        Int      @default(1000)
  maxProjects       Int      @default(500)
  storageQuotaGB    Float    @default(5.0)
  
  // Uso atual
  currentUsers      Int      @default(0)
  currentClients    Int      @default(0)
  currentProjects   Int      @default(0)
  storageUsedGB     Float    @default(0.0)
  
  // Billing
  subscriptionId    String?
  subscriptionStatus String? @default("trial") // trial, active, past_due, canceled
  trialEndsAt       DateTime?
  billingCycle      String?  @default("monthly") // monthly, annual
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("companies")
}

model FileUpload {
  id          String   @id @default(cuid())
  companyId   String
  userId      String
  
  // Arquivo
  fileName    String
  fileSize    Int      // bytes
  mimeType    String
  storagePath String   // caminho no Supabase Storage
  
  // Vinculação
  entityType  String?  // CLIENT, PROJECT, PROPOSAL, CARD
  entityId    String?
  
  // Metadata
  uploadedAt  DateTime @default(now())
  
  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([companyId])
  @@index([entityType, entityId])
  @@map("file_uploads")
}
```

## 🔄 Sistema de Monitoramento de Uso

### API para Verificar Limites

```typescript
// app/api/usage/route.ts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const companyId = request.nextUrl.searchParams.get("companyId");
  
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: {
        select: {
          members: true,
          clients: true,
          // ... outros
        }
      }
    }
  });
  
  // Calcular storage usado
  const files = await prisma.fileUpload.aggregate({
    where: { companyId },
    _sum: { fileSize: true },
    _count: true
  });
  
  const storageUsedGB = (files._sum.fileSize || 0) / (1024 * 1024 * 1024);
  
  // Atualizar no banco
  await prisma.company.update({
    where: { id: companyId },
    data: { storageUsedGB }
  });
  
  return NextResponse.json({
    plan: company.plan,
    limits: {
      users: company.maxUsers,
      clients: company.maxClients,
      projects: company.maxProjects,
      storageGB: company.storageQuotaGB
    },
    usage: {
      users: company._count.members,
      clients: company._count.clients,
      storageGB: storageUsedGB.toFixed(2),
      files: files._count
    },
    percentages: {
      users: (company._count.members / company.maxUsers * 100).toFixed(1),
      clients: (company._count.clients / company.maxClients * 100).toFixed(1),
      storage: (storageUsedGB / company.storageQuotaGB * 100).toFixed(1)
    }
  });
}
```

## 💡 Custos do Supabase (Seu Custo)

### Plano Free (Desenvolvimento)
- ✓ 500 MB database
- ✓ 1 GB storage
- ✓ 2 GB bandwidth/mês
- **Custo: R$ 0**

### Plano Pro (Produção)
- ✓ 8 GB database
- ✓ 100 GB storage
- ✓ 250 GB bandwidth/mês
- **Custo: $25/mês (~R$ 125/mês)**

### Storage Adicional
- **R$ 0,50/GB/mês** (após 100 GB)

### Cálculo de Margem

**Exemplo com 10 clientes no plano Professional:**

```
Receita: 10 × R$ 247 = R$ 2.470/mês

Custos:
- Supabase Pro: R$ 125/mês
- Storage extra (500 GB): R$ 200/mês
- Vercel Pro: R$ 100/mês
- Total: R$ 425/mês

Margem: R$ 2.045/mês (82%)
```

## 🎯 Estratégia de Crescimento

### Fase 1: MVP (Meses 1-3)
- Lançar com plano STARTER apenas
- 10-20 clientes beta
- Validar precificação
- **Meta: R$ 2.000/mês**

### Fase 2: Escala (Meses 4-6)
- Adicionar planos PRO e ENTERPRISE
- 50-100 clientes
- Implementar billing automático
- **Meta: R$ 15.000/mês**

### Fase 3: Consolidação (Meses 7-12)
- 200+ clientes
- Equipe de suporte
- Marketing agressivo
- **Meta: R$ 50.000/mês**

## 🔐 Implementação de Limites

### Middleware de Verificação

```typescript
// middleware/checkLimits.ts
export async function checkStorageLimit(companyId: string, fileSize: number) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });
  
  const newUsage = company.storageUsedGB + (fileSize / (1024 * 1024 * 1024));
  
  if (newUsage > company.storageQuotaGB) {
    throw new Error(
      `Limite de armazenamento atingido. ` +
      `Usado: ${newUsage.toFixed(2)} GB / ${company.storageQuotaGB} GB. ` +
      `Faça upgrade do seu plano.`
    );
  }
  
  return true;
}
```

## 📊 Dashboard de Uso para Clientes

Criar uma página `/settings/usage` mostrando:

- 📈 Gráfico de uso de storage ao longo do tempo
- 👥 Número de usuários ativos
- 📁 Arquivos por tipo (PDF, imagens, etc)
- 💾 Top 10 arquivos maiores
- ⚠️ Alertas quando atingir 80% do limite
- 🔄 Botão de upgrade de plano

## 🎁 Estratégia de Trial

### Trial de 14 dias
- Acesso completo ao plano PROFESSIONAL
- Sem cartão de crédito necessário
- Email de lembrete nos dias 7, 12 e 14
- Conversão esperada: 20-30%

## 💳 Integração de Pagamento

### Opções no Brasil
1. **Stripe** (internacional, aceita PIX)
2. **Asaas** (brasileiro, mais fácil)
3. **Pagar.me** (brasileiro, completo)

### Recomendação: Asaas
- ✓ PIX, boleto, cartão
- ✓ Assinaturas recorrentes
- ✓ API simples
- ✓ Taxa: 2,99% + R$ 0,49 por transação

## 📝 Resumo Executivo

### Precificação Recomendada
- **Starter**: R$ 97/mês (5 GB)
- **Professional**: R$ 247/mês (25 GB)
- **Enterprise**: R$ 497/mês (100 GB)

### Margem de Lucro
- **82%** com 10+ clientes
- **90%** com 50+ clientes (economia de escala)

### Break-even
- **4 clientes Professional** = R$ 988/mês
- Cobre custos de infraestrutura + sobra para marketing

### Potencial de Receita (12 meses)
- **Conservador**: 50 clientes = R$ 12.350/mês = R$ 148.200/ano
- **Moderado**: 100 clientes = R$ 24.700/mês = R$ 296.400/ano
- **Otimista**: 200 clientes = R$ 49.400/mês = R$ 592.800/ano
