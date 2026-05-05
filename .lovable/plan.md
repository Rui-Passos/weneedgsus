## Problema

A página `/reset-password` fica eternamente em "A validar link..." porque o listener de auth é registado **depois** de o Supabase já ter processado o URL de recuperação, e o evento de recuperação perde-se.

## Correção

### 1. `src/pages/ResetPassword.tsx` — deteção robusta da sessão de recuperação

Substituir a lógica atual por uma que:

- Lê o `window.location.hash` e `window.location.search` no início e deteta `type=recovery`, `access_token` ou `code`.
- Se houver `code` (fluxo PKCE), chama `supabase.auth.exchangeCodeForSession(code)` explicitamente.
- Se houver hash com `access_token` + `refresh_token`, chama `supabase.auth.setSession({ access_token, refresh_token })` como fallback.
- Faz polling curto de `getSession()` (até 3s) para apanhar a sessão depois do processamento automático.
- Se nada disto resultar em sessão válida, mostra mensagem de erro **clara** com link para pedir novo email — em vez de ficar preso.
- Mantém o listener `onAuthStateChange` como rede de segurança.

### 2. Pequeno polish

- Adicionar mensagem de erro visível com botão "Pedir novo link" (vai para `/forgot-password`) quando o link expirou ou é inválido.
- Limpar o hash do URL após processar com sucesso (`window.history.replaceState`) para evitar reprocessamento.

### 3. Aviso de console (opcional, mesmo PR)

O aviso "Function components cannot be given refs" vem de `<Input>` em `Auth.tsx` e `ForgotPassword.tsx`. Já estamos a usar o componente shadcn `Input` que é `forwardRef`, por isso o aviso é provavelmente de outro elemento — verificar e corrigir se trivial; caso contrário, deixar para depois (não bloqueia a funcionalidade).

## Detalhes técnicos

```text
Fluxo do link de email
──────────────────────
Email link → /reset-password?code=XXX  (ou #access_token=...&type=recovery)
                ↓
        ResetPassword monta
                ↓
   Detetar parâmetros no URL
                ↓
   ┌─ tem code? ──→ exchangeCodeForSession(code)
   ├─ tem hash?  ──→ setSession({access, refresh})  (fallback)
   └─ nada?      ──→ mostrar erro "link inválido"
                ↓
        ready = true → mostra form
```

## Como testar

1. Ir a `/forgot-password`, pedir email para `passos.rui@gmail.com`.
2. Abrir email, clicar no link.
3. Deve carregar o form "Nova palavra-passe" em < 2s.
4. Definir nova password → redireciona para `/admin`.

## Ficheiros alterados

- `src/pages/ResetPassword.tsx` (reescrita da lógica de inicialização)
