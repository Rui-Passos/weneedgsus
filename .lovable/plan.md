# CMS com Admin para o site do João de Deus

## Objetivo
Criar um painel `/admin` protegido por login onde só utilizadores com role `admin` conseguem gerir:
- Fotos e vídeos da galeria (upload, editar legenda, reordenar, apagar)
- Textos editáveis das secções (Hero, Sobre, Serviços, etc.)
- Pedidos de contacto recebidos (ver lista)

## Arquitectura de Segurança

Vou usar o padrão recomendado de **roles em tabela separada** (nunca no profile) para evitar escalada de privilégios:

- `profiles` — dados básicos do utilizador
- `user_roles` — atribuição de roles (`admin`, `user`) com enum `app_role`
- Função `has_role(user_id, role)` SECURITY DEFINER para usar em RLS sem recursão
- Trigger automático cria profile no signup
- **Signup público fica desativado** — só o primeiro utilizador (seed) ou um admin existente pode promover outros a admin (via SQL/painel)

## Mudanças na Base de Dados

1. Enum `app_role` (`admin`, `user`)
2. Tabela `profiles` (id → auth.users, email, display_name)
3. Tabela `user_roles` (user_id, role)
4. Função `has_role()` SECURITY DEFINER
5. Trigger `handle_new_user` para auto-criar profile
6. Nova tabela `site_content` — chave/valor JSON com textos editáveis por secção (`hero`, `about`, `services`, `instagram`, `contact`)
   - RLS: leitura pública, escrita só admin
7. Atualizar RLS de `gallery_items` — escrita restringida a `admin` (em vez de qualquer authenticated)
8. Adicionar RLS de leitura em `contact_submissions` — só admin pode ver
9. RLS em storage bucket `gallery` — upload/delete só admin

## Autenticação

- Página `/auth` com login email+password (sem signup público)
- Hook `useAuth` com listener `onAuthStateChange` + `getSession`
- Hook `useIsAdmin` consulta `user_roles`
- Componente `AdminRoute` que redireciona não-admins para `/auth`
- `emailRedirectTo` configurado e auto-confirm activado para evitar fricção (o utilizador é só o João)

## Painel `/admin`

Layout com sidebar (Shadcn) e 4 secções:

```text
┌─────────────────────────────────────┐
│ Sidebar         │  Conteúdo         │
│  • Galeria      │                   │
│  • Conteúdos    │                   │
│  • Mensagens    │                   │
│  • Sair         │                   │
└─────────────────────────────────────┘
```

### Galeria (`/admin/gallery`)
- Upload drag-and-drop para o bucket `gallery` (imagens e vídeos)
- Grelha com preview, campo de legenda editável, botão apagar
- Reordenar via campo `display_order`

### Conteúdos (`/admin/content`)
- Formulário com campos para cada texto editável:
  - Hero: título, subtítulo, texto do botão
  - Sobre: título, parágrafos
  - Serviços: título de cada card, descrição
  - Instagram: handle, descrição
- Guarda em `site_content` (linha por chave)

### Mensagens (`/admin/messages`)
- Tabela com pedidos de contacto recebidos (nome, telefone, tipo de pet, datas, mensagem, data)
- Ordenado por mais recente

## Frontend Público
- Componentes da landing passam a ler `site_content` via `useQuery` com fallback para os textos atuais (para nada partir se a tabela estiver vazia)
- A galeria já lê do Supabase, fica igual

## Setup do primeiro Admin
Depois de aplicar a migração, o utilizador cria a sua conta em `/auth` (vou activar signup temporariamente apenas até existir o primeiro admin — alternativa: pedir email e promover via SQL). Recomendo:
1. Ativar auto-confirm de email
2. Mostrar `/auth` com formulário de signup+login
3. Após o João criar conta, corro SQL para lhe atribuir role `admin`
4. (Opcional futuro) Desactivar signup público

## Stack Técnica
- Shadcn: Sidebar, Form, Table, Dialog, Tabs, Input, Textarea, Button
- React Router: rotas `/auth`, `/admin`, `/admin/gallery`, `/admin/content`, `/admin/messages`
- React Query para data fetching e cache
- Zod para validação
- Toast para feedback

## Ficheiros a criar
- `src/hooks/useAuth.tsx`, `src/hooks/useIsAdmin.tsx`
- `src/pages/Auth.tsx`, `src/pages/admin/AdminLayout.tsx`, `AdminGallery.tsx`, `AdminContent.tsx`, `AdminMessages.tsx`
- `src/components/admin/AdminSidebar.tsx`, `ProtectedRoute.tsx`
- Migração SQL com tudo acima
