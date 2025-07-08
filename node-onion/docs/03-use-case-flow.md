# Diagrama de Fluxo de Caso de Uso

Este diagrama mostra como uma requisição HTTP flui através de todas as camadas da arquitetura Onion.

```mermaid
sequenceDiagram
    participant Client as 🌐 Cliente HTTP
    participant Routes as 🛤️ UserRoutes
    participant Middleware as 🔍 ValidationMiddleware
    participant Controller as 🎮 UserController
    participant Service as 🔄 UserService
    participant Email as 📧 Email (Value Object)
    participant User as 👤 User (Entity)
    participant IRepo as 📋 IUserRepository
    participant Hasher as 🔐 IPasswordHasher
    participant MongoRepo as 🏗️ MongoUserRepository
    participant BcryptHasher as 🔒 BcryptPasswordHasher
    participant MongoDB as 🍃 MongoDB

    Note over Client, MongoDB: Caso de Uso: Criar Usuário

    %% Presentation Layer
    Client->>Routes: POST /api/users<br/>{"name": "João", "email": "joao@email.com", "password": "123456"}
    Routes->>Middleware: Validar dados de entrada
    Middleware->>Middleware: express-validator<br/>- nome (2-100 chars)<br/>- email válido<br/>- senha (min 6 chars)
    
    alt Dados inválidos
        Middleware-->>Client: 400 Bad Request<br/>{"success": false, "errors": [...]}
    else Dados válidos
        Middleware->>Controller: next()
        Controller->>Controller: Extrair CreateUserDTO do req.body
        
        %% Application Layer
        Controller->>Service: createUser(userData)
        Service->>IRepo: findByEmail("joao@email.com")
        IRepo->>MongoRepo: findByEmail (implementação)
        MongoRepo->>MongoDB: db.users.findOne({email: "joao@email.com"})
        MongoDB-->>MongoRepo: null (usuário não existe)
        MongoRepo-->>Service: null
        
        %% Domain Layer - Value Object
        Service->>Email: new Email("joao@email.com")
        Email->>Email: Validar formato do email
        alt Email inválido
            Email-->>Service: throw Error("Email inválido")
            Service-->>Controller: Error
            Controller-->>Client: 400 Bad Request
        else Email válido
            Email-->>Service: Email válido criado
            
            %% Infrastructure Layer - Hash
            Service->>Hasher: hash("123456")
            Hasher->>BcryptHasher: hash (implementação)
            BcryptHasher->>BcryptHasher: bcrypt.hash("123456", 10)
            BcryptHasher-->>Service: "$2a$10$hashedPassword..."
            
            %% Domain Layer - Entity
            Service->>User: new User("", "João", "joao@email.com", hashedPassword, dates)
            User->>User: isValidName() - verificar se nome tem 2-100 chars
            alt Nome inválido
                User-->>Service: Entidade criada com dados inválidos
                Service->>Service: Validar regras de negócio
                Service-->>Controller: throw Error("Nome deve ter entre 2 e 100 caracteres")
                Controller-->>Client: 400 Bad Request
            else Nome válido
                User-->>Service: Entidade User válida
                
                %% Infrastructure Layer - Persistência
                Service->>IRepo: save(user)
                IRepo->>MongoRepo: save (implementação)
                MongoRepo->>MongoDB: db.users.insertOne({name, email, password})
                MongoDB-->>MongoRepo: {_id: "ObjectId", name, email, password, createdAt, updatedAt}
                MongoRepo->>MongoRepo: toDomainEntity(savedDoc)
                MongoRepo-->>Service: User entity com ID do MongoDB
                
                %% Response
                Service-->>Controller: User entity salvo
                Controller->>Controller: Mapear para UserResponseDTO<br/>{id, name, email, createdAt, updatedAt}
                Controller-->>Client: 201 Created<br/>{"success": true, "data": {...}}
            end
        end
    end

    Note over Client, MongoDB: ✅ Usuário criado com sucesso!
```

## Camadas e Responsabilidades no Fluxo

### 🌐 **Presentation Layer**
- **Entrada**: Dados HTTP brutos
- **Responsabilidade**: Validação de formato, serialização
- **Saída**: DTOs para Application Layer

### 🔄 **Application Layer** 
- **Entrada**: DTOs validados
- **Responsabilidade**: Orquestração do caso de uso
- **Saída**: Entidades Domain para Infrastructure

### 🎯 **Domain Layer**
- **Entrada**: Dados para criar entidades
- **Responsabilidade**: Regras de negócio e validações
- **Saída**: Entidades válidas

### 🏗️ **Infrastructure Layer**
- **Entrada**: Entidades Domain
- **Responsabilidade**: Persistência e operações I/O
- **Saída**: Entidades persistidas

## Pontos de Validação

### 1️⃣ **Validation Middleware (Presentation)**
```typescript
// Validação de formato HTTP
body('name').isLength({ min: 2, max: 100 })
body('email').isEmail()
body('password').isLength({ min: 6 })
```

### 2️⃣ **Value Objects (Domain)**
```typescript
// Validação de regras de domínio
constructor(email: string) {
  if (!this.isValid(email)) {
    throw new Error('Email inválido');
  }
}
```

### 3️⃣ **Entities (Domain)**
```typescript
// Validação de regras de negócio
public isValidName(): boolean {
  return this.name.length >= 2 && this.name.length <= 100;
}
```

### 4️⃣ **Business Logic (Application)**
```typescript
// Validação de regras de aplicação
const existingUser = await this.userRepository.findByEmail(userData.email);
if (existingUser) {
  throw new Error('Email já está em uso');
}
```

## Tratamento de Erros

Erros podem ocorrer em qualquer camada e são propagados até a Presentation:

```
Domain Error → Application → Presentation → HTTP Response
Infrastructure Error → Application → Presentation → HTTP Response
Validation Error → Presentation → HTTP Response
``` 