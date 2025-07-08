# CQRS Demo com Node.js

Este projeto demonstra a implementação do padrão **CQRS (Command Query Responsibility Segregation)** usando Node.js, PostgreSQL (escrita) e MongoDB (leitura).

> 🚀 **Quer começar rapidamente?** Veja o [Guia de Início Rápido](INICIO-RAPIDO.md)

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    API Client   │    │   Node.js API   │    │   Event Store   │
│                 │    │                 │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Commands      │    │   Queries       │    │   Event         │
│   (Write)       │    │   (Read)        │    │   Handlers      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │    MongoDB      │    │   Sincronização │
│   (Write DB)    │    │   (Read DB)     │    │   Assíncrona    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Características

- **Separação clara** entre operações de escrita (Commands) e leitura (Queries)
- **Event Sourcing** com Event Store no PostgreSQL
- **Sincronização assíncrona** entre bases de dados
- **Replay de eventos** para reconstruir o estado
- **API REST** completa com documentação
- **Validação de dados** usando Joi
- **Paginação e filtros** nas consultas
- **Rotas administrativas** para debug e manutenção

## Pré-requisitos

- Node.js 16+
- Docker e Docker Compose
- npm ou yarn

## Instalação e Execução

### Opção 1: Setup Automático (Recomendado)
```bash
# Setup completo automático
npm run quick-setup

# Aguardar a mensagem de conclusão, depois executar:
npm run dev
```

### Opção 2: Setup Manual

#### 1. Instalar dependências
```bash
npm install
```

#### 2. Iniciar as bases de dados com Docker
```bash
# Iniciar PostgreSQL e MongoDB
docker-compose up -d

# Verificar se os containers estão rodando
docker ps
```

#### 3. Aguardar containers iniciarem
```bash
# Aguardar 30-60 segundos para garantir que as bases estejam prontas
# Ou verificar os logs:
docker-compose logs -f
```

#### 4. Executar a aplicação
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🎯 Início Rápido

Prefere ir direto ao ponto? Execute apenas:

```bash
# 1. Setup automático (aguarde 30s)
npm run quick-setup

# 2. Executar aplicação
npm run dev

# 3. Testar CQRS
npm test
```

Pronto! Acesse http://localhost:3000

## 🧪 Testando a API

### Opção 1: Script Automatizado
```bash
npm test
```

### Opção 2: Requests HTTP (Recomendado)
Use o arquivo `requests.http` para testar manualmente:

1. **Abra o arquivo `requests.http`** no VS Code (instale a extensão REST Client)
2. **Execute os requests** clicando em "Send Request" 
3. **Veja a separação** clara entre Commands (escrita) e Queries (leitura)
4. **Teste diferentes cenários** como paginação, filtros, e casos extremos

O arquivo inclui:
- ✅ Health checks e documentação
- ✅ Commands (POST, PUT, DELETE) - PostgreSQL
- ✅ Queries (GET com filtros) - MongoDB  
- ✅ Rotas administrativas e Event Store
- ✅ Fluxos completos de teste CQRS
- ✅ Casos extremos e validações

## Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração das bases de dados
├── models/
│   └── ProductRead.js       # Modelo MongoDB (leitura)
├── commands/
│   └── ProductCommands.js   # Comandos de escrita
├── queries/
│   └── ProductQueries.js    # Consultas de leitura
├── eventStore/
│   └── EventStore.js        # Gerenciamento de eventos
├── eventHandlers/
│   └── ProductEventHandler.js # Manipulação de eventos
├── routes/
│   └── products.js          # Rotas da API
└── app.js                   # Aplicação principal
```

## Fluxo CQRS

### 1. Operações de Escrita (Commands)
```bash
# Criar produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Gamer",
    "description": "Notebook para jogos",
    "price": 3500.00,
    "stockQuantity": 5
  }'

# Atualizar produto
curl -X PUT http://localhost:3000/api/products/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "price": 3200.00,
    "stockQuantity": 3
  }'

# Deletar produto
curl -X DELETE http://localhost:3000/api/products/{id}
```

### 2. Operações de Leitura (Queries)
```bash
# Listar todos os produtos
curl http://localhost:3000/api/products

# Buscar produto por ID
curl http://localhost:3000/api/products/{id}

# Pesquisar produtos
curl http://localhost:3000/api/products/search/notebook

# Buscar por faixa de preço
curl http://localhost:3000/api/products/price-range/1000/5000

# Produtos em estoque
curl http://localhost:3000/api/products/in-stock/list

# Estatísticas
curl http://localhost:3000/api/products/stats/overview
```

### 3. Rotas Administrativas
```bash
# Listar eventos
curl http://localhost:3000/api/products/admin/events

# Eventos de um produto específico
curl http://localhost:3000/api/products/admin/events/{productId}

# Sincronizar dados
curl -X POST http://localhost:3000/api/products/admin/sync

# Replay de eventos
curl -X POST http://localhost:3000/api/products/admin/replay
```

## 📋 Arquivo requests.http

O projeto inclui um arquivo `requests.http` completo para testar todas as funcionalidades:

### Como usar:
1. **VS Code**: Instale a extensão "REST Client"
2. **Abra**: `requests.http` 
3. **Execute**: Clique em "Send Request" em cada seção

### Organização do arquivo:
- **Health Checks**: Verificar se API está funcionando
- **Commands (Write)**: POST, PUT, DELETE - escrevem no PostgreSQL
- **Queries (Read)**: GET com filtros - leem do MongoDB
- **Admin**: Event Store, sincronização, replay
- **Fluxos Completos**: Demonstrações passo-a-passo
- **Casos Extremos**: Validações e erro handling

### Variáveis automáticas:
O arquivo usa variáveis para facilitar os testes:
```http
@baseUrl = http://localhost:3000
@productId = {{createProduct.response.body.data.id}}
```

### Demonstração CQRS:
- Crie um produto → veja no PostgreSQL  
- Execute query → veja dados sincronizados no MongoDB
- Verifique eventos → veja histórico no Event Store

## Demonstração do Fluxo CQRS

### 1. Criar um produto (Command)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Smartphone Android",
    "price": 1200.00,
    "stockQuantity": 20
  }'
```

**O que acontece:**
1. Dados são validados
2. Produto é salvo no PostgreSQL (Write DB)
3. Evento `ProductCreated` é salvo no Event Store
4. Event Handler processa o evento assincronamente
5. Produto é sincronizado no MongoDB (Read DB)

### 2. Consultar produtos (Query)
```bash
curl http://localhost:3000/api/products
```

**O que acontece:**
1. Consulta é executada no MongoDB (Read DB)
2. Dados otimizados para leitura são retornados
3. Paginação e filtros são aplicados

### 3. Verificar eventos
```bash
curl http://localhost:3000/api/products/admin/events
```

**O que acontece:**
1. Todos os eventos são listados do Event Store
2. Mostra o histórico completo de mudanças

## Endpoints da API

### Documentação
- `GET /` - Informações da API
- `GET /docs` - Documentação completa
- `GET /health` - Health check

### Commands (Escrita)
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Queries (Leitura)
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `GET /api/products/search/:term` - Pesquisar
- `GET /api/products/price-range/:min/:max` - Faixa de preço
- `GET /api/products/in-stock/list` - Em estoque
- `GET /api/products/stats/overview` - Estatísticas

### Admin
- `GET /api/products/admin/events` - Listar eventos
- `GET /api/products/admin/events/:id` - Eventos do produto
- `POST /api/products/admin/sync` - Sincronizar
- `POST /api/products/admin/replay` - Replay eventos

## Parâmetros de Query

### Paginação
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

### Ordenação
- `sortBy` - Campo para ordenação (padrão: createdAt)
- `sortOrder` - Ordem (asc/desc, padrão: desc)

### Exemplo
```bash
curl 'http://localhost:3000/api/products?page=1&limit=5&sortBy=price&sortOrder=asc'
```

## Comandos Docker

### Versão Simples (Recomendada para Desenvolvimento)
```bash
# Iniciar containers sem autenticação MongoDB
docker-compose -f docker-compose-simple.yml up -d

# Parar containers
docker-compose -f docker-compose-simple.yml down

# Ver logs
docker-compose -f docker-compose-simple.yml logs -f
```

### Versão Completa (Com Autenticação)
```bash
# Iniciar containers com autenticação
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f
```

### Comandos Gerais
```bash
# Reiniciar containers
docker-compose restart

# Limpar dados completamente
docker-compose down -v
docker-compose -f docker-compose-simple.yml down -v

# Ver status dos containers
docker ps | grep cqrs
```

## Monitoramento

### Logs da aplicação
```bash
npm run dev
```

### Logs do PostgreSQL
```bash
docker logs cqrs-postgres
```

### Logs do MongoDB
```bash
docker logs cqrs-mongodb
```

## Testando a Sincronização

### 1. Verificar dados antes
```bash
# PostgreSQL (Write)
docker exec -it cqrs-postgres psql -U admin -d cqrs_write -c "SELECT * FROM products;"

# MongoDB (Read)
curl http://localhost:3000/api/products
```

### 2. Criar produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "price": 100, "stockQuantity": 10}'
```

### 3. Verificar sincronização
```bash
# Verificar evento
curl http://localhost:3000/api/products/admin/events

# Verificar sincronização
curl http://localhost:3000/api/products
```

## Vantagens do CQRS Demonstradas

1. **Separação de Responsabilidades**: Commands e Queries são independentes
2. **Otimização**: Read DB otimizado para consultas
3. **Escalabilidade**: Bases podem ser escaladas independentemente
4. **Auditoria**: Event Store mantém histórico completo
5. **Flexibilidade**: Pode usar diferentes tecnologias para cada lado
6. **Resilência**: Replay de eventos permite reconstruir estado

## Próximos Passos

- Implementar retry logic para eventos
- Adicionar dead letter queue
- Implementar snapshots
- Adicionar métricas e monitoramento
- Implementar testes automatizados
- Adicionar autenticação e autorização

## Scripts Disponíveis

```bash
npm run quick-setup      # Configuração rápida (recomendado)
npm run setup            # Configuração completa com verificações
npm run dev              # Executar em desenvolvimento
npm run test             # Testar o CQRS
npm run docker:simple    # Iniciar containers (versão simples)
npm run docker:simple:down  # Parar containers (versão simples)
npm run docker:up        # Iniciar containers (versão completa)
npm run docker:down      # Parar containers (versão completa)
```

## Troubleshooting

### Problema: MongoDB - Erro de autenticação ou conexão
Se aparecer "Authentication failed" ou problemas de conexão:

```bash
# Solução 1: Use o setup rápido (sem autenticação)
npm run quick-setup
npm run dev

# Solução 2: Reiniciar containers com versão simples
docker-compose down -v
docker-compose -f docker-compose-simple.yml up -d
sleep 30
npm run dev

# Solução 3: Setup manual com tempo de espera
docker-compose down -v
docker-compose up -d
sleep 60  # Aguardar containers ficarem prontos
npm run dev
```

### Problema: Containers não iniciam
```bash
# Limpar e reiniciar tudo
docker-compose down -v
docker system prune -f
docker-compose up -d

# Aguardar containers estarem prontos
docker-compose logs -f
```

### Problema: Erro de conexão
```bash
# Verificar se as portas estão disponíveis
lsof -i :3000  # API
lsof -i :5432  # PostgreSQL
lsof -i :27017 # MongoDB

# Verificar status dos containers
docker ps
docker-compose ps

# Ver logs dos containers
docker-compose logs postgres
docker-compose logs mongodb
```

### Problema: Dados não sincronizam
```bash
# Verificar se a aplicação está rodando
curl http://localhost:3000/health

# Forçar sincronização manual
curl -X POST http://localhost:3000/api/products/admin/sync

# Replay de eventos para reconstruir dados
curl -X POST http://localhost:3000/api/products/admin/replay

# Verificar eventos no Event Store
curl http://localhost:3000/api/products/admin/events
```

### Problema: Aplicação não conecta às bases
```bash
# Verificar se containers estão rodando
docker ps | grep cqrs

# Testar conexão PostgreSQL
docker exec -it cqrs-postgres pg_isready -U admin

# Testar conexão MongoDB (versão nova)
docker exec -it cqrs-mongodb mongosh --eval "db.runCommand('ping')"

# Testar conexão MongoDB (versão antiga)
docker exec -it cqrs-mongodb mongo --eval "db.runCommand('ping')"
```

### Problema: Permissões Docker
```bash
# Linux: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Ou executar com sudo
sudo docker-compose up -d
```

---

Este projeto demonstra como implementar CQRS de forma prática e funcional, mostrando claramente a separação entre operações de escrita e leitura, com Event Sourcing e sincronização assíncrona. 