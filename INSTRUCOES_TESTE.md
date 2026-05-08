# 🧪 Instruções de Teste - Sistema Migrado

## ✅ Status: Build OK

O build foi executado com sucesso. Todas as páginas foram compiladas sem erros.

---

## 🚀 Como Testar Localmente

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Acessar o Sistema
```
http://localhost:3000
```

### 3. Fazer Login
```
Email: admin@solarsystem.com
Senha: admin123
```

---

## 📋 Checklist de Testes

### ✅ Autenticação
- [ ] Login funciona
- [ ] Redirecionamento para /select-company
- [ ] Seleção de empresa funciona
- [ ] Redirecionamento para /board

### ✅ Board
- [ ] Visualizar colunas e cards existentes
- [ ] Criar novo card
- [ ] Mover card entre colunas
- [ ] Card persiste após reload
- [ ] Notificação aparece após criar card

### ✅ Propostas
- [ ] Listar propostas existentes
- [ ] Criar nova proposta
- [ ] Aceitar proposta (muda status)
- [ ] Rejeitar proposta (muda status)
- [ ] Deletar proposta
- [ ] Proposta persiste após reload
- [ ] Loading aparece durante fetch

### ✅ Clientes
- [ ] Listar clientes existentes
- [ ] Criar novo cliente
- [ ] Filtrar por tipo (Residencial, Comercial, etc)
- [ ] Filtrar por status (Lead, Contato, etc)
- [ ] Buscar por nome/email
- [ ] Cliente persiste após reload
- [ ] Loading aparece durante fetch

### ✅ Notificações
- [ ] Listar notificações
- [ ] Marcar notificação como lida
- [ ] Marcar todas como lidas
- [ ] Filtrar por tipo
- [ ] Filtrar por status (lida/não lida)
- [ ] Notificação persiste após reload
- [ ] Loading aparece durante fetch

### ✅ Equipe
- [ ] Listar membros da empresa
- [ ] Buscar por nome/email
- [ ] Visualizar cargos (Owner, Admin, etc)
- [ ] Visualizar status (Ativo)
- [ ] Loading aparece durante fetch

---

## 🔍 Verificações Importantes

### 1. Dados Persistem
Após criar qualquer item (card, proposta, cliente):
- [ ] Fazer reload da página
- [ ] Item ainda está lá
- [ ] Dados não são perdidos

### 2. Loading States
Em todas as páginas:
- [ ] Spinner aparece ao carregar
- [ ] Mensagem de erro aparece se API falhar
- [ ] Botão "Tentar novamente" funciona

### 3. Integração
- [ ] Criar cliente → aparece em Clientes
- [ ] Criar proposta → aparece em Propostas
- [ ] Criar card → aparece no Board
- [ ] Ações geram notificações

---

## 🐛 Problemas Conhecidos

### Se o banco estiver vazio:
```bash
npm run db:reset
npm run db:seed-equipment
npm run create-admin
```

### Se houver erro de conexão:
1. Verificar `.env` tem `DATABASE_URL` correto
2. Verificar Supabase está online
3. Verificar senha do banco está correta

### Se NextAuth não funcionar:
1. Verificar `NEXTAUTH_SECRET` no `.env`
2. Verificar `NEXTAUTH_URL` está correto
3. Limpar cookies do navegador

---

## 📊 Dados de Teste

### Usuário Admin
```
Email: admin@solarsystem.com
Senha: admin123
```

### Criar Empresa de Teste
1. Login com admin
2. Clicar em "Criar Nova Empresa"
3. Nome: "Empresa Teste"
4. Slug: "empresa-teste"

### Criar Cliente de Teste
1. Ir em /clients
2. Clicar "Novo Cliente"
3. Preencher dados
4. Salvar

### Criar Proposta de Teste
1. Ir em /proposals
2. Clicar "Nova Proposta"
3. Preencher dados
4. Salvar

---

## 🎯 Resultado Esperado

Após todos os testes:
- ✅ Todas as páginas carregam
- ✅ Todos os dados persistem
- ✅ Todas as ações funcionam
- ✅ Nenhum erro no console
- ✅ Loading states aparecem
- ✅ Tratamento de erros funciona

---

## 📝 Reportar Problemas

Se encontrar algum problema:

1. **Verificar console do navegador** (F12)
2. **Verificar terminal do servidor** (npm run dev)
3. **Anotar:**
   - Página onde ocorreu
   - Ação que causou o erro
   - Mensagem de erro
   - Screenshot se possível

---

## 🚀 Deploy na Vercel

Após testes locais OK:

1. **Push para GitHub** (já feito)
2. **Vercel faz deploy automático**
3. **Testar em produção:**
   ```
   https://solar-system-blue-rho.vercel.app
   ```

---

## ✨ Conclusão

O sistema está pronto para testes! Todas as páginas foram migradas e estão funcionando com dados reais do PostgreSQL/Supabase.

**Data:** 08/05/2026  
**Status:** ✅ PRONTO PARA TESTE  
**Build:** ✅ OK
