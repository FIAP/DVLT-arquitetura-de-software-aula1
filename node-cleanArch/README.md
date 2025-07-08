# Clean Architecture em TypeScript

Este projeto demonstra a implementação da Clean Architecture em TypeScript com Node.js, seguindo os princípios definidos por Robert C. Martin.

## Estrutura do Projeto

```
src/
├── entities/                    # Camada de Entidades (Enterprise Business Rules)
│   └── User.ts
├── use-cases/                   # Camada de Casos de Uso (Application Business Rules)
│   ├── ports/
│   │   └── UserRepository.ts
│   ├── dtos/
│   │   └── UserDTO.ts
│   ├── CreateUserUseCase.ts
│   ├── GetUserUseCase.ts
│   └── GetAllUsersUseCase.ts
├── interface-adapters/          # Camada de Adaptadores de Interface
│   └── controllers/
│       └── UserController.ts
├── frameworks-drivers/          # Camada de Frameworks & Drivers
│   ├── database/
│   │   └── InMemoryUserRepository.ts
│   └── web/
│       └── ExpressServer.ts
└── main/                        # Composição e Injeção de Dependências
    └── DIContainer.ts
```

## Camadas da Clean Architecture

### 1. Entities (Amarelo - Enterprise Business Rules)
- **Localização**: `src/entities/`
- **Responsabilidade**: Contém as regras de negócio mais gerais e de alto nível
- **Exemplo**: `User.ts` - Entidade que encapsula as regras de negócio do usuário

### 2. Use Cases (Vermelho - Application Business Rules)
- **Localização**: `src/use-cases/`
- **Responsabilidade**: Contém as regras de negócio específicas da aplicação
- **Componentes**:
  - `ports/` - Interfaces que definem contratos
  - `dtos/` - Objetos de transferência de dados
  - Use Cases específicos (CreateUser, GetUser, etc.)

### 3. Interface Adapters (Verde)
- **Localização**: `src/interface-adapters/`
- **Responsabilidade**: Adaptam dados entre os use cases e o mundo externo
- **Exemplo**: `UserController.ts` - Adapta requisições HTTP para chamadas de use cases

### 4. Frameworks & Drivers (Azul)
- **Localização**: `src/frameworks-drivers/`
- **Responsabilidade**: Detalhes de implementação (banco de dados, web framework, etc.)
- **Componentes**:
  - `database/` - Implementações concretas de repositórios
  - `web/` - Configuração do servidor web

### 5. Main (Composição)
- **Localização**: `src/main/`
- **Responsabilidade**: Injeção de dependências e composição da aplicação
- **Exemplo**: `DIContainer.ts` - Container de injeção de dependências

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Compilar o TypeScript
npm run build

# Executar em modo de desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Execução
```bash
# Modo desenvolvimento (com ts-node)
npm run dev

# Modo produção
npm run build && npm start
```

## Endpoints da API

### Criar Usuário
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

### Listar Todos os Usuários
```http
GET /users
```

### Buscar Usuário por ID
```http
GET /users/:id
```

### Health Check
```http
GET /health
```

## Exemplo de Uso

```bash
# Criar um usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'

# Listar todos os usuários
curl http://localhost:3000/users

# Buscar usuário por ID
curl http://localhost:3000/users/[ID_DO_USUARIO]
```

## Princípios da Clean Architecture

### 1. Regra de Dependência
- As dependências só podem apontar para dentro
- Camadas internas não conhecem camadas externas

### 2. Inversão de Dependências
- Use cases dependem de abstrações (interfaces)
- Implementações concretas estão nas camadas externas

### 3. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Mudanças em uma camada não afetam as outras

### 4. Testabilidade
- Lógica de negócio isolada e testável
- Dependências externas podem ser facilmente mockadas

## Vantagens desta Arquitetura

1. **Independência de Frameworks**: A lógica de negócio não depende de frameworks específicos
2. **Testabilidade**: Use cases podem ser testados independentemente da UI, banco de dados, etc.
3. **Independência de UI**: A interface pode ser alterada sem afetar a lógica de negócio
4. **Independência de Banco de Dados**: Banco de dados pode ser trocado sem afetar as regras de negócio
5. **Independência de Agentes Externos**: A lógica de negócio não conhece o mundo externo

## Estrutura de Fluxo

```
Request → Controller → Use Case → Repository → Database
Response ← Controller ← Use Case ← Repository ← Database
```

## Testes

Para executar os testes:

```bash
npm test
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request 