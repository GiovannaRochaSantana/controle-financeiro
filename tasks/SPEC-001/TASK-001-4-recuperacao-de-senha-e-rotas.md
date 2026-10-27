# [TASK-001-4] Roteamento Dedicado e Fluxo de Recuperação de Senha

- **Spec de Origem:** [SPEC-001: Sistema de Autenticação e Gestão de Sessões](../../specs/SPEC-001-autenticacao.md)
- **Status:** A Fazer
- **Responsável:** @equipe-desenvolvimento

---

## 1. Objetivo da Tarefa
Evoluir o sistema de autenticação separando as telas de login e registro em rotas explícitas no `wouter` (ex.: `/login`, `/register`) e implementar o fluxo completo de "Esqueci minha senha" com geração de token temporário e redefinição de credencial.

## 2. Escopo Técnico / Checklist
- [ ] Criar rotas dedicadas no `wouter` em `client/src/App.tsx`:
  - `/login`: rota pública para login.
  - `/register`: rota pública para novo usuário.
  - Redirecionar rotas protegidas para `/login` quando o usuário não estiver autenticado.
- [ ] Adicionar suporte a tokens de redefinição de senha:
  - Tabela ou campo com token com tempo de expiração curto (ex.: 15 a 30 minutos).
- [ ] Criar procedure tRPC `auth.requestPasswordReset` para envio do link/código.
- [ ] Criar procedure tRPC `auth.resetPassword` para atualizar a senha com o token válido.
- [ ] Implementar a tela de solicitação e redefinição de senha no frontend com identidade *Editorial Swiss Finance*.
- [ ] Cobrir os novos fluxos com testes unitários em `server/auth.reset.test.ts`.

## 3. Arquivos Envolvidos
- `client/src/App.tsx`
- `client/src/pages/Login.tsx` (a ser criado a partir de `LoginScreen`)
- `client/src/pages/ResetPassword.tsx` (a ser criado)
- `server/routers.ts`
- `drizzle/schema.ts`

## 4. Como Testar / Validar
1. Acessar `/login` diretamente e confirmar renderização da tela.
2. Clicar em "Esqueci minha senha" e solicitar redefinição.
3. Usar o token gerado para trocar a senha.
4. Efetuar login com a nova senha e validar acesso ao painel.

