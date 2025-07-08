-- Tabela de produtos para demonstrar o CQRS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos para Event Store
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_aggregate_id ON events(aggregate_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Inserir alguns dados de exemplo
INSERT INTO products (id, name, description, price, stock_quantity) VALUES
    (gen_random_uuid(), 'Notebook Dell', 'Notebook Dell Inspiron 15 3000', 2500.00, 10),
    (gen_random_uuid(), 'Mouse Logitech', 'Mouse sem fio Logitech MX Master 3', 350.00, 25),
    (gen_random_uuid(), 'Teclado Mecânico', 'Teclado mecânico RGB Corsair', 800.00, 15)
ON CONFLICT (id) DO NOTHING; 