# 🔧 Troubleshooting - Conexão com Supabase

## ❌ Erro: "Can't reach database server"

Esse erro pode ter algumas causas. Vamos resolver:

---

## ✅ Solução 1: Usar "Session mode" (Recomendado para Migrations)

O Supabase tem dois modos de conexão:
- **Transaction mode** (pooler) - Para aplicações
- **Session mode** - Para migrations e ferramentas CLI

### Passo a Passo:

1. **Volte para o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/txpepolbvnhseboijslj

2. **Vá em:** Settings → Database

3. **Role até "Connection string"**

4. **Selecione a aba "Session mode"** (não "Transaction mode")

5. **Copie a nova connection string**
   - Deve ter a porta **6543** (não 5432)
   - Exemplo: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

6. **Substitua `[YOUR-PASSWORD]` pela senha:** `Gujjgukk010703!`

7. **Cole no arquivo `.env`:**
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:Gujjgukk010703!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
   ```

8. **Rode novamente:**
   ```bash
   npm run db:migrate
   ```

---

## ✅ Solução 2: Verificar se o Projeto está Ativo

Projetos grátis do Supabase pausam após inatividade.

1. **Acesse:** https://supabase.com/dashboard/project/txpepolbvnhseboijslj
2. **Se aparecer "Paused"**, clique em **"Resume project"**
3. **Aguarde 1-2 minutos**
4. **Tente novamente:**
   ```bash
   npm run db:migrate
   ```

---

## ✅ Solução 3: Usar Connection Pooling URL

1. **No Supabase Dashboard:** Settings → Database
2. **Procure por "Connection Pooling"**
3. **Copie a URL de "Connection pooling"**
4. **Cole no `.env`**
5. **Tente novamente**

---

## ✅ Solução 4: Verificar Firewall/Antivírus

Às vezes o firewall bloqueia conexões:

1. **Desative temporariamente o antivírus/firewall**
2. **Tente a conexão novamente**
3. **Se funcionar**, adicione exceção para Node.js

---

## ✅ Solução 5: Testar Conexão Direta

Vamos testar se consegue conectar:

```bash
# Testar com Prisma
npx prisma db pull
```

Se funcionar, o problema é com as migrations. Nesse caso:

```bash
# Criar migration sem aplicar
npx prisma migrate dev --create-only --name init

# Aplicar manualmente
npx prisma db push
```

---

## 🎯 Qual Connection String Usar?

### Para Migrations (Prisma CLI):
```env
# Session mode (porta 6543)
DATABASE_URL="postgresql://postgres.[REF]:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
```

### Para Aplicação (Runtime):
```env
# Transaction mode (porta 5432) - mais rápido
DATABASE_URL="postgresql://postgres:SENHA@db.txpepolbvnhseboijslj.supabase.co:5432/postgres?sslmode=require"
```

**Dica:** Use Session mode para migrations, depois mude para Transaction mode na aplicação.

---

## 📸 Onde Encontrar no Supabase

1. Dashboard → Seu projeto
2. Settings (engrenagem) → Database
3. Connection string → **Session mode** (para migrations)
4. Copie e substitua a senha

---

## 🆘 Ainda não funciona?

Tente criar as tabelas manualmente via Supabase SQL Editor:

1. **No Supabase:** SQL Editor
2. **Cole o schema SQL** (vou gerar para você)
3. **Execute**

**Me avise qual solução funcionou ou se precisa do SQL manual!** 🚀
