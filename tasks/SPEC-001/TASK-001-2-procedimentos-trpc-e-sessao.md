# [TASK-001-2] Procedimentos tRPC de Autenticação e Sessão

- **Spec de Origem:** [SPEC-001: Sistema de Autenticação e Gestão de Sessões](../../specs/SPEC-001-autenticacao.md)
- **Status:** Concluído
- **Responsável:** @equipe-desenvolvimento

---

## 1. Objetivo da Tarefa
Implementar os procedimentos tRPC para registro (`auth.register`), login (`auth.login`), consulta de sessão atual (`auth.me`) e encerramento de sessão (`auth.logout`), além de proteger os procedimentos de movimentação financeira.

## 2. Escopo Técnico / Checklist
- [x] Configurar schemas de validação Zod para login (`credentialsSchema`) e registro (`registerSchema`).
- [x] Implementar procedure `auth.register` com validação de unicidade de e-mail e emissão de cookie de sessão.
- [x] Implementar procedure `auth.login` com verificação de credenciais e emissão de cookie de sessão.
- [x] Implementar procedure `auth.logout` para invalidação de cookies no navegador do usuário.
- [x] Implementar procedure `auth.me` para expor o usuário autenticado sem vazar campos sensíveis (`passwordHash`).
- [x] Assegurar proteção com `protectedProcedure` nas rotas financeiras (`transactions` e `savings`).
- [x] Criar testes unitários para logout e proteção de rotas financeiras.

## 3. Arquivos Envolvidos
- `server/routers.ts`
- `server/db.ts`
- `server/auth.logout.test.ts`
- `server/finance.auth.test.ts`

## 4. Como Testar / Validar
Executar os testes de tRPC de autenticação:
```bash
npx vitest run server/auth.logout.test.ts server/finance.auth.test.ts
```

