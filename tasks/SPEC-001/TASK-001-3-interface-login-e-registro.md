# [TASK-001-3] Interface do Usuário — Login e Registro Editorial

- **Spec de Origem:** [SPEC-001: Sistema de Autenticação e Gestão de Sessões](../../specs/SPEC-001-autenticacao.md)
- **Status:** Concluído
- **Responsável:** @equipe-desenvolvimento

---

## 1. Objetivo da Tarefa
Desenvolver a interface visual de autenticação do Controle Financeiro seguindo o padrão *Editorial Swiss Finance*, oferecendo formulários integrados para entrada (login) e criação de conta (registro), feedback de validações e controles de sessão no dashboard.

## 2. Escopo Técnico / Checklist
- [x] Desenvolver o componente `LoginScreen` com visual split:
  - Painel esquerdo institucional com textura de balanço e paleta verde-petróleo (`#0E504C`).
  - Painel direito com formulário responsivo, tipografia editorial e espaçamentos consistentes.
- [x] Implementar alternância dinâmica entre modo "Entrar" e "Criar acesso".
- [x] Adicionar controle de visibilidade da senha (mostrar/ocultar senha com ícone de olho).
- [x] Adicionar validações de preenchimento em tempo real (e-mail, tamanho da senha e igualdade de confirmação).
- [x] Integrar mutations `trpc.auth.login` e `trpc.auth.register` com notificações Sonner (`toast`).
- [x] Adicionar avatar de usuário no header com ação de logout e invalidação de cache tRPC.

## 3. Arquivos Envolvidos
- `client/src/pages/Home.tsx`
- `client/src/components/ui/input.tsx`
- `client/src/components/ui/button.tsx`

## 4. Como Testar / Validar
1. Iniciar o servidor de desenvolvimento (`npm run dev`).
2. Acessar a aplicação deslogado: a tela de login editorial deve ser apresentada.
3. Preencher dados inválidos e validar se as mensagens de erro em vermelho/coral aparecem.
4. Efetuar cadastro ou login e verificar redirecionamento suave para a área logada.
5. Clicar no avatar de usuário no topo para encerrar a sessão e certificar-se do retorno à tela de login.

