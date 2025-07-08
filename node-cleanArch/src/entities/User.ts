export class User {
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private readonly createdAt: Date = new Date()
  ) {
    this.validateEmail(email);
    this.validateName(name);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  updateName(name: string): void {
    this.validateName(name);
    this.name = name;
  }

  updateEmail(email: string): void {
    this.validateEmail(email);
    this.email = email;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }
} 