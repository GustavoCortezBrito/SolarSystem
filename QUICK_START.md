# ⚡ Quick Start - Supabase

## 🎯 Passo a Passo Rápido

### 1️⃣ Criar Projeto no Supabase (2 minutos)

1. Acesse: https://supabase.com
2. Login com GitHub
3. "New Project"
4. Name: `solarsystem`
5. Password: escolha uma senha forte (anote!)
6. Region: `South America (São Paulo)`
7. "Create new project" → aguarde 2 min

### 2️⃣ Copiar Connection String

1. Settings → Database
2. Connection string → URI
3. Copie a string
4. Substitua `[YOUR-PASSWORD]` pela senha que você criou

### 3️⃣ Gerar NEXTAUTH_SECRET

```bash
npm run generate-secret
```

Copie o valor gerado.

### 4️⃣ Configurar .env

Abra o arquivo `.env` e cole:

```env
DATABASE_URL="postgresql://postgres.xxxxx:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="cole-o-secret-gerado"
NEXTAUTH_URL="http://localhost:3000"
```

### 5️⃣ Rodar Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 6️⃣ Verificar

```bash
npm run db:studio
```

Deve abrir http://localhost:5555 com todas as tabelas.

### 7️⃣ Configurar Vercel (Deploy)

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → Settings → Environment Variables
3. Adicione:
   - `DATABASE_URL` = sua connection string do Supabase
   - `NEXTAUTH_SECRET` = o secret gerado
   - `NEXTAUTH_URL` = `https://seu-dominio.vercel.app`
4. Save
5. Redeploy:
   ```bash
   git add .
   git commit -m "chore: configurar Supabase"
   git push origin main
   ```

---

## 🎉 Pronto!

Agora você tem:
- ✅ Banco PostgreSQL no Supabase
- ✅ 16 tabelas criadas
- ✅ Prisma Client configurado
- ✅ Pronto para deploy

**Próximo passo:** Criar API Routes e implementar NextAuth.js

---

## 📚 Comandos Úteis

```bash
# Gerar secret
npm run generate-secret

# Gerar Prisma Client
npm run db:generate

# Criar migration
npm run db:migrate

# Aplicar migrations (produção)
npm run db:migrate:deploy

# Visualizar banco
npm run db:studio

# Seed (dados iniciais)
npm run db:seed
```

---

## 🆘 Problemas?

Veja o guia completo: `SUPABASE_SETUP.md`
