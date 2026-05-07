# 🗄️ Setup do Banco de Dados PostgreSQL

Este guia mostra como configurar o PostgreSQL para o projeto SolarSystem.

## 📋 Opções de Banco de Dados

### Opção 1: PostgreSQL Local (Desenvolvimento)

#### Windows

1. **Baixar PostgreSQL**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador (versão 14 ou superior)
   - Execute o instalador

2. **Durante a instalação:**
   - Porta padrão: `5432`
   - Usuário: `postgres`
   - Senha: escolha uma senha (ex: `postgres`)
   - Marque para instalar pgAdmin 4 (interface gráfica)

3. **Criar o banco de dados:**
   ```bash
   # Abra o terminal e conecte ao PostgreSQL
   psql -U postgres
   
   # Dentro do psql, crie o banco
   CREATE DATABASE solarsystem;
   
   # Saia do psql
   \q
   ```

4. **Configurar .env:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solarsystem"
   ```

#### macOS

```bash
# Instalar via Homebrew
brew install postgresql@14

# Iniciar o serviço
brew services start postgresql@14

# Criar banco de dados
createdb solarsystem

# Configurar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solarsystem"
```

#### Linux (Ubuntu/Debian)

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco de dados
sudo -u postgres createdb solarsystem

# Configurar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solarsystem"
```

---

### Opção 2: Supabase (Cloud - Grátis)

1. **Criar conta:**
   - Acesse: https://supabase.com
   - Crie uma conta gratuita

2. **Criar projeto:**
   - Clique em "New Project"
   - Nome: `solarsystem`
   - Database Password: escolha uma senha forte
   - Region: escolha a mais próxima

3. **Obter connection string:**
   - Vá em Settings → Database
   - Copie a "Connection string" (modo URI)
   - Substitua `[YOUR-PASSWORD]` pela senha que você criou

4. **Configurar .env:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

---

### Opção 3: Railway (Cloud - Grátis)

1. **Criar conta:**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar projeto:**
   - New Project → Provision PostgreSQL
   - Aguarde a criação

3. **Obter connection string:**
   - Clique no serviço PostgreSQL
   - Vá em "Connect" → "Postgres Connection URL"
   - Copie a URL

4. **Configurar .env:**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/railway"
   ```

---

### Opção 4: Neon (Cloud - Grátis)

1. **Criar conta:**
   - Acesse: https://neon.tech
   - Crie uma conta gratuita

2. **Criar projeto:**
   - New Project
   - Nome: `solarsystem`
   - Region: escolha a mais próxima

3. **Obter connection string:**
   - Dashboard → Connection Details
   - Copie a "Connection string"

4. **Configurar .env:**
   ```env
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
   ```

---

## 🚀 Após Configurar o Banco

### 1. Gerar Prisma Client

```bash
npx prisma generate
```

### 2. Criar as tabelas (Migration)

```bash
npx prisma migrate dev --name init
```

Este comando irá:
- Criar todas as tabelas no banco de dados
- Gerar o Prisma Client
- Aplicar o schema

### 3. (Opcional) Seed com dados iniciais

```bash
npx prisma db seed
```

### 4. Visualizar o banco (Prisma Studio)

```bash
npx prisma studio
```

Abre uma interface web em `http://localhost:5555` para visualizar e editar dados.

---

## 🔧 Comandos Úteis

```bash
# Ver status das migrations
npx prisma migrate status

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Atualizar schema após mudanças
npx prisma migrate dev --name nome_da_mudanca

# Gerar apenas o client (sem migration)
npx prisma generate

# Formatar schema.prisma
npx prisma format

# Validar schema
npx prisma validate
```

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

**Solução:**
1. Verifique se o PostgreSQL está rodando
2. Confirme usuário, senha e porta no `.env`
3. Teste a conexão:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Erro: "SSL connection required"

**Solução:** Adicione `?sslmode=require` na connection string:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Erro: "Database does not exist"

**Solução:** Crie o banco manualmente:
```bash
createdb solarsystem
# ou
psql -U postgres -c "CREATE DATABASE solarsystem;"
```

### Erro: "Port 5432 already in use"

**Solução:** Outro serviço está usando a porta. Mude a porta no PostgreSQL ou use outra porta:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/solarsystem"
```

---

## 📊 Estrutura do Banco

O schema Prisma cria as seguintes tabelas:

- **users** - Usuários do sistema
- **accounts** - Contas OAuth (NextAuth)
- **sessions** - Sessões ativas
- **companies** - Empresas/organizações
- **company_members** - Membros de empresas
- **clients** - Clientes (leads, prospects)
- **client_activities** - Histórico de atividades dos clientes
- **proposals** - Propostas comerciais
- **boards** - Boards Kanban
- **columns** - Colunas dos boards
- **cards** - Cards dos boards
- **notifications** - Notificações dos usuários
- **modules** - Catálogo de módulos solares
- **inverters** - Catálogo de inversores
- **batteries** - Catálogo de baterias
- **optimizers** - Catálogo de otimizadores

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**

1. **Nunca commite o arquivo `.env`** (já está no `.gitignore`)
2. Use senhas fortes em produção
3. Gere um `NEXTAUTH_SECRET` único:
   ```bash
   openssl rand -base64 32
   ```
4. Em produção, use SSL/TLS para conexões com o banco

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Supabase Docs](https://supabase.com/docs)
