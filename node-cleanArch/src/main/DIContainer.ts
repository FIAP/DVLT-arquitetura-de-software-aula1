// Container de Injeção de Dependências - Main/Composition Root
import { CreateUserUseCase } from '../use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../use-cases/GetUserUseCase';
import { GetAllUsersUseCase } from '../use-cases/GetAllUsersUseCase';
import { UserController } from '../interface-adapters/controllers/UserController';
import { InMemoryUserRepository } from '../frameworks-drivers/database/InMemoryUserRepository';
import { ExpressServer } from '../frameworks-drivers/web/ExpressServer';

export class DIContainer {
  private static instance: DIContainer;
  private userRepository: InMemoryUserRepository;
  private createUserUseCase: CreateUserUseCase;
  private getUserUseCase: GetUserUseCase;
  private getAllUsersUseCase: GetAllUsersUseCase;
  private userController: UserController;
  private expressServer: ExpressServer;

  private constructor() {
    // Camada de Frameworks & Drivers
    this.userRepository = new InMemoryUserRepository();

    // Camada de Use Cases
    this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    this.getUserUseCase = new GetUserUseCase(this.userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(this.userRepository);

    // Camada de Interface Adapters
    this.userController = new UserController(
      this.createUserUseCase,
      this.getUserUseCase,
      this.getAllUsersUseCase
    );

    // Camada de Frameworks & Drivers
    this.expressServer = new ExpressServer(this.userController);
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public getExpressServer(): ExpressServer {
    return this.expressServer;
  }
} 