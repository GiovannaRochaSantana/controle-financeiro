# [SPEC-001] Sistema de Autenticação e Gestão de Sessões

- **Status:** Em Implementação / Parcialmente Concluído
- **Data:** 2026-10-27
- **Responsável:** @equipe-desenvolvimento
- **Domínio:** Segurança, Autenticação e Acesso

---

## 1. Contexto e Objetivo
O **Controle Financeiro (Balanço Editorial)** é uma aplicação financeira pessoal que manipula dados sensíveis (transações de receitas/despesas, metas financeiras e reservas). Para garantir a privacidade e integridade dos dados de cada usuário, o sistema exige um mecanismo de autenticação robusto, seguro e com experiência de uso alinhada à identidade visual *Editorial Swiss Finance*.

O objetivo desta especificação é definir a arquitetura de autenticação, o ciclo de vida da sessão, a persistência segura de credenciais e a interface de acesso do usuário.

---

## 2. Requisitos e Regras de Negócio

### 2.1 Modelo de Dados (`users`)
O banco de dados armazena os dados de usuário na tabela `users` (`drizzle/schema.ts`):
- **Identificador primário (`id`):** Inteiro sequencial autoincrementado.
- **Identificador aberto (`openId`):** `varchar(64)` único e não-nulo, padronizado com prefixo `email_<hash_sha256>` para credenciais de e-mail ou identificador de provedor OAuth.
- **Nome (`name`):** Nome de exibição do usuário (mínimo de 2 caracteres no cadastro).
- **E-mail (`email`):** `varchar(320)` único e normalizado (minúsculas, sem espaços extras).
- **Hash da senha (`passwordHash`):** Formato seguro `<salt>:<derivedKey>` gerado via algoritmo `scrypt`. A senha em texto puro **nunca** é gravada.
- **Método de login (`loginMethod`):** Indicador do método (ex.: `'email'`, `'oauth'`).
- **Papel (`role`):** Enumeração `user` ou `admin` (padrão: `user`).
- **Metadados temporais:** `createdAt`, `updatedAt` e `lastSignedIn`.

### 2.2 Criptografia e Segurança de Credenciais
1. **Algoritmo de Derivação:** Uso de `node:crypto.scryptSync` com salt criptográfico aleatório de 16 bytes (`randomBytes(16)`) e chave derivada de 64 bytes.
2. **Prevenção a Timing Attacks:** A checagem de senha deve usar comparação em tempo constante (`timingSafeEqual`).
3. **Formato da Senha:** Mínimo de 6 caracteres no cadastro e login.
4. **Proteção de Dados Sensíveis:** O campo `passwordHash` deve ser omitido de retornos públicos da API (`publicUser`).

### 2.3 Gestão de Sessão e Cookies
1. **Mecanismo:** Token de sessão seguro armazenado em cookie HTTP assinado (`COOKIE_NAME`).
2. **Atributos de Cookie:**
   - `httpOnly: true` (proteção contra acesso indevido por scripts / XSS).
   - `sameSite: "lax"`.
   - `secure: true` em ambiente de produção (HTTPS).
   - Validade de até 1 ano (`maxAge: ONE_YEAR_MS`).
3. **Validação da Sessão:** O middleware de contexto tRPC (`_core/context.ts`) decodifica o cookie e injeta o usuário autenticado em `ctx.user`.
4. **Proteção de Rotas:** Procedimentos de movimentação financeira (`transactions.*`, `savings.*`) utilizam `protectedProcedure`, rejeitando chamadas não autenticadas com erro tRPC `UNAUTHORIZED`.
5. **Encerramento de Sessão (`logout`):** Invalidação do cookie no cliente com `maxAge: -1` e limpeza imediata de cache no frontend.

### 2.4 Interface e Experiência do Usuário (UI/UX)
- **Estética Visual:** Painel dividido com a identidade *Editorial Swiss Finance* (Verde-petróleo `#0E504C`, tipografia `DM Serif Display` nos títulos e `Manrope` nas entradas).
- **Alternância de Modos:** Troca suave e sem recarregamento entre telas de **Login** e **Cadastro**.
- **Validações no Formulário:**
  - E-mail com formato válido.
  - Senha com no mínimo 6 caracteres.
  - No cadastro: validação de nome preenchido e correspondência de confirmação de senha.
  - Exibição de alertas contextuais de erro.
- **Usabilidade:** Botão para alternar visibilidade da senha (ícone de olho).
- **Indicador de Sessão Ativa:** Avatar no topo do painel com as iniciais do usuário e atalho de encerramento de sessão.

---

## 3. Critérios de Aceite

- [x] O usuário consegue criar uma conta com nome, e-mail único e senha válida.
- [x] Tentativa de cadastro com e-mail já existente retorna conflito (`CONFLICT`) com mensagem amigável.
- [x] A senha armazenada no banco é irreversível e utiliza salt individualizado.
- [x] Credenciais incorretas no login retornam `UNAUTHORIZED` sem expor se o e-mail existe.
- [x] Ao efetuar login ou cadastro, o cookie de sessão é gerado e o usuário tem acesso imediato ao painel.
- [x] Ao clicar em logout, o cookie é removido e o painel retorna imediatamente à tela de autenticação.
- [x] Requisições a rotas financeiras sem sessão válida são barradas com código de erro `UNAUTHORIZED`.
- [ ] O fluxo de recuperação de senha por e-mail/token ("Esqueci minha senha") está operacional com envio de link de redefinição.
- [ ] O aplicativo possui rotas dedicadas na URL (`/login` e `/cadastro`) gerenciadas pelo roteador `wouter`.

---

## 4. Tasks Relacionadas

Esta especificação está dividida nas seguintes tarefas de execução:

- [x] [TASK-001-1: Modelagem no Banco e Criptografia com Scrypt](../tasks/SPEC-001/TASK-001-1-modelagem-banco-e-seguranca.md)
- [x] [TASK-001-2: Procedimentos tRPC de Autenticação e Sessão](../tasks/SPEC-001/TASK-001-2-procedimentos-trpc-e-sessao.md)
- [x] [TASK-001-3: Interface do Usuário — Login e Registro Editorial](../tasks/SPEC-001/TASK-001-3-interface-login-e-registro.md)
- [ ] [TASK-001-4: Roteamento Dedicado e Fluxo de Recuperação de Senha](../tasks/SPEC-001/TASK-001-4-recuperacao-de-senha-e-rotas.md)

