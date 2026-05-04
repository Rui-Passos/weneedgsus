
## 1. Tornar o seu acesso admin (passos.rui@gmail.com)

Crio a sua conta e atribuo o role `admin` por SQL diretamente:
- Cria utilizador `passos.rui@gmail.com` em `auth.users` com email já confirmado e palavra-passe inicial **temporária** que vou pedir-lhe para definir no próximo passo (ver questão abaixo).
- Insere linha em `public.user_roles` com role `admin`.

Assim que entrar pela primeira vez, deve trocar a password (ver ponto 3).

## 2. Endurecer a segurança (corrigir os 7 avisos do scan)

Atualmente o site **funciona**, mas o scan revelou pontos a apertar antes de partilhar. Faço uma migração que resolve tudo:

| Problema | Correção |
|---|---|
| Qualquer utilizador autenticado podia inserir-se a si próprio como `admin` (escalada de privilégios) | Adicionar política `INSERT/UPDATE/DELETE` em `user_roles` que exige `has_role(auth.uid(),'admin')`. Primeiro admin é semeado por SQL (ponto 1), nunca pela API. |
| Signup público aberto (qualquer pessoa cria conta) | Desativar signup público em `Auth → Providers` e **remover o tab "Criar conta"** da página `/auth`. Só admins criam novos utilizadores. |
| Bucket `gallery` permite listar todos os ficheiros | Manter leitura pública dos URLs (necessária para a galeria) mas remover a policy de LIST; INSERT/UPDATE/DELETE no bucket só para admin. |
| `has_role` e `handle_new_user` executáveis por anónimos | `REVOKE EXECUTE ... FROM anon, authenticated` e conceder só a `service_role` / uso interno em policies. |
| Política `INSERT` em `contact_submissions` com `WITH CHECK (true)` | Manter (é intencional — formulário público). Adicionar à *security memory* como risco aceite e proteger com **rate limiting** simples (limite por IP via edge function opcional, ou pelo menos validação Zod já existente + honeypot field). |

## 3. Fluxo de Password completo

### a) Definir password inicial
- Página `/auth` mostra apenas **Login** (sem criar conta).
- Adiciono link **"Esqueci-me da palavra-passe"**.

### b) Recuperar password (esqueci-me)
- Nova página `/forgot-password`: formulário com email → `supabase.auth.resetPasswordForEmail(email, { redirectTo: <site>/reset-password })`.
- Nova página `/reset-password` (rota pública): deteta sessão de recovery, mostra campo "nova password" + confirmação, chama `supabase.auth.updateUser({ password })`, redireciona para `/admin`.

### c) Alterar password estando autenticado
- Nova secção no painel admin: **`/admin/account`** com:
  - Mostra email atual.
  - Formulário "Alterar password" (password atual → nova → confirmar). Usa `supabase.auth.updateUser({ password })`.
  - Botão "Terminar sessão em todos os dispositivos" (`signOut({ scope: 'global' })`).
- Adicionar item "Conta" na sidebar admin.

### d) (Opcional, recomendado) Proteção contra passwords fracas
- Ativar **leaked password protection (HIBP)** via `configure_auth` — bloqueia passwords comprovadamente expostas em fugas.

## 4. Demonstração para o João

Sugestão recomendada: **link "Share preview"** do Lovable.

- Vou ao botão **Share → Share preview** no topo do editor → gera um link público válido **7 dias**, sem precisar de conta Lovable. Ideal para enviar pelo Instagram/WhatsApp.
- O João abre no telemóvel, navega no site real, e envia-lhe sugestões.
- O `/admin` continua protegido por login, por isso ele só vê a parte pública.

Alternativas, caso queira algo mais permanente:
- **Publicar** (botão Publish) → fica em `xxx.lovable.app` para sempre. Mais profissional mas qualquer pessoa pode encontrar (mesmo sem partilhar). Recomendo só depois de o João aprovar.
- **Domínio próprio** (ex: `joaodedeus-petsitter.pt`) — comprável dentro do Lovable depois de publicar.

Posso também preparar uma **mensagem-template** em português para enviar ao João via DM no Instagram.

## 5. Resposta direta — "o site fica seguro?"

Depois das correções acima: **sim, para o caso de uso** (site institucional com painel admin para 1 pessoa). Pontos garantidos:
- Só `passos.rui@gmail.com` consegue entrar no `/admin`.
- Ninguém pode auto-promover-se a admin.
- Mensagens de contacto só visíveis ao admin.
- Galeria e textos só editáveis pelo admin.
- Passwords protegidas pelo Supabase (bcrypt) + opcionalmente HIBP.
- Sem signup público.

O único dado público escrito por estranhos é o **formulário de contacto** (intencional). Adicionamos validação + (opcional) honeypot anti-bot.

---

### Decisões que preciso de si antes de implementar:

```text
1. Password inicial: prefere…
   a) Eu defino uma temporária (ex: "PetSitter2026!") e troca no 1º login
   b) Não criar password — envio-lhe email de "definir password" para escolher logo a sua
2. Ativar HIBP (bloqueia passwords vazadas)? Sim/Não
3. Quer já que prepare a mensagem para enviar ao João pelo Instagram?
```
