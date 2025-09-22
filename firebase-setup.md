# Configuração do Firebase

## 🔥 Passos para Configurar o Firebase

### 1. Acesse o Firebase Console
- Vá para [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Faça login com sua conta Google

### 2. Crie um Novo Projeto (se necessário)
- Clique em "Adicionar projeto"
- Nome do projeto: `recanto-davet` (ou qualquer nome)
- Ative o Google Analytics (opcional)
- Clique em "Criar projeto"

### 3. Configure Authentication
- No menu lateral, clique em "Authentication"
- Clique em "Começar"
- Vá para a aba "Sign-in method"
- Ative "Email/senha"
- Clique em "Salvar"

### 4. Configure Firestore Database
- No menu lateral, clique em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha "Iniciar no modo de teste" (para desenvolvimento)
- Escolha uma localização (ex: us-central1)
- Clique em "Concluído"

### 5. Configure Storage (opcional)
- No menu lateral, clique em "Storage"
- Clique em "Começar"
- Escolha "Iniciar no modo de teste"
- Escolha a mesma localização do Firestore
- Clique em "Próximo" e "Concluído"

### 6. Obtenha as Configurações do Projeto
- No menu lateral, clique no ícone de engrenagem ⚙️
- Clique em "Configurações do projeto"
- Role para baixo até "Seus aplicativos"
- Clique em "Adicionar app" e escolha o ícone da web (</>)
- Nome do app: `TicketApp`
- Clique em "Registrar app"
- Copie as configurações do Firebase

### 7. Atualize o firebaseConfig.js
Substitua as configurações no arquivo `firebaseConfig.js` com as suas:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};
```

### 8. Regras de Segurança do Firestore
No Firestore, vá para "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para tickets
    match /tickets/{ticketId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUid;
    }
  }
}
```

### 9. Regras de Segurança do Storage (se usando)
No Storage, vá para "Regras" e substitua por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## ✅ Verificação

Após configurar tudo:

1. Execute `npm start` no terminal
2. Teste o login/registro no app
3. Tente criar um ticket
4. Verifique se os dados aparecem no Firestore

## 🚨 Solução de Problemas

### Erro de Índice
Se aparecer erro de índice, acesse o link fornecido no erro ou:
- Vá para Firestore > Índices
- Clique em "Criar índice"
- Configure conforme necessário

### Erro de Permissão
- Verifique as regras de segurança
- Certifique-se de que o usuário está autenticado
- Verifique se o `ownerUid` está correto

### Erro de Conexão
- Verifique se as configurações do Firebase estão corretas
- Verifique se o projeto está ativo
- Verifique se os serviços estão habilitados
