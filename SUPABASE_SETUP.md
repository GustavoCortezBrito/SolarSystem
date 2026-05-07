# 🚀 Setup Supabase - Guia Completo

## 📋 Passo 1: Criar Projeto no Supabase

1. **Acesse:** https://supabase.com
2. **Faça login** (pode usar sua conta GitHub)
3. **Clique em "New Project"**
4. **Preencha os dados:**
   - **Name:** `solarsystem`
   - **Database Password:** escolha uma senha forte (ex: `Solar@2024!Strong`)
   - **Region:** `South America (São Paulo)` ← mais próximo do Brasil
   - **Pricing Plan:** Free (0$/mês)
5. **Clique em "Create new project"**
6. **Aguarde ~2 minutos** (o projeto está sendo criado)

---

## 📋 Passo 2: Obter Connection String

Depois que o projeto estiver pronto:

1. **No dashboard do Supabase**, clique em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **Database**
3. Role até a seção **"Connection string"**
4. Selecione a aba **"URI"** (não use "Session mode")
5. **Copie a string** que aparece (algo como):
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
6. **IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha que você criou no Passo 1

**Exemplo de connection string final:**
```
postgresql://postgres.abcdefghijklmnop:Solar@2024!Strong@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

## 📋 Passo 3: Configurar .env Local

Abra o arquivo `.env` na raiz do projeto e atualize:

```env
# ─── DATABASE ─────────────────────────────────────────────────────────────────
# Cole aqui a connection string do Supabase (com a senha substituída)
DATABASE_URL="postgresql://postgres.xxxxx:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"

# ─── NEXTAUTH ─────────────────────────────────────────────────────────────────
# Gere um secret único (rode: openssl rand -base64 32)
NEXTAUTH_SECRET="cole-aqui-o-secret-gerado"
NEXTAUTH_URL="http://localhost:3000"
```

### Gerar NEXTAUTH_SECRET:

**Windows (PowerShell):**
```powershell
# Opção 1: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 2: Gerar online
# Acesse: https://generate-secret.vercel.app/32
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

---

## 📋 Passo 4: Rodar Migrations

Agora vamos criar as tabelas no Supabase:

```bash
# 1. Gerar Prisma Client
npx prisma generate

# 2. Criar as tabelas no banco
npx prisma migrate dev --name init

# 3. (Opcional) Visualizar o banco
npx prisma studio
```

**O que vai acontecer:**
- ✅ Prisma vai conectar no Supabase
- ✅ Criar todas as 16 tabelas (users, clients, proposals, etc.)
- ✅ Aplicar índices e relações
- ✅ Gerar o Prisma Client

---

## 📋 Passo 5: Configurar Variáveis no Vercel (Deploy)

Para o deploy funcionar, você precisa adicionar as variáveis de ambiente no Vercel:

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione seu projeto:** SolarSystem
3. **Vá em:** Settings → Environment Variables
4. **Adicione as seguintes variáveis:**

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `seu-secret-gerado` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` | Production |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |

5. **Clique em "Save"**
6. **Faça um novo deploy:**
   ```bash
   git add .
   git commit -m "chore: configurar variáveis de ambiente"
   git push origin main
   ```

---

## 📋 Passo 6: Aplicar Migrations no Vercel

Depois do deploy, você precisa rodar as migrations no banco de produção:

**Opção 1: Via Vercel CLI**
```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# Rodar migration em produção
vercel env pull .env.production
npx prisma migrate deploy
```

**Opção 2: Via GitHub Actions (Recomendado)**

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy
```

Depois adicione o `DATABASE_URL` nos secrets do GitHub:
1. GitHub → Seu repositório → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `DATABASE_URL`
4. Value: sua connection string do Supabase

---

## 🔍 Verificar se Funcionou

### No Supabase:

1. **Vá em:** Table Editor (no menu lateral)
2. **Você deve ver 16 tabelas:**
   - users
   - accounts
   - sessions
   - verification_tokens
   - companies
   - company_members
   - clients
   - client_activities
   - proposals
   - boards
   - columns
   - cards
   - notifications
   - modules
   - inverters
   - batteries
   - optimizers

### Localmente:

```bash
# Abrir Prisma Studio
npx prisma studio

# Deve abrir http://localhost:5555 com todas as tabelas
```

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

**Solução:**
1. Verifique se copiou a connection string correta
2. Confirme que substituiu `[YOUR-PASSWORD]` pela senha real
3. Teste a conexão:
   ```bash
   npx prisma db pull
   ```

### Erro: "SSL connection required"

**Solução:** Adicione `?sslmode=require` no final da connection string:
```
postgresql://postgres.xxxxx:senha@host:6543/postgres?sslmode=require
```

### Erro no deploy Vercel: "Prisma Client not found"

**Solução:** Adicione no `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Erro: "P1001: Can't reach database server"

**Solução:** 
1. Verifique se o projeto Supabase está ativo (não pausado)
2. Projetos grátis pausam após 7 dias de inatividade
3. Acesse o dashboard do Supabase e clique em "Resume project"

---

## 📊 Limites do Plano Grátis Supabase

- ✅ **500 MB** de espaço em disco
- ✅ **2 GB** de transferência de dados/mês
- ✅ **50 MB** de armazenamento de arquivos
- ✅ **Pausa automática** após 7 dias sem atividade
- ✅ **Ilimitado** de requisições API

**Para este projeto:** O plano grátis é mais que suficiente para desenvolvimento e testes!

---

## 🎯 Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Connection string copiada e senha substituída
- [ ] `.env` local configurado com DATABASE_URL
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] `npx prisma generate` executado com sucesso
- [ ] `npx prisma migrate dev --name init` executado com sucesso
- [ ] Tabelas visíveis no Supabase Table Editor
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy funcionando sem erros

---

## 🚀 Próximos Passos

Depois de configurar o Supabase:

1. ✅ Criar seed com dados iniciais
2. ✅ Implementar API Routes (CRUD)
3. ✅ Configurar NextAuth.js
4. ✅ Migrar store.ts (localStorage → API)
5. ✅ Testar autenticação
6. ✅ Deploy em produção

**Tudo pronto! Agora é só seguir os passos acima.** 🎉
