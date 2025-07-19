ALTER TABLE transacoes ADD COLUMN data_fatura DATE;
ALTER TABLE transacoes ADD COLUMN recorrente BOOLEAN DEFAULT 0;
