import { UserRepository } from './ports/UserRepository';
import { UserResponseDTO } from './dtos/UserDTO';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt()
    };
  }
} 