# 🎯 SETUP SUPABASE - FAÇA AGORA!

## ⚡ 5 Passos Rápidos (10 minutos)

### 1️⃣ Criar Projeto Supabase (2 min)

1. Abra: **https://supabase.com**
2. Login com GitHub
3. Clique em **"New Project"**
4. Preencha:
   ```
   Name: solarsystem
   Password: [escolha uma senha forte e ANOTE!]
   Region: South America (São Paulo)
   ```
5. Clique em **"Create new project"**
6. ⏳ Aguarde 2 minutos (projeto sendo criado)

---

### 2️⃣ Copiar Connection String (1 min)

Quando o projeto estiver pronto:

1. Clique em **Settings** (ícone de engrenagem) no menu lateral
2. Clique em **Database**
3. Role até **"Connection string"**
4. Selecione a aba **"URI"**
5. **Copie a string completa**
6. **IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha que você criou

**Exemplo:**
```
ANTES:
postgresql://postgres.abcdefg:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

DEPOIS:
postgresql://postgres.abcdefg:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

### 3️⃣ Gerar NEXTAUTH_SECRET (30 seg)

Abra o terminal no projeto e rode:

```bash
npm run generate-secret
```

**Copie o valor gerado** (algo como: `abc123xyz...`)

---

### 4️⃣ Configurar .env (1 min)

Abra o arquivo `.env` na raiz do projeto e cole:

```env
DATABASE_URL="cole-aqui-a-connection-string-do-supabase"
NEXTAUTH_SECRET="cole-aqui-o-secret-gerado"
NEXTAUTH_URL="http://localhost:3000"
```

**Exemplo completo:**
```env
DATABASE_URL="postgresql://postgres.abcdefg:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="Xy9kL2mN4pQ6rS8tU0vW2xY4zA6bC8dE0fG2hI4jK6lM8nO0pQ2rS4tU6vW8xY0zA="
NEXTAUTH_URL="http://localhost:3000"
```

**Salve o arquivo!**

---

### 5️⃣ Rodar Migrations (2 min)

No terminal, rode os comandos:

```bash
# Gerar Prisma Client
npm run db:generate

# Criar tabelas no Supabase
npm run db:migrate
```

**O que vai acontecer:**
- ✅ Prisma vai conectar no Supabase
- ✅ Criar 16 tabelas (users, clients, proposals, etc.)
- ✅ Aplicar índices e relações

---

## ✅ Verificar se Funcionou

### No Supabase:

1. Volte para o dashboard do Supabase
2. Clique em **"Table Editor"** no menu lateral
3. **Você deve ver 16 tabelas:**
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
npm run db:studio
```

Deve abrir **http://localhost:5555** com todas as tabelas vazias.

---

## 🎉 Pronto!

Agora você tem:
- ✅ Banco PostgreSQL no Supabase (cloud)
- ✅ 16 tabelas criadas
- ✅ Prisma Client configurado
- ✅ Pronto para desenvolvimento

---

## 🚀 Próximo Passo: Configurar Vercel

Para o deploy funcionar, você precisa adicionar as variáveis no Vercel:

1. Acesse: **https://vercel.com/dashboard**
2. Selecione seu projeto: **SolarSystem**
3. Vá em: **Settings → Environment Variables**
4. Adicione:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Cole a connection string do Supabase |
| `NEXTAUTH_SECRET` | Cole o secret gerado |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` |

5. Clique em **"Save"**
6. Faça um novo deploy:
   ```bash
   git add .
   git commit -m "chore: configurar Supabase"
   git push origin main
   ```

---

## 🆘 Problemas?

### Erro: "Can't reach database server"

**Solução:**
1. Verifique se copiou a connection string correta
2. Confirme que substituiu `[YOUR-PASSWORD]` pela senha real
3. Teste:
   ```bash
   npx prisma db pull
   ```

### Erro: "SSL connection required"

**Solução:** Adicione `?sslmode=require` no final da connection string:
```env
DATABASE_URL="postgresql://...postgres?sslmode=require"
```

### Erro no Vercel: "Prisma Client not found"

**Solução:** Já está configurado! O `postinstall` no `package.json` resolve isso.

---

## 📚 Guias Completos

- **[QUICK_START.md](QUICK_START.md)** - Guia rápido
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Guia detalhado
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Todas as opções de banco

---

## 💡 Dica

Depois de configurar, rode:

```bash
npm run dev
```

E acesse: **http://localhost:3000**

**Tudo pronto para continuar o desenvolvimento!** 🎯
