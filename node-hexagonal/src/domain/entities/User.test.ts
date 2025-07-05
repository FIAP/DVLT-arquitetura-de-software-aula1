import { User } from './User';

describe('User Entity', () => {
  describe('create', () => {
    it('deve criar um usuário com dados válidos', () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      
      expect(user.id).toBe('123');
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@email.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('deve normalizar o email para lowercase', () => {
      const user = User.create('123', 'João Silva', 'JOAO@EMAIL.COM');
      
      expect(user.email).toBe('joao@email.com');
    });

    it('deve remover espaços em branco do nome', () => {
      const user = User.create('123', '  João Silva  ', 'joao@email.com');
      
      expect(user.name).toBe('João Silva');
    });

    it('deve lançar erro se nome for vazio', () => {
      expect(() => {
        User.create('123', '', 'joao@email.com');
      }).toThrow('Nome é obrigatório');
    });

    it('deve lançar erro se nome for apenas espaços', () => {
      expect(() => {
        User.create('123', '   ', 'joao@email.com');
      }).toThrow('Nome é obrigatório');
    });

    it('deve lançar erro se email for inválido', () => {
      expect(() => {
        User.create('123', 'João Silva', 'email-invalido');
      }).toThrow('Email inválido');
    });

    it('deve lançar erro se email for vazio', () => {
      expect(() => {
        User.create('123', 'João Silva', '');
      }).toThrow('Email inválido');
    });
  });

  describe('toJSON', () => {
    it('deve retornar objeto JSON com propriedades do usuário', () => {
      const user = User.create('123', 'João Silva', 'joao@email.com');
      const json = user.toJSON();
      
      expect(json).toEqual({
        id: '123',
        name: 'João Silva',
        email: 'joao@email.com',
        createdAt: user.createdAt
      });
    });
  });
}); 