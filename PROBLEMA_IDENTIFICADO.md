# 🔍 Problema Identificado

## Erro Atual
```
Failed to load resource: the server responded with a status of 500 ()
api/companies:1
```

## Causa Raiz

O erro 500 na API `/api/companies` pode ter **3 causas**:

### 1. ❌ Banco de Dados Não Conectado (MAIS PROVÁVEL)
A variável `DATABASE_URL` não está configurada ou está incorreta.

**Solução:**
```env
# .env.local
DATABASE_URL="postgresql://user:password@host/database"
```

### 2. ❌ Usuário Não Logado
Você está acessando `/select-company` sem ter feito login, então não há `userId` no localStorage.

**Solução:**
- Acesse `/register` primeiro
- Ou acesse `/login`

### 3. ❌ Prisma Client Não Gerado
O Prisma Client pode não ter sido gerado corretamente.

**Solução:**
```bash
npx prisma generate
```

---

## 🔧 Como Resolver

### Passo 1: Verificar Banco de Dados

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Neon Database (Recomendado)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Ou Supabase
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### Passo 2: Executar Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### Passo 3: Reiniciar Servidor

```bash
npm run dev
```

### Passo 4: Testar

1. Acesse `http://localhost:3000/register`
2. Crie uma conta
3. Você será redirecionado para `/board` automaticamente

---

## 🎯 Fluxo Correto

```
1. Usuário acessa /register
   ↓
2. Preenche dados + nome da empresa
   ↓
3. API cria: usuário + empresa + membership + board
   ↓
4. userId e companyId salvos no localStorage
   ↓
5. Redireciona para /board
   ✅ SUCESSO
```

---

## 🚨 Erro Comum

**NÃO acesse `/select-company` diretamente!**

Essa página é para quando você já tem conta e quer trocar de empresa.

**Fluxo correto:**
- Novo usuário → `/register`
- Usuário existente → `/login`

---

## 📝 Verificar Logs

Abra o terminal onde está rodando `npm run dev` e veja o erro completo:

```bash
# Você deve ver algo como:
Error: PrismaClient is unable to connect to the database
# OU
Error: Environment variable not found: DATABASE_URL
```

---

## ✅ Checklist de Verificação

- [ ] Arquivo `.env.local` existe na raiz do projeto
- [ ] `DATABASE_URL` está configurada
- [ ] Banco de dados está acessível
- [ ] `npx prisma generate` foi executado
- [ ] Servidor foi reiniciado após configurar .env
- [ ] Acessou `/register` (não `/select-company`)

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique o console do navegador** (F12)
2. **Verifique o terminal** onde roda `npm run dev`
3. **Teste a conexão do banco:**
   ```bash
   npx prisma db pull
   ```

Se der erro, o problema é a conexão com o banco de dados.

---

## 💡 Dica Rápida

Para testar localmente SEM banco de dados, você pode usar SQLite:

```env
# .env.local
DATABASE_URL="file:./dev.db"
```

Depois execute:
```bash
npx prisma migrate dev
npm run dev
```

Isso cria um banco local para testes.
