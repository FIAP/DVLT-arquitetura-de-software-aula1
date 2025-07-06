// PRIMARY PORTS - Interfaces que definem como usar a aplicação

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

export interface GetUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ListUsersResponse {
  users: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }[];
}

// PRIMARY PORTS (Input Ports) - Interfaces dos casos de uso
export interface CreateUserPort {
  execute(request: CreateUserRequest): Promise<CreateUserResponse>;
}

export interface GetUserPort {
  execute(id: string): Promise<GetUserResponse | null>;
}

export interface ListUsersPort {
  execute(): Promise<ListUsersResponse>;
}

// Agregação de todos os ports primários
export interface UserUseCasesPorts {
  createUser: CreateUserPort;
  getUser: GetUserPort;
  listUsers: ListUsersPort;
} 