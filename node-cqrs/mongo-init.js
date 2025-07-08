// Script de inicialização do MongoDB
db = db.getSiblingDB('cqrs_read');

// Criar usuário para a aplicação
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'cqrs_read'
    }
  ]
});

// Criar coleção de produtos (opcional, será criada automaticamente)
db.createCollection('productreads');

print('MongoDB inicializado com sucesso para CQRS Demo'); 