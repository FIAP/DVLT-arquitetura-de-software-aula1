# Explicação das Camadas da Arquitetura Hexagonal

## Visão Geral das Camadas

A arquitetura hexagonal divide a aplicação em camadas concêntricas, onde as dependências sempre apontam para dentro, em direção ao núcleo da aplicação.

## 1. Camada de Domínio (Domain Layer)

### Localização
```
src/domain/
├── entities/
│   └── User.ts
├── repositories/
│   └── UserRepository.ts
└── services/
    └── UserService.ts
```

### Responsabilidades
- **Regras de negócio fundamentais**
- **Entidades principais**
- **Invariantes do domínio**
- **Definição de contratos (ports)**

### Exemplo: User Entity
```typescript
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date = new Date()
  ) {}

  public static create(id: string, name: string, email: string): User {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }
    
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    return new User(id, name.trim(), email.toLowerCase());
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

### Características
- ✅ **Independente**: Não depende de frameworks ou bibliotecas externas
- ✅ **Testável**: Pode ser testada isoladamente
- ✅ **Estável**: Raramente muda
- ✅ **Reutilizável**: Pode ser usada em diferentes contextos

## 2. Camada de Aplicação (Application Layer)

### Localização
```
src/application/
└── use-cases/
    ├── CreateUserUseCase.ts
    ├── GetUserUseCase.ts
    └── ListUsersUseCase.ts
```

### Responsabilidades
- **Orquestração dos casos de uso**
- **Coordenação entre domínio e infraestrutura**
- **Implementação de fluxos de negócio**
- **Validações de entrada**

### Exemplo: CreateUserUseCase
```typescript
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { name, email } = request;

    // Validar se o email já existe
    await this.userService.validateUniqueEmail(email);

    // Criar o usuário
    const userId = uuidv4();
    const user = User.create(userId, name, email);

    // Salvar no repositório
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    };
  }
}
```

### Características
- ✅ **Orquestração**: Coordena múltiplos componentes
- ✅ **Transacional**: Controla transações e consistência
- ✅ **Isolada**: Cada caso de uso é independente
- ✅ **Testável**: Pode ser testada com mocks

## 3. Camada de Infraestrutura (Infrastructure Layer)

### Localização
```
src/infrastructure/
├── config/
│   └── DependencyInjection.ts
├── repositories/
│   └── InMemoryUserRepository.ts
└── web/
    ├── controllers/
    │   └── UserController.ts
    ├── routes/
    │   └── userRoutes.ts
    └── server.ts
```

### Responsabilidades
- **Implementação de adapters**
- **Configuração de dependências**
- **Integração com frameworks**
- **Persistência de dados**
- **Comunicação externa**

### Exemplo: UserController
```typescript
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({ 
          error: 'Nome e email são obrigatórios' 
        });
        return;
      }

      const user = await this.createUserUseCase.execute({ name, email });
      
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }
}
```

### Características
- ✅ **Adaptação**: Converte entre diferentes formatos
- ✅ **Configuração**: Gerencia configurações técnicas
- ✅ **Integração**: Conecta com sistemas externos
- ✅ **Substituível**: Pode ser trocada sem afetar o núcleo

## Fluxo de Dependências

### Regra da Dependência
```
Infrastructure → Application → Domain
```

### Princípio da Inversão de Dependências
- **Domínio** define interfaces (contracts)
- **Infraestrutura** implementa essas interfaces
- **Aplicação** usa as interfaces, não as implementações

### Exemplo de Inversão
```typescript
// ❌ Dependência direta (acoplamento)
class CreateUserUseCase {
  constructor(private postgresRepository: PostgresUserRepository) {}
}

// ✅ Inversão de dependência (desacoplamento)
class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {} // Interface
}
```

## Benefícios da Separação por Camadas

### 1. Testabilidade
- **Domínio**: Testes unitários puros
- **Aplicação**: Testes de integração com mocks
- **Infraestrutura**: Testes de integração reais

### 2. Manutenibilidade
- **Mudanças isoladas**: Alterar uma camada não afeta outras
- **Responsabilidades claras**: Cada camada tem seu propósito
- **Facilidade de debug**: Problemas localizados facilmente

### 3. Flexibilidade
- **Substituição**: Trocar implementações sem afetar o núcleo
- **Extensibilidade**: Adicionar novos recursos facilmente
- **Portabilidade**: Núcleo independente de tecnologia

### 4. Escalabilidade
- **Equipes**: Diferentes times podem trabalhar em camadas distintas
- **Complexidade**: Gerenciamento de complexidade através da separação
- **Evolução**: Cada camada pode evoluir independentemente

## Padrões Implementados por Camada

### Domain Layer
- **Entity Pattern**: User.ts
- **Repository Pattern**: UserRepository.ts (interface)
- **Domain Service Pattern**: UserService.ts

### Application Layer
- **Use Case Pattern**: CreateUserUseCase.ts
- **Command Pattern**: Request/Response objects
- **Facade Pattern**: Simplifica acesso ao domínio

### Infrastructure Layer
- **Adapter Pattern**: InMemoryUserRepository.ts
- **Dependency Injection**: DependencyInjection.ts
- **MVC Pattern**: Controller/Routes/Server 