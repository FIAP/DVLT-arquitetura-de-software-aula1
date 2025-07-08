// Script de inicialização do MongoDB
db = db.getSiblingDB('onion_db');

// Criar usuário para a aplicação
db.createUser({
  user: 'onion_user',
  pwd: 'onion_password',
  roles: [
    {
      role: 'readWrite',
      db: 'onion_db'
    }
  ]
});

// Criar coleção de usuários com alguns dados de exemplo
db.users.insertMany([
  {
    _id: ObjectId(),
    name: 'João Silva',
    email: 'joao@email.com',
    password: '$2a$10$example.hash.here',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '$2a$10$example.hash.here',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Banco de dados inicializado com sucesso!'); 