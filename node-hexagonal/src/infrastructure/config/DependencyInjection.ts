import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { UserService } from '../../domain/services/UserService';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { UserController } from '../web/controllers/UserController';

export class DependencyInjection {
  private userRepository: UserRepository;
  private userService: UserService;
  private createUserUseCase: CreateUserUseCase;
  private getUserUseCase: GetUserUseCase;
  private listUsersUseCase: ListUsersUseCase;
  private userController: UserController;

  constructor() {
    // Repositórios
    this.userRepository = new InMemoryUserRepository();

    // Serviços de domínio
    this.userService = new UserService(this.userRepository);

    // Casos de uso
    this.createUserUseCase = new CreateUserUseCase(this.userRepository, this.userService);
    this.getUserUseCase = new GetUserUseCase(this.userRepository);
    this.listUsersUseCase = new ListUsersUseCase(this.userRepository);

    // Controllers
    this.userController = new UserController(
      this.createUserUseCase,
      this.getUserUseCase,
      this.listUsersUseCase
    );
  }

  public getUserController(): UserController {
    return this.userController;
  }

  public getUserRepository(): UserRepository {
    return this.userRepository;
  }
} 