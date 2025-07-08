# Demonstração Onion Architecture com Node.js e TypeScript

Este projeto demonstra a implementação da **Arquitetura Onion** (Onion Architecture) usando Node.js, TypeScript e MongoDB. A arquitetura Onion é um padrão arquitetural que promove a separação de responsabilidades através de camadas concêntricas.

## Sobre a Arquitetura Onion

A Arquitetura Onion organiza o código em camadas concêntricas, onde:
- **Camadas internas não dependem das externas**
- **Camadas externas podem depender das internas**
- **O domínio (núcleo) permanece independente da infraestrutura**

### Camadas do Projeto

```
📁 src/
├── 🎯 domain/                    # Camada Domain (Núcleo)
│   ├── entities/                 # Entidades de negócio
│   ├── repositories/             # Interfaces de repositório
│   └── value-objects/            # Objetos de valor
├── 🔄 application/               # Camada Application
│   ├── services/                 # Serviços de aplicação
│   ├── interfaces/               # Interfaces de serviços
│   └── dtos/                     # Objetos de transferência de dados
├── 🏗️ infrastructure/            # Camada Infrastructure
│   ├── database/                 # Implementações de banco de dados
│   ├── repositories/             # Implementações de repositório
│   └── security/                 # Implementações de segurança
├── 🌐 presentation/              # Camada Presentation
│   ├── controllers/              # Controladores HTTP
│   ├── routes/                   # Definição de rotas
│   └── middlewares/              # Middlewares
└── ⚙️ config/                    # Configurações
```

## Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- npm ou yarn

## Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Ambiente

O arquivo `.env` já está configurado com valores padrão. Para produção, ajuste as variáveis:

```env
# Configurações do servidor
PORT=3000
NODE_ENV=development

# Configurações do MongoDB
MONGO_URI=mongodb://onion_user:onion_password@localhost:27017/onion_db
MONGO_URI_ADMIN=mongodb://admin:password123@localhost:27017/onion_db?authSource=admin

# Configurações de segurança
JWT_SECRET=sua_chave_secreta_aqui_muito_segura
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

### 3. Iniciar o MongoDB com Docker

```bash
npm run docker:up
```

Este comando irá:
- Iniciar o MongoDB na porta 27017
- Iniciar o Mongo Express (interface web) na porta 8081
- Criar o banco de dados e usuário automaticamente
- Inserir dados de exemplo

### 4. Executar a Aplicação

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## Endpoints da API

### Informações da Aplicação
- `GET /health` - Verificar saúde da aplicação
- `GET /api/info` - Informações sobre a arquitetura

### Gerenciamento de Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

## Exemplos de Uso

### Criar Usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Listar Usuários
```bash
curl http://localhost:3000/api/users
```

### Buscar Usuário por ID
```bash
curl http://localhost:3000/api/users/123
```

### Atualizar Usuário
```bash
curl -X PUT http://localhost:3000/api/users/123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Santos"
  }'
```

### Deletar Usuário
```bash
curl -X DELETE http://localhost:3000/api/users/123
```

## Ferramentas de Desenvolvimento

### MongoDB Admin
Acesse http://localhost:8081 para gerenciar o banco de dados através do Mongo Express.

### Scripts Disponíveis
- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada
- `npm test` - Executar testes
- `npm run lint` - Verificar código
- `npm run docker:up` - Iniciar Docker containers
- `npm run docker:down` - Parar Docker containers

## Princípios da Arquitetura Onion

### 1. Inversão de Dependência
- As camadas internas definem interfaces
- As camadas externas implementam essas interfaces
- Dependências fluem para dentro

### 2. Separação de Responsabilidades
- **Domain**: Regras de negócio puras
- **Application**: Casos de uso e orquestração
- **Infrastructure**: Implementações técnicas
- **Presentation**: Interface com o usuário

### 3. Testabilidade
- Facilita testes unitários
- Permite mocking de dependências
- Isola regras de negócio

### 4. Flexibilidade
- Fácil substituição de componentes
- Independência de frameworks
- Evolução incremental

## Estrutura de Pastas Detalhada

```
src/
├── domain/
│   ├── entities/
│   │   └── User.ts                    # Entidade de usuário
│   ├── repositories/
│   │   └── IUserRepository.ts         # Interface do repositório
│   └── value-objects/
│       └── Email.ts                   # Value object para email
├── application/
│   ├── services/
│   │   └── UserService.ts             # Serviço de usuários
│   ├── interfaces/
│   │   └── IPasswordHasher.ts         # Interface para hash de senhas
│   └── dtos/
│       └── UserDTOs.ts                # DTOs de usuário
├── infrastructure/
│   ├── database/
│   │   └── mongoose/
│   │       ├── connection.ts          # Conexão com MongoDB
│   │       └── UserModel.ts           # Modelo Mongoose
│   ├── repositories/
│   │   └── MongoUserRepository.ts     # Implementação do repositório
│   └── security/
│       └── BcryptPasswordHasher.ts    # Implementação do hash
├── presentation/
│   ├── controllers/
│   │   └── UserController.ts          # Controlador de usuários
│   ├── routes/
│   │   └── userRoutes.ts              # Rotas de usuários
│   └── middlewares/
│       ├── validateRequest.ts         # Middleware de validação
│       └── errorHandler.ts            # Middleware de erro
├── config/
│   ├── dependencies.ts                # Injeção de dependências
│   └── environment.ts                 # Configurações de ambiente
├── app.ts                             # Configuração do Express
└── main.ts                            # Ponto de entrada
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Docker** - Containerização
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **cors** - Controle de acesso

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 