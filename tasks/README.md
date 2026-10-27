# Tarefas (Tasks)

Esta pasta contém as tarefas acionáveis de implementação derivadas das especificações em `/specs`.

## Relação 1:N (1 Spec -> Múltiplas Tasks)
Como **uma spec pode ter mais de uma task**, as tarefas são agrupadas preferencialmente por subpastas com o ID da spec de origem:

```text
tasks/
  ├── README.md
  ├── TEMPLATE.md
  └── SPEC-001/
      ├── TASK-001-1-modelagem-banco.md
      ├── TASK-001-2-endpoints-api.md
      └── TASK-001-3-interface-usuario.md
```

## Padrão de Nomenclatura
- **Pasta da spec:** `tasks/SPEC-XXX/`
- **Arquivo da task:** `TASK-XXX-Y-nome-da-tarefa.md`
  - `XXX`: Identificador da especificação vinculada (ex: `001`)
  - `Y`: Sequencial da tarefa dentro daquela especificação (ex: `1`, `2`, `3`...)

## Estrutura de uma Task
Para criar uma nova tarefa, use como base o arquivo [`TEMPLATE.md`](./TEMPLATE.md).

