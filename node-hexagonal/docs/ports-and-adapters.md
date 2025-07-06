# Ports and Adapters - Detalhamento

## Conceito de Ports e Adapters

A arquitetura hexagonal é baseada no padrão **Ports and Adapters**, onde:

- **Ports** são interfaces que definem contratos
- **Adapters** são implementações concretas desses contratos

## Ports (Interfaces) no Projeto

### 1. Primary Ports (Input Ports)
```typescript
// src/application/ports/UserUseCasesPorts.ts
export interface CreateUserPort {
  execute(request: CreateUserRequest): Promise<CreateUserResponse>;
}

export interface GetUserPort {
  execute(id: string): Promise<GetUserResponse | null>;
}

export interface ListUsersPort {
  execute(): Promise<ListUsersResponse>;
}
```

**Características:**
- Definem como a aplicação pode ser usada
- Localizados na camada de aplicação
- Implementados pelos casos de uso
- Permitem IoC completo nos Primary Adapters

### 2. Secondary Ports (Output Ports)
```typescript
// src/domain/repositories/UserRepository.ts
interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<boolean>;
}
```

**Características:**
- Define o contrato para persistência de dados
- Localizado na camada de domínio
- Não possui implementação, apenas especificação
- Permite que o domínio seja independente da infraestrutura

## Adapters (Implementações) no Projeto

### 1. Driving Adapters (Adapters Condutores)

#### UserController
```typescript
// src/infrastructure/web/controllers/UserController.ts
class UserController {
  constructor(
    private readonly createUserPort: CreateUserPort,  // ← Primary Port (Interface)
    private readonly getUserPort: GetUserPort,        // ← Primary Port (Interface)
    private readonly listUsersPort: ListUsersPort     // ← Primary Port (Interface)
  ) {}

  async createUser(req: Request, res: Response): Promise<void>
  async getUser(req: Request, res: Response): Promise<void>
  async listUsers(req: Request, res: Response): Promise<void>
}
```

**Responsabilidades:**
- Adapta requisições HTTP para chamadas dos Primary Ports
- Converte respostas dos Primary Ports em responses HTTP
- Trata erros e status codes adequados
- **IoC**: Depende de interfaces, não de implementações

#### Express Server
```typescript
// src/infrastructure/web/server.ts
class Server {
  private app: express.Application;
  
  constructor(userController: UserController)
  start(port: number): void
}
```

**Responsabilidades:**
- Configura o servidor web
- Define middleware
- Mapeia rotas para controllers

### 2. Driven Adapters (Adapters Conduzidos)

#### InMemoryUserRepository
```typescript
// src/infrastructure/repositories/InMemoryUserRepository.ts
class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  
  async save(user: User): Promise<User>
  async findById(id: string): Promise<User | null>
  // ... outras implementações
}
```

**Responsabilidades:**
- Implementa o contrato UserRepository
- Persiste dados em memória
- Pode ser facilmente substituído por implementação com banco de dados

## Fluxo de Dados

### Requisição (Entrada)
```
HTTP Client → Express Server → Routes → UserController → Use Case → Domain Service → Repository Port
```

### Resposta (Saída)
```
Repository Adapter → Repository Port → Domain Service → Use Case → UserController → HTTP Response
```

## Benefícios da Separação

### 1. Testabilidade
- **Domínio** pode ser testado com mocks dos adapters
- **Adapters** podem ser testados independentemente
- **Casos de uso** são testados isoladamente

### 2. Flexibilidade
- Trocar banco de dados sem afetar o domínio
- Adicionar novos tipos de interface (GraphQL, gRPC) sem alterar a lógica
- Implementar diferentes estratégias de persistência

### 3. Manutenibilidade
- Responsabilidades bem definidas
- Código organizado em camadas
- Fácil localização de problemas

## Exemplos de Substituição

### Substituindo o Repositório
```typescript
// Atual: InMemoryUserRepository
class InMemoryUserRepository implements UserRepository { ... }

// Novo: PostgreSQLUserRepository
class PostgreSQLUserRepository implements UserRepository {
  constructor(private connection: Pool) {}
  
  async save(user: User): Promise<User> {
    // Implementação com PostgreSQL
  }
  // ... outras implementações
}
```

### Adicionando Nova Interface
```typescript
// Novo: GraphQLController
class GraphQLController {
  constructor(
    private readonly createUserPort: CreateUserPort,  // ← Primary Port (Interface)
    private readonly getUserPort: GetUserPort,        // ← Primary Port (Interface)
    private readonly listUsersPort: ListUsersPort     // ← Primary Port (Interface)
  ) {}
  
  async createUser(args: CreateUserArgs): Promise<UserResponse> {
    return await this.createUserPort.execute(args);  // ← Usando interface
  }
}
```

## Principais Vantagens

1. **Inversão de Dependências**: Domínio não depende de infraestrutura
2. **Extensibilidade**: Fácil adição de novos adapters
3. **Testabilidade**: Testes focados em cada responsabilidade
4. **Flexibilidade**: Troca de implementações sem afetar o núcleo
5. **Organização**: Código bem estruturado e legível 