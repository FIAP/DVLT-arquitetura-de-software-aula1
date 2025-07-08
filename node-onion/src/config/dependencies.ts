// Configuração de Dependências
// Injeção de dependências seguindo os princípios da arquitetura Onion

import { UserService } from '../application/services/UserService';
import { UserController } from '../presentation/controllers/UserController';
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository';
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../application/interfaces/IPasswordHasher';

export class DependencyContainer {
  private static instance: DependencyContainer;
  
  private userRepository!: IUserRepository;
  private passwordHasher!: IPasswordHasher;
  private userService!: UserService;
  private userController!: UserController;

  private constructor() {
    this.configureDependencies();
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private configureDependencies(): void {
    // Camada Infrastructure
    this.userRepository = new MongoUserRepository();
    this.passwordHasher = new BcryptPasswordHasher();

    // Camada Application
    this.userService = new UserService(this.userRepository, this.passwordHasher);

    // Camada Presentation
    this.userController = new UserController(this.userService);
  }

  public getUserController(): UserController {
    return this.userController;
  }

  public getUserService(): UserService {
    return this.userService;
  }

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  public getPasswordHasher(): IPasswordHasher {
    return this.passwordHasher;
  }
} 