// Ponto de entrada da aplicação
import { DIContainer } from './main/DIContainer';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Inicializar o container de dependências
const container = DIContainer.getInstance();

// Obter o servidor Express
const server = container.getExpressServer();

// Iniciar o servidor
server.start(PORT); 