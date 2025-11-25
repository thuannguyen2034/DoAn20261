CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER table products
    ADD COLUMN sold_count INTEGER;