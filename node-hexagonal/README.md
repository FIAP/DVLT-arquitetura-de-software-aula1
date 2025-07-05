# Exemplo de Arquitetura Hexagonal - Node.js + TypeScript

Este projeto demonstra a implementação da **Arquitetura Hexagonal** (também conhecida como Ports and Adapters) usando Node.js e TypeScript.

## Estrutura do Projeto

```
src/
├── domain/                 # Camada de Domínio
│   ├── entities/          # Entidades de negócio
│   │   ├── User.ts
│   │   └── User.test.ts   # Testes da entidade
│   ├── repositories/      # Ports (interfaces)
│   │   └── UserRepository.ts
│   └── services/          # Serviços de domínio
│       └── UserService.ts
├── application/           # Camada de Aplicação
│   └── use-cases/         # Casos de uso
│       ├── CreateUserUseCase.ts
│       ├── CreateUserUseCase.test.ts
│       ├── GetUserUseCase.ts
│       └── ListUsersUseCase.ts
├── infrastructure/        # Camada de Infraestrutura
│   ├── config/           # Configurações
│   │   └── DependencyInjection.ts
│   ├── repositories/     # Adapters (implementações)
│   │   ├── InMemoryUserRepository.ts
│   │   └── InMemoryUserRepository.test.ts
│   └── web/              # Adapter web
│       ├── controllers/
│       │   └── UserController.ts
│       ├── routes/
│       │   └── userRoutes.ts
│       └── server.ts
├── index.ts              # Ponto de entrada
├── requests.http         # Arquivo com requisições HTTP para testes
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
├── jest.config.js        # Configuração do Jest
├── docs/                 # Documentação da arquitetura
│   ├── README.md         # Índice da documentação
│   ├── architecture-diagram.md   # Diagrama da arquitetura
│   ├── ports-and-adapters.md    # Detalhamento de ports e adapters
│   └── layers-explanation.md    # Explicação das camadas
└── README.md             # Documentação do projeto
```

## Conceitos da Arquitetura Hexagonal

### 1. Domínio (Domain)
- **Entidades**: Contêm as regras de negócio e lógica principal
- **Ports**: Interfaces que definem contratos para comunicação externa
- **Serviços de Domínio**: Lógica de negócio que não pertence a uma entidade específica

### 2. Aplicação (Application)
- **Casos de Uso**: Orquestram a lógica de negócio e coordenam as operações

### 3. Infraestrutura (Infrastructure)
- **Adapters**: Implementações concretas dos ports
- **Controllers**: Adaptam as requisições HTTP para os casos de uso
- **Repositórios**: Implementações de persistência de dados

## Benefícios da Arquitetura

1. **Testabilidade**: Fácil de testar pois o domínio é isolado
2. **Flexibilidade**: Fácil troca de implementações (ex: banco de dados)
3. **Manutenibilidade**: Separação clara de responsabilidades
4. **Independência**: Domínio não depende de frameworks externos

## 📚 Documentação Detalhada

Para um entendimento completo da arquitetura implementada, consulte a documentação na pasta `docs/`:

- 📊 **[Diagrama da Arquitetura](./docs/architecture-diagram.md)**: Visualização completa da arquitetura hexagonal
- 🔌 **[Ports and Adapters](./docs/ports-and-adapters.md)**: Detalhamento do padrão fundamental
- 🏗️ **[Explicação das Camadas](./docs/layers-explanation.md)**: Análise detalhada das camadas
- 📋 **[Resumo da Implementação](./docs/implementation-summary.md)**: Resumo completo do projeto

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Testes

### Testes Automatizados (Jest)
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Testes da API (requests.http)
O arquivo `requests.http` contém uma coleção completa de testes organizados por categorias:

1. **Health Check**: Verificar se o servidor está rodando
2. **Criar Usuários**: Testes de criação com dados válidos
3. **Listar Usuários**: Buscar todos os usuários
4. **Buscar por ID**: Testes de busca individual
5. **Validação**: Testes de casos de erro
6. **Casos Extras**: Normalização de dados

#### Como usar:
1. **VS Code**: Instale a extensão "REST Client"
2. **IntelliJ IDEA**: Suporte nativo 
3. Certifique-se de que o servidor está rodando (`npm run dev`)
4. Execute as requisições clicando em "Send Request" ou usando atalhos

## Endpoints da API

### Criar usuário
```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

### Buscar usuário
```http
GET /api/users/{id}
```

### Listar usuários
```http
GET /api/users
```

### Health Check
```http
GET /health
```

## Exemplo de Uso

### Usando o arquivo requests.http (Recomendado)
O projeto inclui um arquivo `requests.http` com todos os testes da API organizados. Você pode usar:

- **VS Code**: Instale a extensão "REST Client" e execute as requisições diretamente no editor
- **IntelliJ IDEA**: Suporte nativo para arquivos `.http`
- **Postman**: Importe as requisições do arquivo

### Usando curl
```bash
# Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Thiago S Adriano", "email": "thiagoadriano@fiap.com.br"}'

# Listar usuários
curl http://localhost:3000/api/users

# Buscar usuário específico
  curl http://localhost:3000/api/users/{id}

# Health check
curl http://localhost:3000/health
```

## Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Express**: Framework web para Node.js
- **Jest**: Framework de testes
- **UUID**: Geração de identificadores únicos

## Patterns Implementados

1. **Ports and Adapters**: Separação entre domínio e infraestrutura
2. **Dependency Injection**: Inversão de dependências
3. **Repository Pattern**: Abstração do acesso a dados
4. **Use Case Pattern**: Encapsulamento de regras de negócio
5. **Factory Pattern**: Criação controlada de entidades

## Características da Arquitetura

- **Testabilidade**: Domínio completamente isolado e testável
- **Flexibilidade**: Fácil substituição de implementações
- **Manutenibilidade**: Código organizado e com responsabilidades bem definidas
- **Independência**: Domínio não depende de frameworks externos