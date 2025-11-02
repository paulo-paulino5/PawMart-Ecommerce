-- View all users in the customer_data table
USE petsupplyecom;

-- Check if the customer_data table exists
SHOW TABLES LIKE 'customer_data';

-- If the table exists, show its structure
DESCRIBE customer_data;

-- View all registered users
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    created_at,
    is_active
FROM customer_data 
ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM customer_data;

-- Show only active users
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    created_at
FROM customer_data 
WHERE is_active = TRUE
ORDER BY created_at DESC;