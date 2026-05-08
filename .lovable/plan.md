# Plano: Registo de admins + Relatórios financeiros

## 1. Registo aberto com aprovação

**Fluxo**
- Em `/auth`, adicionar separador **"Criar conta"** ao lado de "Entrar" (email + password + nome).
- Após registo, o utilizador fica autenticado mas **sem role de admin** → ao tentar entrar em `/admin` vê uma nova mensagem: *"Conta criada. A aguardar aprovação do administrador."* (em vez do "Sem acesso" atual).
- Criar nova página **`/admin/utilizadores`** (visível só para ti) com a lista de todos os utilizadores registados, mostrando: nome, email, data de registo, estado (admin / pendente). Botões para **Tornar admin** e **Remover admin**.
- Notificação visual no menu lateral (badge) quando houver utilizadores pendentes.

## 2. Preços nas marcações

Adicionar campo **`price`** (valor em €) à tabela `bookings`. No formulário de criar/editar marcação passa a haver um campo "Valor (€)". Mostrado também na tabela existente.

## 3. Dashboard no topo de Marcações

4 cards rápidos acima da tabela:
- Marcações este mês (contagem)
- Faturado este mês (soma de `price` de marcações concluídas)
- Pendentes / Confirmadas (contagem)
- Total faturado no ano

## 4. Nova página Relatórios (`/admin/relatorios`)

Filtros no topo (todos combináveis):
- **Intervalo de datas** (de / até, com date pickers)
- **Estado** (pendente / confirmada / concluída / cancelada / todas)
- **Serviço** (dropdown com os serviços que existirem nas marcações)
- **Tipo de pet**

Resultados:
- **KPIs**: nº de marcações, total faturado, ticket médio
- **Gráfico de barras**: faturação por mês no período escolhido
- **Gráfico circular**: distribuição por serviço
- **Tabela detalhada** com todas as marcações que passam nos filtros

Botão **"Exportar PDF"** no canto superior direito → gera PDF com cabeçalho (Casa do Cão + período + filtros aplicados), KPIs, gráficos renderizados como imagens, e a tabela detalhada. Descarrega como `relatorio-YYYY-MM-DD.pdf`.

---

## Detalhes técnicos

**Base de dados (migração)**
- `ALTER TABLE bookings ADD COLUMN price numeric(10,2)`
- Sem alterações a roles/RLS (já existem políticas admin).

**Frontend**
- `src/pages/Auth.tsx` — adicionar tabs Login/Registo usando shadcn Tabs.
- `src/hooks/useAuth.tsx` — distinguir "não autenticado" vs "autenticado sem role" para mostrar mensagem certa.
- `src/pages/admin/AdminUsers.tsx` (novo) — lista profiles + user_roles, botões para promover/despromover.
- `src/pages/admin/AdminBookings.tsx` — adicionar campo preço no form e coluna na tabela; cards de resumo no topo.
- `src/pages/admin/AdminReports.tsx` (novo) — filtros, KPIs, charts (recharts já disponível), botão exportar.
- `src/pages/admin/AdminLayout.tsx` + `src/App.tsx` — registar rotas `/admin/utilizadores` e `/admin/relatorios`.

**Exportação PDF**
- Usar `jspdf` + `html2canvas` (capturar a área de relatório já renderizada → embeber no PDF). Alternativa mais limpa: `jspdf` + `jspdf-autotable` para tabela e capturar só os gráficos como imagem com `html2canvas`. Vou optar por esta segunda abordagem para o PDF ficar com texto pesquisável.

**Confirmação necessária antes de implementar**: a migração adiciona a coluna `price` (nullable, sem default) — marcações antigas ficam sem preço até as editares. OK assim?
