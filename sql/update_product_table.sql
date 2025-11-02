-- Update product_data table to fix type mismatches
USE petsupplyecom;

-- Check current table structure
DESCRIBE product_data;

-- If columns already exist, just update the data and reorganize
-- First, let's see what we have
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'petsupplyecom' 
AND TABLE_NAME = 'product_data';

-- Temporarily disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Update price_decimal column if it exists
UPDATE product_data 
SET price_decimal = CAST(
    CASE 
        WHEN price REGEXP '^[0-9]+\.?[0-9]*$' THEN price 
        ELSE '0.00' 
    END AS DECIMAL(10,2)
)
WHERE id > 0;

-- Now reorganize the columns - drop old price and rename price_decimal
ALTER TABLE product_data DROP COLUMN IF EXISTS price;
ALTER TABLE product_data CHANGE COLUMN price_decimal price DECIMAL(10,2) DEFAULT 0.00;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Final verification
DESCRIBE product_data;
SELECT id, name, price, in_stock, rating FROM product_data LIMIT 5;