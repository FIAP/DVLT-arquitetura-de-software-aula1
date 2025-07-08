// Camada Infrastructure - Configuração de Banco de Dados
// Configuração da conexão com MongoDB

import mongoose from 'mongoose';

export class MongoConnection {
  private static instance: MongoConnection;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(uri: string): Promise<void> {
    try {
      if (this.connected) {
        console.log('Já conectado ao MongoDB');
        return;
      }

      await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connected = true;
      console.log('Conectado ao MongoDB com sucesso');

      // Eventos de conexão
      mongoose.connection.on('disconnected', () => {
        console.log('Desconectado do MongoDB');
        this.connected = false;
      });

      mongoose.connection.on('error', (error) => {
        console.error('Erro na conexão com MongoDB:', error);
        this.connected = false;
      });

    } catch (error) {
      console.error('Erro ao conectar com MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
      console.log('Desconectado do MongoDB');
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
} 