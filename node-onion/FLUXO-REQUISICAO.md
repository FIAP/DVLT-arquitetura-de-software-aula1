# Fluxo de Requisição na Arquitetura Onion

Este documento demonstra como uma requisição flui através das camadas da arquitetura Onion.

## Exemplo: Criar um Usuário

### Requisição HTTP
```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Fluxo Completo

#### 1. Camada Presentation (Entrada)
```typescript
// src/presentation/routes/userRoutes.ts
// A requisição chega na rota
router.post('/', validationMiddleware, userController.createUser);

// src/presentation/middlewares/validateRequest.ts
// Validação dos dados de entrada
validateRequest(req, res, next);

// src/presentation/controllers/UserController.ts
// Controller processa a requisição
public createUser = async (req: Request, res: Response) => {
  const userData: CreateUserDTO = req.body;
  const user = await this.userService.createUser(userData);
  // Retorna resposta HTTP
}
```

#### 2. Camada Application (Orquestração)
```typescript
// src/application/services/UserService.ts
// Serviço coordena a lógica de negócio
async createUser(userData: CreateUserDTO): Promise<User> {
  // 1. Verifica se email já existe
  const existingUser = await this.userRepository.findByEmail(userData.email);
  
  // 2. Valida email usando Value Object
  const email = new Email(userData.email);
  
  // 3. Hash da senha
  const hashedPassword = await this.passwordHasher.hash(userData.password);
  
  // 4. Cria entidade User
  const user = new User(id, name, email, hashedPassword, dates);
  
  // 5. Valida regras de negócio
  if (!user.isValidName()) {
    throw new Error('Nome inválido');
  }
  
  // 6. Salva no repositório
  return await this.userRepository.save(user);
}
```

#### 3. Camada Domain (Regras de Negócio)
```typescript
// src/domain/value-objects/Email.ts
// Validação de email
constructor(email: string) {
  if (!this.isValid(email)) {
    throw new Error('Email inválido');
  }
}

// src/domain/entities/User.ts
// Entidade com regras de negócio
public isValidName(): boolean {
  return this.name.length >= 2 && this.name.length <= 100;
}
```

#### 4. Camada Infrastructure (Implementação)
```typescript
// src/infrastructure/security/BcryptPasswordHasher.ts
// Implementação do hash de senha
async hash(password: string): Promise<string> {
  return await bcrypt.hash(password, this.saltRounds);
}

// src/infrastructure/repositories/MongoUserRepository.ts
// Implementação do repositório
async save(user: User): Promise<User> {
  const userDoc = new UserModel({
    _id: user.id,
    name: user.name,
    email: user.email,
    password: user.password
  });
  
  const savedUser = await userDoc.save();
  return this.toDomainEntity(savedUser);
}
```

#### 5. Banco de Dados
```typescript
// src/infrastructure/database/mongoose/UserModel.ts
// Modelo Mongoose salva no MongoDB
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
```

### Diagrama de Fluxo

```
Cliente HTTP
    ↓
🌐 Presentation Layer
    ├── Routes (userRoutes.ts)
    ├── Middleware (validateRequest.ts)
    └── Controller (UserController.ts)
    ↓
🔄 Application Layer
    ├── Service (UserService.ts)
    ├── DTOs (UserDTOs.ts)
    └── Interfaces (IPasswordHasher.ts)
    ↓
🎯 Domain Layer
    ├── Entity (User.ts)
    ├── Value Object (Email.ts)
    └── Repository Interface (IUserRepository.ts)
    ↓
🏗️ Infrastructure Layer
    ├── Repository Implementation (MongoUserRepository.ts)
    ├── Security Implementation (BcryptPasswordHasher.ts)
    └── Database Model (UserModel.ts)
    ↓
📊 MongoDB Database
```

## Princípios Demonstrados

### 1. Inversão de Dependência
- `UserService` depende de `IUserRepository` (interface)
- `MongoUserRepository` implementa `IUserRepository`
- A dependência flui de fora para dentro

### 2. Separação de Responsabilidades
- **Presentation**: Validação HTTP, serialização
- **Application**: Orquestração, casos de uso
- **Domain**: Regras de negócio puras
- **Infrastructure**: Implementações técnicas

### 3. Testabilidade
- Cada camada pode ser testada isoladamente
- Interfaces permitem mocking
- Regras de negócio são independentes

### 4. Flexibilidade
- Trocar MongoDB por PostgreSQL: apenas Infrastructure
- Trocar Express por Fastify: apenas Presentation
- Alterar hash de senha: apenas Infrastructure

## Vantagens desta Arquitetura

1. **Manutenibilidade**: Código bem organizado e fácil de entender
2. **Testabilidade**: Fácil de testar cada camada
3. **Flexibilidade**: Fácil de trocar implementações
4. **Escalabilidade**: Adicionar novas features sem afetar existentes
5. **Independência**: Núcleo independente de frameworks

## Fluxo de Erro

Se algo der errado em qualquer camada:

```
Error originado em qualquer camada
    ↓
Propagado para cima
    ↓
Capturado pelo Controller
    ↓
Tratado pelo ErrorHandler Middleware
    ↓
Resposta HTTP de erro padronizada
```

Exemplo de erro:
```json
{
  "success": false,
  "message": "Email já está em uso",
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

## Conclusão

A arquitetura Onion garante que:
- As regras de negócio estão protegidas no núcleo
- As dependências fluem sempre para dentro
- Cada camada tem uma responsabilidade específica
- O código é altamente testável e flexível

Esta organização facilita a manutenção e evolução do software ao longo do tempo. 