import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { UserService } from '../../domain/services/UserService';
import { User } from '../../domain/entities/User';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let userService: UserService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, userService);
  });

  it('deve criar um usuário com sucesso', async () => {
    const request = {
      name: 'João Silva',
      email: 'joao@email.com'
    };

    const result = await createUserUseCase.execute(request);

    expect(result).toEqual({
      id: 'mocked-uuid',
      name: 'João Silva',
      email: 'joao@email.com',
      createdAt: expect.any(Date)
    });
  });

  it('deve lançar erro se email já existir', async () => {
    // Criar um usuário primeiro
    const existingUser = User.create('existing-id', 'João Existente', 'joao@email.com');
    await userRepository.save(existingUser);

    const request = {
      name: 'João Novo',
      email: 'joao@email.com'
    };

    await expect(createUserUseCase.execute(request)).rejects.toThrow('Email já está em uso');
  });

  it('deve lançar erro se nome for inválido', async () => {
    const request = {
      name: '',
      email: 'joao@email.com'
    };

    await expect(createUserUseCase.execute(request)).rejects.toThrow('Nome é obrigatório');
  });

  it('deve lançar erro se email for inválido', async () => {
    const request = {
      name: 'João Silva',
      email: 'email-invalido'
    };

    await expect(createUserUseCase.execute(request)).rejects.toThrow('Email inválido');
  });
}); 