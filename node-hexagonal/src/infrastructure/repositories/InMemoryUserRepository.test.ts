import { InMemoryUserRepository } from './InMemoryUserRepository';
import { User } from '../../domain/entities/User';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('save', () => {
    it('deve salvar um usuário', async () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      
      const savedUser = await repository.save(user);
      
      expect(savedUser).toEqual(user);
    });
  });

  describe('findById', () => {
    it('deve encontrar um usuário pelo id', async () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      await repository.save(user);
      
      const foundUser = await repository.findById('123');
      
      expect(foundUser).toEqual(user);
    });

    it('deve retornar null se usuário não existir', async () => {
      const foundUser = await repository.findById('inexistente');
      
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('deve encontrar um usuário pelo email', async () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      await repository.save(user);
      
      const foundUser = await repository.findByEmail('joao@email.com');
      
      expect(foundUser).toEqual(user);
    });

    it('deve encontrar usuário mesmo com email em caso diferente', async () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      await repository.save(user);
      
      const foundUser = await repository.findByEmail('JOAO@EMAIL.COM');
      
      expect(foundUser).toEqual(user);
    });

    it('deve retornar null se usuário não existir', async () => {
      const foundUser = await repository.findByEmail('inexistente@email.com');
      
      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const user1 = User.create('123', 'João Silva', 'joao@email.com');
      const user2 = User.create('456', 'Maria Santos', 'maria@email.com');
      
      await repository.save(user1);
      await repository.save(user2);
      
      const users = await repository.findAll();
      
      expect(users).toHaveLength(2);
      expect(users).toContain(user1);
      expect(users).toContain(user2);
    });

    it('deve retornar array vazio se não houver usuários', async () => {
      const users = await repository.findAll();
      
      expect(users).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('deve deletar um usuário existente', async () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      await repository.save(user);
      
      const deleted = await repository.delete('123');
      
      expect(deleted).toBe(true);
      
      const foundUser = await repository.findById('123');
      expect(foundUser).toBeNull();
    });

    it('deve retornar false se usuário não existir', async () => {
      const deleted = await repository.delete('inexistente');
      
      expect(deleted).toBe(false);
    });
  });
}); 