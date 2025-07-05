import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserService } from '../../domain/services/UserService';

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { name, email } = request;

    // Validar se o email já existe
    await this.userService.validateUniqueEmail(email);

    // Criar o usuário
    const userId = uuidv4();
    const user = User.create(userId, name, email);

    // Salvar no repositório
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    };
  }
} 