# Documentação CQRS Node.js

Esta pasta contém a documentação completa do projeto CQRS Node.js, incluindo diagramas, guias e exemplos práticos.

## 📋 Índice

### 🏗️ Diagramas de Arquitetura
- [Arquitetura Geral CQRS](./diagramas/01-arquitetura-geral.md)
- [Fluxo de Commands (Escrita)](./diagramas/02-fluxo-commands.md)
- [Fluxo de Queries (Leitura)](./diagramas/03-fluxo-queries.md)
- [Event Store e Event Sourcing](./diagramas/04-event-store.md)
- [Estrutura do Código](./diagramas/05-estrutura-codigo.md)
- [Componentes Detalhados](./diagramas/06-componentes-detalhados.md)

### 📖 Guias
- [Como Funciona o CQRS](./guias/como-funciona-cqrs.md)
- [Event Sourcing Explicado](./guias/event-sourcing.md)
- [Padrões Implementados](./guias/padroes-implementados.md)
- [Boas Práticas](./guias/boas-praticas.md)

### 💡 Exemplos Práticos
- [Cenários de Uso](./exemplos/cenarios-uso.md)
- [Testes Completos](./exemplos/testes-completos.md)
- [Casos de Erro](./exemplos/casos-erro.md)

## 🎯 O que é CQRS?

**Command Query Responsibility Segregation (CQRS)** é um padrão arquitetural que separa as operações de **leitura** (queries) das operações de **escrita** (commands).

### Principais Características:

1. **Separação de Responsabilidades**
   - Commands: Modificam estado (CREATE, UPDATE, DELETE)
   - Queries: Consultam dados (READ)

2. **Bases de Dados Diferentes**
   - Escrita: PostgreSQL (ACID, Transações)
   - Leitura: MongoDB (Performance, Flexibilidade)

3. **Event Sourcing**
   - Todos os eventos são armazenados
   - Estado pode ser reconstruído
   - Auditoria completa

4. **Sincronização Assíncrona**
   - Event Handlers processam eventos
   - Read model é atualizado automaticamente

## 🚀 Benefícios Implementados

### Performance
- Queries otimizadas para leitura (MongoDB)
- Commands otimizados para escrita (PostgreSQL)
- Índices específicos para cada caso

### Escalabilidade
- Read e Write podem escalar independentemente
- Cache de leitura pode ser distribuído
- Processamento assíncrono de eventos

### Flexibilidade
- Modelos de leitura podem ser desnormalizados
- Queries complexas sem impacto na escrita
- Múltiplas views dos mesmos dados

### Auditoria
- Histórico completo de eventos
- Capacidade de replay
- Debug e analytics detalhados

## 🔧 Tecnologias Utilizadas

- **Node.js** + Express.js
- **PostgreSQL** (Write Database)
- **MongoDB** (Read Database)
- **Docker** + Docker Compose
- **Event Store** personalizado
- **Joi** para validação
- **Mongoose** para MongoDB
- **pg** para PostgreSQL

## 📁 Estrutura da Documentação

```
docs/
├── README.md (este arquivo)
├── diagramas/
│   ├── 01-arquitetura-geral.md
│   ├── 02-fluxo-commands.md
│   ├── 03-fluxo-queries.md
│   ├── 04-event-store.md
│   ├── 05-estrutura-codigo.md
│   └── 06-componentes-detalhados.md
├── guias/
│   ├── como-funciona-cqrs.md
│   ├── event-sourcing.md
│   ├── padroes-implementados.md
│   └── boas-praticas.md
└── exemplos/
    ├── cenarios-uso.md
    ├── testes-completos.md
    └── casos-erro.md
```

## 🎯 Como Usar Esta Documentação

1. **Iniciantes**: Comece com [Como Funciona o CQRS](./guias/como-funciona-cqrs.md)
2. **Desenvolvedores**: Veja os [Diagramas de Arquitetura](./diagramas/)
3. **Testadores**: Use os [Exemplos Práticos](./exemplos/)
4. **Arquitetos**: Revise os [Padrões Implementados](./guias/padroes-implementados.md)

---

> Esta documentação demonstra uma implementação completa e funcional do padrão CQRS com Event Sourcing em Node.js. 