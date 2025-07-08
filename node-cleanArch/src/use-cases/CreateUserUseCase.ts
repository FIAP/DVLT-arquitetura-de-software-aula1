import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/User';
import { UserRepository } from './ports/UserRepository';
import { CreateUserDTO, UserResponseDTO } from './dtos/UserDTO';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: CreateUserDTO): Promise<UserResponseDTO> {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criar nova entidade User
    const user = new User(
      uuidv4(),
      userData.name,
      userData.email
    );

    // Salvar no repositório
    await this.userRepository.save(user);

    // Retornar DTO de resposta
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt()
    };
  }
} 