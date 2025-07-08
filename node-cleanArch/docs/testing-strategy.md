# Estratégia de Testes

## Pirâmide de Testes na Clean Architecture

```mermaid
graph TD
    subgraph "Testes E2E (Poucos)"
        E2E["Testes End-to-End<br/>API completa"]
    end
    
    subgraph "Testes de Integração (Alguns)"
        INT1["Controller + UseCase"]
        INT2["UseCase + Repository"]
    end
    
    subgraph "Testes Unitários (Muitos)"
        UNIT1["Entity Tests"]
        UNIT2["UseCase Tests"]
        UNIT3["Controller Tests"]
        UNIT4["Repository Tests"]
    end
    
    E2E --> INT1
    E2E --> INT2
    INT1 --> UNIT2
    INT1 --> UNIT3
    INT2 --> UNIT2
    INT2 --> UNIT4
    UNIT2 --> UNIT1
    
    classDef e2e fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    classDef integration fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef unit fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    
    class E2E e2e
    class INT1,INT2 integration
    class UNIT1,UNIT2,UNIT3,UNIT4 unit
```

## Estrutura de Testes por Camada

```mermaid
graph TB
    subgraph "src/"
        subgraph "entities/"
            USER_ENTITY["User.ts"]
            USER_TEST["User.test.ts"]
        end
        
        subgraph "use-cases/"
            UC["CreateUserUseCase.ts"]
            UC_TEST["__tests__/<br/>CreateUserUseCase.test.ts"]
        end
        
        subgraph "interface-adapters/"
            CTRL["UserController.ts"]
            CTRL_TEST["__tests__/<br/>UserController.test.ts"]
        end
        
        subgraph "frameworks-drivers/"
            REPO["InMemoryUserRepository.ts"]
            REPO_TEST["__tests__/<br/>InMemoryUserRepository.test.ts"]
        end
    end
    
    subgraph "tests/"
        E2E_TEST["e2e/<br/>user-api.test.ts"]
    end
    
    USER_TEST --> USER_ENTITY
    UC_TEST --> UC
    CTRL_TEST --> CTRL
    REPO_TEST --> REPO
    E2E_TEST --> UC
    E2E_TEST --> CTRL
    E2E_TEST --> REPO
    
    classDef entities fill:#fff2cc,stroke:#d6b656,stroke-width:2px
    classDef usecases fill:#f8cecc,stroke:#b85450,stroke-width:2px
    classDef adapters fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    classDef frameworks fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    classDef tests fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class USER_ENTITY,USER_TEST entities
    class UC,UC_TEST usecases
    class CTRL,CTRL_TEST adapters
    class REPO,REPO_TEST frameworks
    class E2E_TEST tests
```

## Exemplo de Teste Unitário (Use Case)

```typescript
// src/use-cases/__tests__/CreateUserUseCase.test.ts
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('deve criar um usuário com dados válidos', async () => {
    // Arrange
    const userData = {
      name: 'João Silva',
      email: 'joao@email.com'
    };

    // Act
    const result = await useCase.execute(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
  });
});
```

## Benefícios dos Testes na Clean Architecture

### 1. Isolamento de Camadas
```mermaid
graph LR
    TEST["Teste UseCase"] --> MOCK["Mock Repository"]
    TEST --> REAL["Use Case Real"]
    
    classDef test fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef mock fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef real fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    
    class TEST test
    class MOCK mock
    class REAL real
```

### 2. Facilidade de Mock
- **Interfaces bem definidas**: Fácil criar mocks
- **Dependências injetadas**: Substituição simples
- **Lógica isolada**: Testes focados

### 3. Tipos de Teste

#### Testes Unitários
- **Entity**: Validações e regras de negócio
- **Use Case**: Lógica da aplicação com mocks
- **Controller**: Manipulação de requisições

#### Testes de Integração
- **Use Case + Repository**: Sem mocks do repositório
- **Controller + Use Case**: Fluxo completo da API

#### Testes E2E
- **API completa**: Servidor real + banco real
- **Cenários de usuário**: Fluxos completos

## Comandos de Teste

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar apenas testes E2E
npm run test:e2e
``` 