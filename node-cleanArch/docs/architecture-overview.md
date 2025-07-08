# Visão Geral da Arquitetura

## Diagrama das Camadas da Clean Architecture

```mermaid
graph TD
    subgraph "Frameworks & Drivers (Azul)"
        WEB["ExpressServer<br/>Framework Web"]
        DB["InMemoryUserRepository<br/>Database"]
        EXT["External Interfaces"]
    end
    
    subgraph "Interface Adapters (Verde)"
        CTRL["UserController<br/>Controller"]
        PRES["Presenters"]
        GATE["Gateways"]
    end
    
    subgraph "Use Cases (Vermelho)"
        UC1["CreateUserUseCase"]
        UC2["GetUserUseCase"]
        UC3["GetAllUsersUseCase"]
        REPO["UserRepository<br/>Interface"]
    end
    
    subgraph "Entities (Amarelo)"
        USER["User<br/>Entity"]
    end
    
    subgraph "Main"
        DI["DIContainer<br/>Dependency Injection"]
        MAIN["index.ts<br/>Entry Point"]
    end
    
    %% Fluxo de dependências (sempre para dentro)
    WEB --> CTRL
    CTRL --> UC1
    CTRL --> UC2
    CTRL --> UC3
    UC1 --> REPO
    UC2 --> REPO
    UC3 --> REPO
    UC1 --> USER
    UC2 --> USER
    UC3 --> USER
    DB --> REPO
    
    %% Composição
    DI --> WEB
    DI --> CTRL
    DI --> UC1
    DI --> UC2
    DI --> UC3
    DI --> DB
    MAIN --> DI
    
    %% Styling
    classDef entities fill:#fff2cc,stroke:#d6b656,stroke-width:2px
    classDef usecases fill:#f8cecc,stroke:#b85450,stroke-width:2px
    classDef adapters fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    classDef frameworks fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    classDef main fill:#e1d5e7,stroke:#9673a6,stroke-width:2px
    
    class USER entities
    class UC1,UC2,UC3,REPO usecases
    class CTRL,PRES,GATE adapters
    class WEB,DB,EXT frameworks
    class DI,MAIN main
```

## Princípios Fundamentais

### Regra de Dependência
- **Direção das dependências**: Sempre apontam para dentro (das camadas externas para as internas)
- **Camadas internas**: Não conhecem as camadas externas
- **Inversão de controle**: Interfaces definidas nas camadas internas, implementadas nas externas

### Separação de Responsabilidades
- **Entities**: Regras de negócio empresariais
- **Use Cases**: Regras de negócio da aplicação
- **Interface Adapters**: Conversão de dados entre formatos
- **Frameworks & Drivers**: Detalhes de implementação 