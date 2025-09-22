# TicketApp - Aplicativo de Tickets Moderno

Um aplicativo React Native moderno para gerenciamento de tickets com interface elegante e funcionalidades avançadas.

## 🚀 Funcionalidades

### ✨ Interface Moderna
- Design system completo com cores, tipografia e espaçamentos consistentes
- Gradientes e animações suaves
- Interface responsiva e intuitiva
- Tema claro com possibilidade de modo escuro

### 🔐 Autenticação Avançada
- Login e registro de usuários
- Recuperação de senha por email
- Validação de formulários
- Tratamento de erros personalizado

### 🎫 Gerenciamento de Tickets
- Visualização de tickets com status em tempo real
- Criação de tickets com diferentes tipos (Adulto, VIP, Família)
- QR Code para cada ticket
- Histórico de compras
- Compartilhamento de tickets

### 📱 Funcionalidades Extras
- Tela dedicada para visualização de QR Codes
- Estatísticas de tickets
- Pull-to-refresh
- Loading states elegantes
- Navegação fluida entre telas

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **Firebase** - Backend (Auth, Firestore, Functions, Storage)
- **React Navigation** - Navegação
- **Expo Linear Gradient** - Gradientes
- **React Native QR Code SVG** - Geração de QR Codes
- **Ionicons** - Ícones

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd chatgpt-main
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Configure Authentication, Firestore, Functions e Storage
   - Atualize as configurações em `firebaseConfig.js`

4. **Execute o projeto**
   ```bash
   npm start
   ```

## 🎨 Design System

### Cores
- **Primary**: Azul (#0ea5e9)
- **Secondary**: Roxo (#d946ef)
- **Success**: Verde (#22c55e)
- **Warning**: Amarelo (#f59e0b)
- **Error**: Vermelho (#ef4444)

### Tipografia
- Fontes do sistema para melhor performance
- Tamanhos consistentes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
- Pesos: normal, medium, semibold, bold

### Espaçamentos
- Sistema de espaçamento baseado em múltiplos de 4
- Valores de 0 a 32 (0, 4, 8, 12, 16, 20, 24, 32, etc.)

## 📱 Estrutura do App

```
src/
├── screens/
│   ├── LoginScreen.js      # Tela de login/registro
│   ├── HomeScreen.js       # Tela principal com tickets
│   ├── BuyTicketScreen.js  # Tela de compra de tickets
│   ├── AccountScreen.js    # Tela de perfil/configurações
│   └── QRCodeScreen.js     # Tela de visualização de QR Code
├── styles/
│   ├── colors.js           # Paleta de cores
│   ├── typography.js       # Configurações de tipografia
│   └── spacing.js          # Sistema de espaçamentos
└── services/
    └── tickets.js          # Serviços de tickets
```

## 🔧 Configuração do Firebase

### Authentication
- Email/Password habilitado
- Recuperação de senha configurada

### Firestore
- Coleção `tickets` com estrutura:
  ```javascript
  {
    id: string,
    ownerUid: string,
    type: string,
    price: number,
    createdAt: timestamp,
    validUntilMillis: number,
    used: boolean
  }
  ```

### Cloud Functions
- Função `createTicket` para gerar tickets e QR Codes

### Storage
- Armazenamento de imagens de QR Codes

## 🚀 Funcionalidades Futuras

- [ ] Scanner de QR Code para validação
- [ ] Notificações push
- [ ] Modo offline
- [ ] Histórico detalhado
- [ ] Sistema de avaliações
- [ ] Integração com pagamentos
- [ ] Temas personalizáveis

## 📄 Licença

Este projeto está sob a licença 0BSD.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos issues do repositório.

---

Desenvolvido com ❤️ usando React Native e Firebase
