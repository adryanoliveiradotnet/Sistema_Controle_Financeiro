# Controle Financeiro

Sistema pessoal de controle financeiro com autenticação JWT, desenvolvido com React no frontend e ASP.NET Core Web API no backend.

## Tecnologias

**Frontend**
- React 19
- React Router DOM
- Tailwind CSS
- Vite

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt

## Funcionalidades

- Autenticação com JWT (login e cadastro)
- Dashboard com métricas financeiras em tempo real
- Gráfico de receita vs despesa por mês
- Cadastro de transações (entradas e saídas)
- Categorização de transações
- Deletar transação individual ou todas de uma vez
- Proteção de rotas (não acessa páginas sem estar logado)
- Spinner de carregamento
- Alertas animados de erro e sucesso
- Página 404 personalizada

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js
- .NET 10
- PostgreSQL

### Backend

1. Configure o banco no `appsettings.json`:
```json
"ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=api_financeiro_db;Username=postgres;Password=SUA_SENHA"
}
```

2. Rode as migrations:
```bash
dotnet ef database update
```

3. Inicie a API:
```bash
dotnet run
```

A API estará disponível em `https://localhost:7165`

### Frontend

1. Instale as dependências:
```bash
npm install
```

2. Inicie o projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`
