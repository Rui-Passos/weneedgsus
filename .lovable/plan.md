Vou tratar as duas coisas em conjunto: primeiro corrigir o bloqueio de acesso ao admin, depois adicionar uma nova área para gerir marcações.

Causa do erro atual

A conta `passos.rui@gmail.com` consegue iniciar sessão, mas a verificação de administrador está a ser bloqueada pela base de dados. O erro real é técnico: a função interna que as regras de segurança usam para confirmar se alguém é admin ficou sem permissão de execução para utilizadores autenticados. Por isso o site interpreta a falha como “sem acesso”, mesmo que a conta tenha o role correto.

Plano de correção

1. Corrigir o acesso ao admin
   - Criar uma migração de base de dados para restaurar a permissão necessária da função interna de verificação de roles.
   - Manter a segurança: a função continua protegida e só devolve verdadeiro/falso para validações de acesso.
   - Confirmar que `passos.rui@gmail.com` continua associado ao role `admin`.

2. Melhorar a mensagem de erro no admin
   - Atualizar a lógica de autenticação para distinguir entre:
     - conta autenticada mas sem permissões;
     - erro técnico ao verificar permissões.
   - Assim, se voltar a existir um problema de permissões da base de dados, o ecrã mostra uma mensagem clara em vez de dizer erradamente que a conta não é admin.

3. Adicionar uma nova tela “Marcações” no admin
   - Criar uma nova página `/admin/bookings`.
   - Adicionar “Marcações” ao menu lateral do admin.
   - Criar uma tabela protegida para marcações com campos como:
     - nome do cliente;
     - telefone;
     - tipo de animal;
     - serviço;
     - data/hora de início;
     - data/hora de fim;
     - estado: pendente, confirmada, concluída ou cancelada;
     - notas internas;
     - ligação opcional a uma mensagem recebida.

4. Funcionalidades da tela de marcações
   - Ver lista de marcações ordenada por data.
   - Criar marcação manualmente.
   - Editar dados da marcação.
   - Alterar estado da marcação.
   - Apagar marcação com confirmação.
   - Filtrar por estado, se couber de forma simples e útil.

5. Ligação com mensagens recebidas
   - Na página “Mensagens recebidas”, adicionar uma ação para transformar um pedido de contacto numa marcação.
   - A marcação será pré-preenchida com nome, telefone, tipo de animal, datas e mensagem original.

6. Segurança
   - Só administradores poderão ver, criar, editar ou apagar marcações.
   - O público não terá acesso direto às marcações.
   - Os pedidos de contacto públicos continuam a funcionar como estão.

7. Verificação final
   - Testar o login no admin com `passos.rui@gmail.com`.
   - Confirmar que a página `/admin` já não mostra “Sem acesso”.
   - Confirmar que a nova área “Marcações” aparece no menu e permite gerir marcações.

Depois de aprovares, implemento isto.