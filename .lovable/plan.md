## Diagnóstico

Confirmei na base de dados: **a sua conta JÁ tem o role `admin`** (`passos.rui@gmail.com` → role `admin`). O problema está no frontend.

No `src/hooks/useAuth.tsx`, o `loading` passa a `false` **assim que a sessão é obtida**, sem esperar pela verificação do role admin (que é assíncrona). Resultado:

1. Login bem-sucedido → `loading=false`, `isAdmin=false` (ainda a verificar).
2. `AdminLayout` renderiza, vê `!isAdmin` e mostra "Sem acesso".
3. Milissegundos depois `isAdmin` passa a `true`, mas só se o utilizador navegar/recarregar.

## Correção

Em `src/hooks/useAuth.tsx`:

- Esperar pela conclusão de `checkAdmin()` antes de pôr `loading=false` (no `getSession` inicial e no `onAuthStateChange`).
- Manter `loading=true` durante a re-verificação no evento de auth para que o `AdminLayout` continue a mostrar "A carregar..." em vez do ecrã de "Sem acesso".

## Como testar

1. Recarregar `/admin` — deve entrar diretamente.
2. Logout + login novamente — deve ir direto para `/admin/gallery` sem ver "Sem acesso".

## Ficheiros alterados

- `src/hooks/useAuth.tsx`
