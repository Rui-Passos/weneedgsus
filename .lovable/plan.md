# Tornar todo o site editável a partir do admin

## Objetivo
Garantir que tu (e o João) podem editar **todos os textos, imagens, contactos e rodapé** do site público a partir da área de admin, sem mexer em código.

## O que vai mudar

### 1. Conteúdos da página pública passam a ler da base de dados
Atualmente os componentes `Hero`, `About`, `Services`, `InstagramFeed`, `Contact` e `Footer` têm texto e imagens fixas no código. Vão passar todos a ler da tabela `site_content` (que já existe).

Enquanto não houver conteúdo guardado, mostram os valores atuais como predefinição (assim o site nunca aparece vazio).

### 2. Página `/admin/content` reformulada
Em vez do formulário simples atual, passa a ter uma secção por área do site, cada uma com **textos + upload de imagem(ns)**:

- **Hero** (topo): badge, título, subtítulo, texto do botão, foto principal
- **Sobre o João**: título, 2 parágrafos, handle Instagram, foto do João, texto do badge "+5 anos"
- **Serviços**: título e subtítulo da secção + lista editável de serviços (adicionar/remover/reordenar, cada um com ícone escolhido de uma lista, título, descrição, imagem)
- **Instagram**: handle, descrição + 6 imagens de preview (upload)
- **Contactos**: email, telemóvel, WhatsApp, morada/zona
- **Rodapé**: nome a mostrar, link Instagram, texto do copyright

### 3. Nova bucket de storage `site-images`
Para guardar todas as imagens das secções (separada da `gallery` que é só para a galeria pública). Pública para leitura, só admins podem fazer upload.

### 4. Seed inicial
Carrego em `site_content` os textos e URLs de imagens atuais como ponto de partida — assim quando abrires `/admin/content` já vês tudo preenchido e só editas o que quiseres mudar.

## Detalhes técnicos

- **Sem alterações de schema** na tabela `site_content` (já é `jsonb`, dá para guardar qualquer estrutura). Acrescento apenas as novas chaves: `hero`, `about`, `services`, `instagram`, `contact`, `footer`.
- **Migração**: criar bucket `site-images` (pública) + 3 policies (insert/update/delete só para admins, select público).
- **Hook novo `useSiteContent(sectionKey)`**: lê da tabela com fallback para defaults — usado por todos os componentes públicos.
- **`AdminContent.tsx`** reescrito com tabs (uma por secção), incluindo um sub-componente `ImageUploader` reutilizável que faz upload para `site-images` e devolve URL pública.
- **Editor de serviços**: lista com drag-to-reorder simples (botões ↑↓), botão "Adicionar serviço", seletor de ícone a partir de ~12 ícones lucide pré-selecionados (PawPrint, Footprints, Home, Hotel, Heart, etc.).
- **Componentes a editar**: `Hero.tsx`, `About.tsx`, `Services.tsx`, `InstagramFeed.tsx`, `Contact.tsx`, `Footer.tsx` — cada um passa a usar o hook.
- **Sem alterações** ao fluxo de auth, marcações, relatórios, galeria ou utilizadores.

## Resultado
Depois disto, qualquer pessoa com acesso de admin consegue mudar 100% do conteúdo visível do site (texto e imagens) sem editar código.