# 🛠️ Scripts de Manutenção do Banco de Dados

Este documento descreve os scripts disponíveis para gerenciar o banco de dados.

## 📋 Scripts Disponíveis

### 1. Criar Usuário Admin
```bash
npm run create-admin
```
Cria o usuário administrador padrão:
- **Email:** admin@solarsystem.com
- **Senha:** admin123
- **Role:** ADMIN

### 2. Popular Equipamentos
```bash
npm run db:seed-equipment
```
Popula o banco com equipamentos solares:
- 4 Módulos solares (Canadian Solar, Jinko, Trina, JA Solar)
- 4 Inversores (Growatt, Fronius, Solis, Huawei)
- 3 Baterias (BYD, Tesla, LG Chem)
- 2 Otimizadores (SolarEdge, Tigo)

### 3. Limpar Duplicatas
```bash
npm run db:cleanup
```
Remove empresas duplicadas, mantendo apenas a mais antiga de cada nome.

### 4. Reset Completo do Banco
```bash
npm run db:reset
```
**⚠️ CUIDADO:** Remove TODOS os dados mockup:
- Notificações
- Atividades de clientes
- Cards e colunas do board
- Boards
- Propostas
- Clientes
- Membros de empresas
- Empresas
- Sessões e accounts do NextAuth
- Usuários (exceto admin)

**Mantém:**
- Usuário admin
- Equipamentos (módulos, inversores, baterias, otimizadores)

### 5. Setup Completo (Recomendado para começar do zero)
```bash
npm run db:reset && npm run db:seed-equipment
```
Reseta o banco e popula com equipamentos.

## 🔄 Workflow Recomendado

### Para Desenvolvimento Local:
1. Clone o repositório
2. Configure o `.env` com a `DATABASE_URL` do Supabase
3. Execute: `npm install`
4. Execute: `npx prisma db push` (cria as tabelas)
5. Execute: `npm run create-admin` (cria usuário admin)
6. Execute: `npm run db:seed-equipment` (popula equipamentos)
7. Execute: `npm run dev`
8. Acesse: http://localhost:3000

### Para Limpar Dados de Teste:
```bash
npm run db:reset && npm run db:seed-equipment
```

## 🔐 Credenciais Padrão

Após executar `create-admin`:
- **Email:** admin@solarsystem.com
- **Senha:** admin123

## 📝 Notas

- Todos os scripts usam o driver `pg` nativo do PostgreSQL
- A conexão é feita via `DATABASE_URL` do arquivo `.env`
- Os scripts são seguros e incluem tratamento de erros
- Use `db:reset` com cuidado em produção!
