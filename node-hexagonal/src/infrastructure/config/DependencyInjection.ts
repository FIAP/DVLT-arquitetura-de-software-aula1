import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { CreateUserPort, GetUserPort, ListUsersPort } from '../../application/ports/UserUseCasesPorts';
import { UserService } from '../../domain/services/UserService';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { UserController } from '../web/controllers/UserController';

/**
 * Container de Injeção de Dependências
 * Implementa o padrão IoC (Inversion of Control) configurando todas as dependências
 */
export class DependencyInjection {
  // Secondary Ports (Output Ports) - Abstrações
  private readonly userRepository: UserRepository;
  
  // Domain Services
  private readonly userService: UserService;
  
  // Primary Ports (Input Ports) - Abstrações
  private readonly createUserPort: CreateUserPort;
  private readonly getUserPort: GetUserPort;
  private readonly listUsersPort: ListUsersPort;
  
  // Primary Adapters
  private readonly userController: UserController;

  constructor() {
    // 1. Configurar Secondary Adapters (Driven Adapters)
    this.userRepository = new InMemoryUserRepository(); // ← Implementação concreta

    // 2. Configurar Domain Services
    this.userService = new UserService(this.userRepository);

    // 3. Configurar Primary Ports através de suas implementações (Use Cases)
    this.createUserPort = new CreateUserUseCase(this.userRepository, this.userService);
    this.getUserPort = new GetUserUseCase(this.userRepository);
    this.listUsersPort = new ListUsersUseCase(this.userRepository);

    // 4. Configurar Primary Adapters (Driving Adapters)
    this.userController = new UserController(
      this.createUserPort,  // ← Injetando interface, não implementação
      this.getUserPort,     // ← Injetando interface, não implementação
      this.listUsersPort    // ← Injetando interface, não implementação
    );
  }

  // Factory Methods para Primary Adapters
  public getUserController(): UserController {
    return this.userController;
  }

  // Factory Methods para Secondary Ports (útil para testes)
  public getUserRepository(): UserRepository {
    return this.userRepository;
  }

  // Factory Methods para Primary Ports (útil para testes)
  public getCreateUserPort(): CreateUserPort {
    return this.createUserPort;
  }

  public getGetUserPort(): GetUserPort {
    return this.getUserPort;
  }

  public getListUsersPort(): ListUsersPort {
    return this.listUsersPort;
  }
}

/**
 * Exemplo de como configurar diferentes implementações:
 * 
 * // Para produção com PostgreSQL:
 * this.userRepository = new PostgreSQLUserRepository(dbConnection);
 * 
 * // Para testes:
 * this.userRepository = new MockUserRepository();
 * 
 * // Para cache:
 * this.userRepository = new CachedUserRepository(
 *   new PostgreSQLUserRepository(dbConnection),
 *   redisClient
 * );
 */ 