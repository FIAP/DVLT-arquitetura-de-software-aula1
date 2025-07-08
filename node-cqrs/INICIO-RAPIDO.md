# 🚀 Início Rápido - CQRS Demo

## 📋 Pré-requisitos
- Node.js 16+
- Docker Desktop rodando

## ⚡ Setup em 1 Comando

```bash
npm run quick-setup
```

Aguarde a mensagem "🎉 Configuração concluída!" (cerca de 30 segundos)

## 🏃 Executar

```bash
npm run dev
```

## ✅ Testar

### Opção 1: Script Automatizado
```bash
npm test
```

### Opção 2: Requests HTTP (Mais Visual)
1. Abra `requests.http` no VS Code
2. Instale a extensão "REST Client"
3. Execute os requests clicando em "Send Request"
4. Veja Commands e Queries funcionando!

## 🌐 Acessar

- API: http://localhost:3000
- Docs: http://localhost:3000/docs

## 🎯 Exemplo Rápido

### 1. Criar Produto (Command)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "price": 1200.00,
    "stockQuantity": 10
  }'
```

### 2. Listar Produtos (Query)
```bash
curl http://localhost:3000/api/products
```

### 3. Ver Eventos
```bash
curl http://localhost:3000/api/products/admin/events
```

## 🔧 Problemas?

### Containers não iniciam
```bash
docker-compose down -v
npm run quick-setup
```

### Aplicação não conecta
```bash
# Aguardar mais tempo
sleep 60
npm run dev
```

### Dados não sincronizam
```bash
curl -X POST http://localhost:3000/api/products/admin/sync
```

---

Para mais detalhes, veja o [README.md](README.md) completo. 