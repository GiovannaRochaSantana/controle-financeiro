# Direção de design — Controle financeiro

## Três abordagens consideradas

| Tema | Introdução breve | Probabilidade |
| --- | --- | --- |
| Caderno de Patrimônio | Uma estética de caderno financeiro pessoal, com papel quente, linhas discretas e números muito presentes. Transmite calma e intencionalidade. | 0.07 |
| Balanço Editorial | Um dashboard claro e refinado, inspirado em relatórios financeiros contemporâneos, com uma faixa lateral verde-petróleo e hierarquia tipográfica expressiva. Faz a organização financeira parecer objetiva e acessível. | 0.04 |
| Sinal de Mercado | Uma linguagem mais energética, com blocos densos, alto contraste e acentos em laranja para ressaltar variações. Evoca uma central de acompanhamento em tempo real. | 0.09 |

## Abordagem escolhida: Balanço Editorial

### Movimento de design

**Editorial Swiss Finance**: o rigor funcional do design suíço combinado com o calor de uma ferramenta pessoal de planejamento. A referência enviada orienta a arquitetura — navegação lateral, painéis analíticos, tabelas e cartões de resumo — mas a composição será original.

### Princípios centrais

1. **Números antes de ornamentos**: valores, tendências e próximos passos são os principais elementos de cada tela.
2. **Contraste sereno**: superfícies claras e arejadas se equilibram com uma barra lateral profunda e intencional.
3. **Hierarquia editorial**: títulos em serifada de alto contraste, dados e comandos em sans-serif técnica.
4. **Ações evidentes**: receitas e despesas são adicionadas por ações rápidas, sem poluir o painel.

### Filosofia de cor

O verde-petróleo **#0E504C** ancora a marca como sinal de estabilidade e controle. Um marfim muito frio reduz a fadiga visual de telas financeiras. Verde-água marca entradas e progresso; coral suave, saídas e atenção; dourado apagado dá presença às metas sem parecer promocional.

### Paradigma de layout

Uma **faixa de comando lateral** fixa conduz a navegação. O conteúdo funciona como uma página de relatório: cabeçalho assimétrico, faixas de métricas, painéis analíticos e uma coluna auxiliar para decisões futuras. Não há hero centralizado; a estrutura se organiza por leitura de cima para baixo e da esquerda para a direita.

### Elementos de assinatura

1. **Cápsula de saldo**: um bloco grande de saldo com faixa vertical e microtextos de contexto.
2. **Marcadores contábeis**: pequenos traços coloridos e círculos vazados antes de categorias e valores.
3. **Moldura de mês**: seletor de período em formato de etiqueta editorial, usado nos painéis.

### Filosofia de interação

Cada ação deve comunicar consequência: botões de receita e despesa usam cor semântica e abrem um formulário contextual; filtros reorganizam os dados instantaneamente; a navegação preserva uma sensação de continuidade entre telas.

### Animação

Entradas aparecem em cascata curta, entre 30 e 60 ms por bloco, com opacidade e deslocamento vertical de 6 px. Cartões elevam-se levemente no hover. Gráficos e anéis usam transições discretas de até 300 ms. A preferência por movimento reduzido desativa qualquer animação não essencial.

### Sistema tipográfico

**DM Serif Display** é usada em títulos de página e no saldo principal, dando peso editorial aos dados. **Manrope** atende navegação, rótulos, tabelas e botões, com números tabulares e espaçamento firme. Títulos usam contraste alto; rótulos permanecem pequenos, em caixa alta e com tracking amplo.

### Essência da marca

**Controle financeiro é um painel pessoal para transformar rotina financeira em decisões claras, para quem quer acompanhar cada real sem tratar a própria vida como uma planilha.**

Personalidade: **serena, precisa, encorajadora**.

### Voz da marca

A voz é direta, humana e econômica; ela mostra contexto em vez de prometer transformação vaga. CTAs usam verbos específicos e microcopy explica o impacto imediato.

> “Seu mês está em movimento. Veja para onde ele vai.”

> “Registrar despesa — manter o saldo atualizado.”

### Wordmark e logo

O símbolo será um **monograma abstrato de duas colunas arredondadas e uma linha de balanço**, sugerindo receitas, despesas e equilíbrio; sem texto no ícone. O wordmark no cabeçalho combina a marca em Manrope com peso alto e espaçamento compacto.

### Cor de marca assinatura

**Verde Balanço — #0E504C**.

## Style Decisions

- Em desktop, o trilho lateral verde-petróleo é a âncora de navegação e marca da experiência; ele preserva presença durante a leitura do painel.
- O monograma abstrato e o wordmark compacto são exibidos juntos no trilho principal, reforçando reconhecimento sem competir com os dados.
- Painéis analíticos combinam gráfico, legenda semântica e três indicadores auxiliares; assim, cada área de visualização mantém densidade de relatório e um próximo passo legível.
