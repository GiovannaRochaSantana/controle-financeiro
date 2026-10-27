# [TASK-001-1] Modelagem no Banco e Criptografia com Scrypt

- **Spec de Origem:** [SPEC-001: Sistema de Autenticação e Gestão de Sessões](../../specs/SPEC-001-autenticacao.md)
- **Status:** Concluído
- **Responsável:** @equipe-desenvolvimento

---

## 1. Objetivo da Tarefa
Definir o esquema da tabela `users` no Drizzle ORM e implementar funções utilitárias para hashing e validação segura de senhas usando `scrypt` com salt individual e proteção contra timing attacks.

## 2. Escopo Técnico / Checklist
- [x] Criar/atualizar tabela `users` em `drizzle/schema.ts` com colunas:
  - `id`, `openId`, `name`, `email`, `passwordHash`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`.
- [x] Implementar função `hashPassword(password)` gerando salt criptográfico de 16 bytes e derivação de 64 bytes via `scryptSync`.
- [x] Implementar função `verifyPassword(password, storedHash)` usando `timingSafeEqual`.
- [x] Criar testes unitários em `server/auth.password.test.ts`.

## 3. Arquivos Envolvidos
- `drizzle/schema.ts`
- `server/routers.ts`
- `server/auth.password.test.ts`

## 4. Como Testar / Validar
Executar os testes de criptografia de senha via Vitest:
```bash
npx vitest run server/auth.password.test.ts
```
Todos os casos devem passar com sucesso validando unicidade de salt e proteção contra senhas incorretas.

