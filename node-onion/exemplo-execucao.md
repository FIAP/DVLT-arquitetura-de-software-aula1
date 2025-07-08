# Exemplo de Execução do Projeto

Este arquivo demonstra como executar o projeto passo a passo.

## 1. Instalação das Dependências

```bash
# Instalar as dependências do projeto
npm install
```

## 2. Inicializar o Banco de Dados

```bash
# Inicializar o MongoDB com Docker
npm run docker:up

# Verificar se os containers estão rodando
docker ps
```

Você deve ver algo como:
```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                      NAMES
abc123def456   mongo:7.0          "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:27017->27017/tcp   onion-mongodb
def456ghi789   mongo-express:1.0  "tini -- /docker-ent…"   2 minutes ago   Up 2 minutes   0.0.0.0:8081->8081/tcp     onion-mongo-express
```

## 3. Executar a Aplicação

```bash
# Executar em modo desenvolvimento
npm run dev
```

Você deve ver a seguinte saída:
```
Conectado ao MongoDB com sucesso
Servidor rodando na porta 3000
Ambiente: development
Endpoints disponíveis:
  - Saúde: http://localhost:3000/health
  - Info: http://localhost:3000/api/info
  - Usuários: http://localhost:3000/api/users
```

## 4. Testar os Endpoints

### Verificar Saúde da Aplicação
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "message": "Aplicação funcionando corretamente"
}
```

### Obter Informações da Arquitetura
```bash
curl http://localhost:3000/api/info
```

### Criar um Usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Silva",
    "email": "carlos@email.com",
    "password": "senha123456"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "1701940200000abc123def",
    "name": "Carlos Silva",
    "email": "carlos@email.com",
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T10:30:00.000Z"
  }
}
```

### Listar Todos os Usuários
```bash
curl http://localhost:3000/api/users
```

### Buscar Usuário por ID
```bash
# Substitua USER_ID pelo ID retornado na criação
curl http://localhost:3000/api/users/1701940200000abc123def
```

### Atualizar um Usuário
```bash
# Substitua USER_ID pelo ID retornado na criação
curl -X PUT http://localhost:3000/api/users/1701940200000abc123def \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Santos"
  }'
```

### Deletar um Usuário
```bash
# Substitua USER_ID pelo ID retornado na criação
curl -X DELETE http://localhost:3000/api/users/1701940200000abc123def
```

## 5. Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm test -- --coverage
```

## 6. Acessar o MongoDB Admin

Abra o navegador e acesse: http://localhost:8081

Você pode visualizar e gerenciar os dados do MongoDB através da interface web.

## 7. Parar a Aplicação

```bash
# Parar a aplicação (Ctrl+C no terminal onde está rodando)
# Parar os containers Docker
npm run docker:down
```

## Troubleshooting

### Erro de Conexão com MongoDB
Se você receber erro de conexão:
1. Verifique se o Docker está rodando
2. Confirme que os containers estão ativos: `docker ps`
3. Reinicie os containers: `npm run docker:down && npm run docker:up`

### Porta já em uso
Se a porta 3000 estiver em uso:
1. Altere a porta no arquivo `.env`
2. Ou finalize o processo que está usando a porta

### Problemas de Dependências
Se houver problemas com as dependências:
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Explorando a Arquitetura

O projeto demonstra os seguintes conceitos da Arquitetura Onion:

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
2. **Inversão de Dependência**: As camadas internas definem interfaces que são implementadas pelas externas
3. **Testabilidade**: Código facilmente testável devido ao baixo acoplamento
4. **Flexibilidade**: Fácil substituição de componentes sem afetar outras camadas

Explore o código-fonte para entender melhor como esses princípios são aplicados! 