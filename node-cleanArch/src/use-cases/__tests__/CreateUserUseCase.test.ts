import { CreateUserUseCase } from '../CreateUserUseCase';
import { UserRepository } from '../ports/UserRepository';
import { User } from '../../entities/User';

// Mock do repositório
class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.getId() === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.getEmail() === email) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.getId() === user.getId());
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.getId() !== id);
  }
}

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('deve criar um usuário com dados válidos', async () => {
    // Arrange
    const userData = {
      name: 'João Silva',
      email: 'joao@email.com'
    };

    // Act
    const result = await useCase.execute(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });

  it('deve lançar erro quando email já existe', async () => {
    // Arrange
    const userData = {
      name: 'João Silva',
      email: 'joao@email.com'
    };

    // Criar primeiro usuário
    await useCase.execute(userData);

    // Act & Assert
    await expect(useCase.execute(userData)).rejects.toThrow('Email já está em uso');
  });

  it('deve lançar erro com email inválido', async () => {
    // Arrange
    const userData = {
      name: 'João Silva',
      email: 'email-invalido'
    };

    // Act & Assert
    await expect(useCase.execute(userData)).rejects.toThrow('Email inválido');
  });

  it('deve lançar erro com nome inválido', async () => {
    // Arrange
    const userData = {
      name: 'J',
      email: 'joao@email.com'
    };

    // Act & Assert
    await expect(useCase.execute(userData)).rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
  });
}); 