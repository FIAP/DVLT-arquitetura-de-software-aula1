import { DependencyInjection } from './infrastructure/config/DependencyInjection';
import { Server } from './infrastructure/web/server';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Configurar injeção de dependências
const di = new DependencyInjection();

// Criar e iniciar servidor
const server = new Server(di.getUserController());
server.start(PORT); 