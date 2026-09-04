# Central de Chamados

Mini sistema de chamados em React + Vite + Firebase, pronto para hospedagem no GitHub Pages.

## Funcionalidades

- Login por e-mail e senha
- Cadastro no primeiro acesso
- Dashboard do solicitante
- Abertura de chamados
- Consulta de chamados
- Histórico e conversa do chamado
- Atualização de status pelo administrador
- Área ADM protegida por documento `admins/{uid}` no Firestore
- Indicadores administrativos
- Categorias e prioridades
- Layout responsivo
- Regras do Firestore incluídas

## 1. Criar o Firebase

No Firebase Console:

1. Crie um projeto.
2. Ative Authentication > Sign-in method > Email/Password.
3. Crie um Firestore Database.
4. Copie as credenciais do Web App.
5. Crie o arquivo `.env` na raiz usando `.env.example`.

Exemplo:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Essas chaves de configuração do Firebase Web não são senhas. A segurança fica nas Authentication Rules e Firestore Rules.

## 2. Publicar as regras

No Firebase Console > Firestore > Rules, cole o conteúdo de `firestore.rules`.

## 3. Criar seu acesso ADM

Primeiro, cadastre seu usuário normalmente pela tela de cadastro.

Depois descubra o UID do usuário no Firebase Console:
Authentication > Users.

No Firestore, crie:

```text
admins
  SEU_UID
    active: true
    name: "Administrador"
```

O documento `admins/{UID}` é o que libera a área administrativa. Um usuário comum não consegue se promover a administrador pelas regras do Firestore.

## 4. Rodar localmente

```bash
npm install
npm run dev
```

## 5. Publicar no GitHub Pages

O arquivo `.github/workflows/deploy.yml` já está preparado.

1. Crie um repositório no GitHub, por exemplo `central-chamados`.
2. Envie todos os arquivos deste projeto.
3. Vá em Settings > Pages.
4. Em Build and deployment, selecione `GitHub Actions`.
5. O workflow fará o build e a publicação.

Se o projeto estiver em um repositório diferente, o Vite está usando `base: "./"`, então a aplicação funciona em subcaminho.

## Estrutura

- `src/pages/Login.jsx` — login
- `src/pages/Register.jsx` — cadastro
- `src/pages/Dashboard.jsx` — área do usuário
- `src/pages/NewTicket.jsx` — novo chamado
- `src/pages/Ticket.jsx` — detalhe do chamado
- `src/pages/Admin.jsx` — painel administrativo
- `src/services/firebase.js` — Firebase
- `src/services/auth.js` — autenticação e perfil
- `src/services/tickets.js` — chamados
- `firestore.rules` — segurança do banco

## Observação importante

Não coloque senha administrativa no código do site. O projeto usa autenticação do Firebase e autorização por UID no Firestore, evitando uma senha exposta no JavaScript público do GitHub Pages.
