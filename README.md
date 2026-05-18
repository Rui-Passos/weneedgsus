# Welcome to your Lovable project

# 🐾 weneedgsus — João de Deus · Pet Sitter de Confiança

Site pessoal do pet sitter João de Deus, construído com React e Supabase. Permite que clientes conheçam os serviços, agendem cuidados para os seus animais e contactem diretamente o pet sitter. Inclui também uma área de administração completa para gestão de reservas, galeria, conteúdo e mensagens.

🌐 **Site publicado:** [weneedgsus.lovable.app](https://weneedgsus.lovable.app)
📸 **Instagram:** [@weneedgsus](https://www.instagram.com/weneedgsus)

---

## ✨ Funcionalidades

### Área pública
- Página principal com apresentação dos serviços
- Autenticação de utilizadores (registo, login, recuperação de password)
- Agendamento de serviços

### Área de administração (`/admin`)
- **Reservas** — visualização e gestão de todas as reservas
- **Relatórios** — dados e estatísticas de atividade
- **Galeria** — gestão de fotos dos animais cuidados
- **Conteúdo** — edição de conteúdo do site
- **Mensagens** — gestão de contactos e mensagens recebidas

---

## 🛠️ Stack tecnológica

| Tecnologia | Utilização |
|---|---|
| [React 18](https://react.dev) | Framework de UI |
| [TypeScript](https://www.typescriptlang.org) | Tipagem estática |
| [Vite](https://vitejs.dev) | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com) | Estilização |
| [shadcn/ui](https://ui.shadcn.com) | Componentes de UI |
| [Supabase](https://supabase.com) | Base de dados, autenticação e backend |
| [TanStack Query](https://tanstack.com/query) | Gestão de estado e data fetching |
| [React Router](https://reactrouter.com) | Navegação e rotas |
| [Lovable](https://lovable.dev) | Plataforma de desenvolvimento |

---

## 📁 Estrutura do projeto

```
weneedgsus/
├── public/              # Ficheiros estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitários e configurações
│   └── integrations/    # Integração com Supabase
├── supabase/            # Migrações e configuração da base de dados
├── .env.example         # Variáveis de ambiente necessárias
└── index.html           # Entry point HTML
```

---

## 🚀 Instalação e desenvolvimento local

### Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- Conta no [Supabase](https://supabase.com)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/Rui-Passos/weneedgsus.git
cd weneedgsus

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Preencher o .env com as tuas chaves do Supabase

# 4. Arrancar o servidor de desenvolvimento
npm run dev
```

O site fica disponível em `http://localhost:8080`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Corre o ESLint |
| `npm run test` | Corre os testes com Vitest |

---

## 🔐 Variáveis de ambiente

Cria um ficheiro `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

Podes encontrar estas chaves em **Supabase → Project Settings → API**.

> ⚠️ Nunca commites o ficheiro `.env` para o repositório.

---

## 📄 Licença

Projeto pessoal. Todos os direitos reservados © João de Deus.
