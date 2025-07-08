import { UserRepository } from './ports/UserRepository';
import { UserResponseDTO } from './dtos/UserDTO';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    
    return users.map(user => ({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt()
    }));
  }
} 