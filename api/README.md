# Gerir.me API

## Descrição

API REST para o sistema Gerir.me - Gerenciamento de Despesas Pessoais. Esta API fornece endpoints completos para autenticação de usuários, gerenciamento de despesas, dashboard com estatísticas e calendário de pagamentos.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação via tokens
- **Swagger UI** - Documentação interativa da API
- **Mocha + Chai + Supertest** - Testes automatizados
- **Mochawesome** - Relatórios de teste em HTML
- **CORS** - Controle de acesso entre origens

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd projeto_portfolio_pessoal/api
```

2. Instale as dependências:
```bash
npm install
```

## 🏃‍♂️ Executando a Aplicação

### Modo de Desenvolvimento
```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

### Executando Testes
```bash
# Executar todos os testes
npm test

# Executar teste específico
npm test -- --grep "nome do teste"
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação interativa do Swagger:

**URL:** `http://localhost:3000/api-docs`

A documentação inclui:
- Todos os endpoints disponíveis
- Esquemas de request/response
- Exemplos de uso
- Teste interativo dos endpoints

## 🔐 Autenticação

A API utiliza autenticação JWT (JSON Web Tokens). Para acessar endpoints protegidos:

1. Faça login ou registre-se para obter um token
2. Inclua o token no header das requisições:
```
Authorization: Bearer <seu-token-jwt>
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/profile` - Obter perfil do usuário autenticado

### Despesas
- `GET /api/expenses` - Listar despesas (com filtros)
- `POST /api/expenses` - Criar nova despesa
- `GET /api/expenses/:id` - Obter despesa específica
- `PUT /api/expenses/:id` - Atualizar despesa
- `DELETE /api/expenses/:id` - Excluir despesa

### Dashboard
- `GET /api/dashboard/overview` - Visão geral com estatísticas

### Calendário
- `GET /api/calendar/month` - Calendário mensal de pagamentos

### Saúde da API
- `GET /health` - Verificação de saúde da API

## 🧪 Testes

A API possui uma suíte completa de testes automatizados:

- **Testes de Autenticação**: Registro, login e perfil
- **Testes de Despesas**: CRUD completo
- **Testes de Dashboard**: Estatísticas e métricas
- **Testes de Calendário**: Calendário mensal

### Relatórios de Teste

Após executar os testes, relatórios são gerados em:
- `test-results/api-test-report.html` - Relatório visual
- `test-results/api-test-report.json` - Dados em JSON

## 📁 Estrutura do Projeto

```
api/
├── controllers/          # Controladores da API
│   ├── authController.js
│   ├── expenseController.js
│   ├── dashboardController.js
│   └── calendarController.js
├── models/              # Modelos de dados
│   ├── User.js
│   └── Expense.js
├── routes/              # Definição das rotas
│   ├── auth.js
│   ├── expenses.js
│   ├── dashboard.js
│   └── calendar.js
├── test/                # Testes automatizados
│   ├── auth.test.js
│   ├── expenses.test.js
│   ├── dashboard.test.js
│   └── calendar.test.js
├── test-results/        # Relatórios de teste
├── server.js           # Servidor principal
├── swagger.json        # Documentação OpenAPI
├── package.json        # Dependências e scripts
└── README.md          # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente

A API utiliza as seguintes variáveis de ambiente (opcionais):

- `PORT` - Porta do servidor (padrão: 3000)
- `JWT_SECRET` - Chave secreta para JWT (padrão: gerada automaticamente)

### Exemplo de uso:
```bash
PORT=8080 npm start
```

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente apropriadas
2. Execute os testes para garantir que tudo está funcionando:
```bash
npm test
```
3. Inicie o servidor:
```bash
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Edcleryton**
- Email: contato@gerirme.com
- GitHub: [Seu GitHub]

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação da API](http://localhost:3000/api-docs)
2. Execute os testes para verificar se há problemas
3. Abra uma issue no repositório

---

**Gerir.me API** - Desenvolvido com ❤️ para facilitar o gerenciamento de despesas pessoais.