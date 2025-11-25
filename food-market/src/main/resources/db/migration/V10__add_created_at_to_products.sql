ALTER TABLE products
    ADD COLUMN created_at TIMESTAMP;
-- Cập nhật dữ liệu cũ thành ngày 24/11/2025 15:27:00
UPDATE products
SET created_at = '2025-11-24 14:27:00'
WHERE created_at IS NULL;

ALTER TABLE products
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE products
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;