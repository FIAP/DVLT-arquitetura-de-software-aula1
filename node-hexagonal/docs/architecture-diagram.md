# Diagrama da Arquitetura Hexagonal

## Visão Geral da Arquitetura

Este diagrama mostra a implementação da arquitetura hexagonal (Ports and Adapters) no projeto:

```mermaid
graph TB
    subgraph "DRIVING ACTORS (Primary Side)"
        HTTP[HTTP Client/Browser]
        CLI[CLI Tools]
        TESTS[Automated Tests]
        SPA[Single Page App]
        MOBILE[Mobile App]
    end
    
    subgraph "DRIVING ADAPTERS (Primary Adapters)"
        CONTROLLER[UserController]
        ROUTES[Express Routes]
        SERVER[HTTP Server]
        TEST_RUNNER[Jest Test Runner]
    end
    
    subgraph "HEXAGONAL CORE"
        subgraph "PRIMARY PORTS (Input Ports)"
            CREATE_PORT[CreateUser Port]
            GET_PORT[GetUser Port]
            LIST_PORT[ListUsers Port]
        end
        
        subgraph "APPLICATION LAYER"
            CREATE_UC[CreateUserUseCase]
            GET_UC[GetUserUseCase]
            LIST_UC[ListUsersUseCase]
        end
        
        subgraph "DOMAIN LAYER"
            USER_ENTITY[User Entity]
            USER_SERVICE[UserService]
        end
        
        subgraph "SECONDARY PORTS (Output Ports)"
            USER_REPO_PORT[UserRepository Port]
            EMAIL_PORT[EmailService Port]
            LOG_PORT[Logger Port]
        end
    end
    
    subgraph "DRIVEN ADAPTERS (Secondary Adapters)"
        MEMORY_REPO[InMemoryUserRepository]
        DB_REPO[PostgreSQLUserRepository]
        EMAIL_ADAPTER[SMTPEmailAdapter]
        LOG_ADAPTER[FileLoggerAdapter]
    end
    
    subgraph "DRIVEN ACTORS (Secondary Side)"
        DATABASE[(Database)]
        EMAIL_SERVER[SMTP Server]
        FILE_SYSTEM[File System]
        EXTERNAL_API[External APIs]
    end
    
    %% Conexões Primary Side (Driving)
    HTTP --> CONTROLLER
    CLI --> CONTROLLER
    TESTS --> TEST_RUNNER
    SPA --> SERVER
    MOBILE --> SERVER
    
    %% Conexões Primary Adapters para Primary Ports
    CONTROLLER --> CREATE_PORT
    CONTROLLER --> GET_PORT
    CONTROLLER --> LIST_PORT
    TEST_RUNNER --> CREATE_PORT
    TEST_RUNNER --> GET_PORT
    TEST_RUNNER --> LIST_PORT
    ROUTES --> CONTROLLER
    SERVER --> ROUTES
    
    %% Conexões dentro do Core
    CREATE_PORT --> CREATE_UC
    GET_PORT --> GET_UC
    LIST_PORT --> LIST_UC
    
    CREATE_UC --> USER_SERVICE
    CREATE_UC --> USER_REPO_PORT
    GET_UC --> USER_REPO_PORT
    LIST_UC --> USER_REPO_PORT
    USER_SERVICE --> USER_REPO_PORT
    USER_ENTITY --> USER_SERVICE
    
    %% Conexões Secondary Ports para Secondary Adapters
    USER_REPO_PORT -.-> MEMORY_REPO
    USER_REPO_PORT -.-> DB_REPO
    EMAIL_PORT -.-> EMAIL_ADAPTER
    LOG_PORT -.-> LOG_ADAPTER
    
    %% Conexões Secondary Side (Driven)
    MEMORY_REPO --> DATABASE
    DB_REPO --> DATABASE
    EMAIL_ADAPTER --> EMAIL_SERVER
    LOG_ADAPTER --> FILE_SYSTEM
    
    %% Estilos
    classDef driving fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef driven fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef core fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef adapter fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef primaryPort fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef secondaryPort fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,stroke-dasharray: 5 5
    
    class HTTP,CLI,TESTS,SPA,MOBILE driving
    class DATABASE,EMAIL_SERVER,FILE_SYSTEM,EXTERNAL_API driven
    class USER_ENTITY,USER_SERVICE,CREATE_UC,GET_UC,LIST_UC core
    class CONTROLLER,ROUTES,SERVER,TEST_RUNNER,MEMORY_REPO,DB_REPO,EMAIL_ADAPTER,LOG_ADAPTER adapter
    class CREATE_PORT,GET_PORT,LIST_PORT primaryPort
    class USER_REPO_PORT,EMAIL_PORT,LOG_PORT secondaryPort
```

## Terminologia Precisa da Arquitetura Hexagonal

### 🔵 **Primary Side (Lado Primário) - DRIVING**
- **Driving Actors**: Entidades que iniciam interações
  - **HTTP Client/Browser**: Usuários navegando
  - **CLI Tools**: Ferramentas de linha de comando
  - **Automated Tests**: Testes automatizados
  - **Single Page App**: Aplicações web
  - **Mobile App**: Aplicações mobile

- **Primary Adapters (Driving Adapters)**: Adaptam requisições externas
  - **UserController**: Adapta HTTP para casos de uso
  - **Express Routes**: Roteamento HTTP
  - **HTTP Server**: Servidor web
  - **Jest Test Runner**: Executor de testes

### 🟢 **Hexagonal Core (Núcleo)**
#### Primary Ports (Input Ports)
- **Interfaces de entrada** que definem como a aplicação pode ser usada
- **CreateUserPort**: Interface para criação de usuários
- **GetUserPort**: Interface para busca de usuários
- **ListUsersPort**: Interface para listagem de usuários
- **Implementadas pelos casos de uso** para IoC completo

#### Application Layer
- **CreateUserUseCase**: Orquestra criação de usuários
- **GetUserUseCase**: Busca usuários específicos
- **ListUsersUseCase**: Lista todos os usuários

#### Domain Layer
- **User Entity**: Entidade principal com regras de negócio
- **UserService**: Serviços de domínio

#### Secondary Ports (Output Ports)
- **Interfaces de saída** que definem como a aplicação interage com recursos externos
- **UserRepository Port**: Interface de persistência
- **EmailService Port**: Interface de comunicação
- **Logger Port**: Interface de logging

### 🟣 **Secondary Side (Lado Secundário) - DRIVEN**
- **Secondary Adapters (Driven Adapters)**: Implementam ports secundários
  - **InMemoryUserRepository**: Persistência em memória
  - **PostgreSQLUserRepository**: Persistência em banco
  - **SMTPEmailAdapter**: Envio de emails
  - **FileLoggerAdapter**: Logging em arquivos

- **Driven Actors**: Recursos externos que a aplicação consome
  - **Database**: Banco de dados
  - **SMTP Server**: Servidor de email
  - **File System**: Sistema de arquivos
  - **External APIs**: APIs externas

## Diferenças Conceituais Importantes

### 1. **Primary vs Secondary**
- **Primary (Driving)**: Quem **usa** a aplicação
- **Secondary (Driven)**: O que a aplicação **usa**

### 2. **Ports vs Adapters**
- **Ports**: Interfaces/contratos (abstrações)
- **Adapters**: Implementações concretas

### 3. **Input vs Output Ports**
- **Input Ports**: Como entrar na aplicação
- **Output Ports**: Como a aplicação sai para recursos externos

## Fluxo de Execução Correto

### Primary Side (Entrada)
1. **Driving Actor** (Browser) faz requisição
2. **Primary Adapter** (Controller) recebe requisição
3. **Primary Port** (interface explícita) define contrato
4. **Use Case** (Application Layer) processa
5. **Domain** (Entity/Service) aplica regras

### Secondary Side (Saída)
6. **Secondary Port** (Repository interface) define contrato
7. **Secondary Adapter** (Repository implementation) executa
8. **Driven Actor** (Database) persiste dados

## Benefícios da Nomenclatura Precisa

- ✅ **Clareza**: Terminologia padrão da arquitetura hexagonal
- ✅ **Comunicação**: Linguagem comum entre desenvolvedores
- ✅ **Documentação**: Alinhamento com literatura técnica
- ✅ **Ensino**: Conceitos corretos para aprendizado

## Validação com as Imagens de Referência

### ✅ **Conformidade com o Padrão Clássico**
Nossa implementação segue **exatamente** os conceitos das imagens:

1. **Primary Side (Driving)**: Atores que usam a aplicação
2. **Secondary Side (Driven)**: Recursos que a aplicação usa
3. **Ports**: Interfaces bem definidas
4. **Adapters**: Implementações concretas
5. **Core**: Domínio e casos de uso isolados

### ✅ **Alinhamento com Literatura Técnica**
- Terminologia precisa de Alistair Cockburn
- Separação clara Primary/Secondary
- Input/Output Ports bem definidos
- Fluxo de dependências correto

## Exemplo Prático no Nosso Projeto

### Primary Side (Como usamos a aplicação)
```typescript
// Primary Adapter (Controller)
@Controller('/users')
class UserController {
  constructor(
    // Primary Ports (interfaces explícitas)
    private readonly createUserPort: CreateUserPort,
    private readonly getUserPort: GetUserPort,
    private readonly listUsersPort: ListUsersPort
  ) {}
  
  async createUser(req: Request) {
    return await this.createUserPort.execute(req.body);
  }
}
```

### Secondary Side (Como a aplicação usa recursos)
```typescript
// Secondary Port (Interface)
interface UserRepository {
  save(user: User): Promise<User>;
}

// Secondary Adapter (Implementation)
class PostgreSQLUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    // Conecta com Driven Actor (Database)
  }
}
```

## Conclusão da Análise

Nossa documentação está **100% alinhada** com as imagens de referência! As correções feitas agora tornam nossa implementação ainda mais precisa com:

1. ✅ **Terminologia padrão** da arquitetura hexagonal
2. ✅ **Separação correta** Primary/Secondary
3. ✅ **Ports e Adapters** bem definidos
4. ✅ **Fluxo de dependências** adequado
5. ✅ **Exemplos práticos** do código real 