# Diagrama da Arquitetura Hexagonal

## Visão Geral da Arquitetura

Este diagrama mostra a implementação da arquitetura hexagonal (Ports and Adapters) no projeto:

```mermaid
graph TB
    subgraph "ATORES CONDUTORES"
        HTTP[HTTP Client]
        CLI[CLI Tools]
        TESTS[Tests]
    end
    
    subgraph "INFRAESTRUTURA - ADAPTERS CONDUTORES"
        CONTROLLER[UserController]
        ROUTES[Routes]
        SERVER[Express Server]
    end
    
    subgraph "NÚCLEO HEXAGONAL"
        subgraph "APPLICATION LAYER"
            CREATE_UC[CreateUserUseCase]
            GET_UC[GetUserUseCase]
            LIST_UC[ListUsersUseCase]
        end
        
        subgraph "DOMAIN LAYER"
            USER_ENTITY[User Entity]
            USER_SERVICE[UserService]
            USER_REPO_PORT[UserRepository Port]
        end
    end
    
    subgraph "INFRAESTRUTURA - ADAPTERS CONDUZIDOS"
        MEMORY_REPO[InMemoryUserRepository]
        DB_REPO[DatabaseRepository]
        EMAIL_SERVICE[EmailService]
    end
    
    subgraph "ATORES CONDUZIDOS"
        DATABASE[(Database)]
        EMAIL_PROVIDER[Email Provider]
        EXTERNAL_API[External APIs]
    end
    
    %% Conexões dos Atores Condutores
    HTTP --> CONTROLLER
    CLI --> CONTROLLER
    TESTS --> CREATE_UC
    TESTS --> GET_UC
    TESTS --> LIST_UC
    
    %% Conexões dos Adapters Condutores
    CONTROLLER --> CREATE_UC
    CONTROLLER --> GET_UC
    CONTROLLER --> LIST_UC
    ROUTES --> CONTROLLER
    SERVER --> ROUTES
    
    %% Conexões dentro do Núcleo
    CREATE_UC --> USER_SERVICE
    CREATE_UC --> USER_REPO_PORT
    GET_UC --> USER_REPO_PORT
    LIST_UC --> USER_REPO_PORT
    USER_SERVICE --> USER_REPO_PORT
    USER_ENTITY --> USER_SERVICE
    
    %% Conexões dos Adapters Conduzidos
    USER_REPO_PORT -.-> MEMORY_REPO
    USER_REPO_PORT -.-> DB_REPO
    
    %% Conexões dos Atores Conduzidos
    MEMORY_REPO --> DATABASE
    DB_REPO --> DATABASE
    EMAIL_SERVICE --> EMAIL_PROVIDER
    
    %% Estilos
    classDef driving fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef driven fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef core fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef adapter fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef port fill:#ffebee,stroke:#c62828,stroke-width:2px,stroke-dasharray: 5 5
    
    class HTTP,CLI,TESTS driving
    class DATABASE,EMAIL_PROVIDER,EXTERNAL_API driven
    class USER_ENTITY,USER_SERVICE,CREATE_UC,GET_UC,LIST_UC core
    class CONTROLLER,ROUTES,SERVER,MEMORY_REPO,DB_REPO,EMAIL_SERVICE adapter
    class USER_REPO_PORT port
```

## Explicação das Camadas

### 🔵 Atores Condutores (Driving Actors)
- **HTTP Client**: Clientes web que fazem requisições HTTP
- **CLI Tools**: Ferramentas de linha de comando
- **Tests**: Testes automatizados que exercitam os casos de uso

### 🟠 Adapters Condutores (Driving Adapters)
- **UserController**: Converte requisições HTTP em chamadas de casos de uso
- **Routes**: Define as rotas da API
- **Express Server**: Servidor web que recebe as requisições

### 🟢 Núcleo Hexagonal (Core)
#### Application Layer
- **CreateUserUseCase**: Orquestra a criação de usuários
- **GetUserUseCase**: Busca usuários específicos
- **ListUsersUseCase**: Lista todos os usuários

#### Domain Layer
- **User Entity**: Entidade principal com regras de negócio
- **UserService**: Serviços de domínio
- **UserRepository Port**: Interface que define o contrato de persistência

### 🟠 Adapters Conduzidos (Driven Adapters)
- **InMemoryUserRepository**: Implementação em memória do repositório
- **DatabaseRepository**: Implementação com banco de dados
- **EmailService**: Serviço para envio de emails

### 🟣 Atores Conduzidos (Driven Actors)
- **Database**: Banco de dados para persistência
- **Email Provider**: Provedor de serviços de email
- **External APIs**: APIs externas que podem ser consumidas

## Princípios da Arquitetura Hexagonal

### 1. Inversão de Dependências
O domínio define interfaces (ports) que são implementadas pela infraestrutura (adapters).

### 2. Separação de Responsabilidades
- **Domínio**: Regras de negócio puras
- **Aplicação**: Orquestração dos casos de uso
- **Infraestrutura**: Detalhes técnicos e implementações

### 3. Testabilidade
O núcleo pode ser testado independentemente da infraestrutura.

### 4. Flexibilidade
Fácil troca de implementações sem afetar o núcleo da aplicação.

## Fluxo de Execução

1. **Ator Condutor** (HTTP Client) faz uma requisição
2. **Adapter Condutor** (Controller) recebe e processa a requisição
3. **Caso de Uso** (Application Layer) orquestra a lógica
4. **Entidade/Serviço** (Domain Layer) aplica regras de negócio
5. **Port** (Interface) define o contrato de saída
6. **Adapter Conduzido** (Repository) implementa a persistência
7. **Ator Conduzido** (Database) executa a operação

## Benefícios Implementados

- ✅ **Testabilidade**: 22 testes automatizados
- ✅ **Flexibilidade**: Repositório em memória pode ser trocado por banco real
- ✅ **Manutenibilidade**: Código organizado e com responsabilidades claras
- ✅ **Independência**: Domínio não depende de frameworks externos 