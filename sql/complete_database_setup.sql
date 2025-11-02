-- Comprehensive database setup and fix script for PetSupply
-- This script will create or fix all database issues

USE petsupplyecom;

-- First, let's check if the database exists, if not create it
CREATE DATABASE IF NOT EXISTS petsupplyecom;
USE petsupplyecom;

-- Drop existing tables to ensure clean setup (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_item_data;
DROP TABLE IF EXISTS order_data;

-- Create customer_data table if it doesn't exist (for user authentication)
CREATE TABLE IF NOT EXISTS customer_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Create product_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_name VARCHAR(100) NOT NULL,
    image_file VARCHAR(255),
    unit_of_measure VARCHAR(50),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    in_stock BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_name),
    INDEX idx_in_stock (in_stock),
    INDEX idx_price (price)
);

-- Create order_data table with all required fields
CREATE TABLE order_data (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('E_WALLET', 'BANK_TRANSFER', 'CASH_ON_DELIVERY') NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    order_status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    
    -- Shipping Address fields
    shipping_full_name VARCHAR(255),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_province VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_phone VARCHAR(20),
    
    -- Payment details
    ewallet_provider VARCHAR(50),
    reference_number VARCHAR(100),
    
    estimated_delivery DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_customer_email (customer_email),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Create order_item_data table with consistent enum values
CREATE TABLE order_item_data (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_category_name VARCHAR(100),
    product_image_file VARCHAR(255),
    product_unit_of_measure VARCHAR(50),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    -- Fixed enum values to match Java OrderItemStatus enum
    status ENUM('Created', 'Ordered', 'invoiced', 'Paid', 'Picked', 'Packed', 'Received', 'Completed') DEFAULT 'Created',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (order_id) REFERENCES order_data(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status)
);

-- Insert sample customer data for testing
INSERT INTO customer_data (email, password, first_name, last_name, phone) VALUES 
('demo@example.com', '$2a$10$dummy.hash.for.testing', 'Demo', 'User', '+63 912 345 6789'),
('test@petmart.com', '$2a$10$dummy.hash.for.testing', 'Test', 'Customer', '+63 987 654 3210');

-- Insert sample product data if table is empty
INSERT IGNORE INTO product_data (id, name, description, category_name, image_file, unit_of_measure, price, in_stock, rating) VALUES 
(1, 'Premium Dog Food - Chicken & Rice', 'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs.', 'Dog', '/DogFood.jpg', 'kg', 300.00, TRUE, 4.50),
(2, 'Cat Litter - Clumping Clay', 'Premium clumping clay litter that controls odors and is easy to clean.', 'Cat', '/CatLitter.jpg', 'kg', 200.00, TRUE, 4.20),
(3, 'Dog Leash - Adjustable Nylon', 'Durable and comfortable adjustable nylon leash for daily walks.', 'Dog', '/DogLeash.jpg', 'piece', 150.00, TRUE, 4.30),
(4, 'Interactive Dog Toy', 'Puzzle toy that dispenses treats to keep your dog mentally stimulated and entertained.', 'Dog', '/DogToy.jpg', 'piece', 250.00, TRUE, 4.60),
(5, 'Cat Scratching Post', 'Multi-level scratching post with sisal rope and cozy resting spots.', 'Cat', '/CatScratcher.jpg', 'piece', 400.00, TRUE, 4.40),
(6, 'Fish Tank Filter', 'Efficient filtration system for aquariums up to 50 gallons.', 'Fish', '/FishFilter.jpg', 'piece', 350.00, TRUE, 4.10),
(7, 'Bird Seed Mix', 'Nutritious blend of seeds perfect for small to medium birds.', 'Bird', '/BirdSeed.jpg', 'kg', 180.00, TRUE, 4.20),
(8, 'Hamster Wheel', 'Silent running wheel perfect for hamsters and small rodents.', 'Small Pets', '/HamsterWheel.jpg', 'piece', 120.00, TRUE, 4.00);

-- Insert sample order for testing
INSERT INTO order_data (
    order_number, customer_email, customer_name, customer_phone,
    subtotal, shipping_fee, total, payment_method, payment_status, order_status,
    shipping_full_name, shipping_address_line1, shipping_city, shipping_province, shipping_postal_code, shipping_phone,
    estimated_delivery
) VALUES (
    'PET1698123456', 'demo@example.com', 'Demo User', '+63 912 345 6789',
    450.00, 100.00, 550.00, 'CASH_ON_DELIVERY', 'PENDING', 'PENDING',
    'Demo User', '123 Pet Street', 'Manila', 'Metro Manila', '1000', '+63 912 345 6789',
    DATE_ADD(NOW(), INTERVAL 3 DAY)
);

-- Get the order ID for sample order items
SET @sample_order_id = LAST_INSERT_ID();

-- Insert sample order items with correct enum values
INSERT INTO order_item_data (
    order_id, product_id, product_name, product_description, product_category_name,
    product_image_file, product_unit_of_measure, quantity, price, subtotal, status
) VALUES 
(
    @sample_order_id, 1, 'Premium Dog Food - Chicken & Rice', 
    'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs.',
    'Dog', '/DogFood.jpg', 'kg', 1, 300.00, 300.00, 'Ordered'
),
(
    @sample_order_id, 4, 'Interactive Dog Toy',
    'Puzzle toy that dispenses treats to keep your dog mentally stimulated and entertained.',
    'Dog', '/DogToy.jpg', 'piece', 1, 150.00, 150.00, 'Ordered'
);

-- Verify tables were created correctly
SHOW TABLES;

-- Show table structures
DESCRIBE customer_data;
DESCRIBE product_data;
DESCRIBE order_data;
DESCRIBE order_item_data;

-- Show sample data
SELECT 'Customer Data:' as 'Table';
SELECT id, email, first_name, last_name, phone FROM customer_data LIMIT 3;

SELECT 'Product Data:' as 'Table';
SELECT id, name, category_name, price, in_stock FROM product_data LIMIT 5;

SELECT 'Order Data:' as 'Table';
SELECT id, order_number, customer_name, total, payment_method, order_status, created_at FROM order_data LIMIT 3;

SELECT 'Order Item Data:' as 'Table';
SELECT id, order_id, product_name, quantity, price, subtotal, status FROM order_item_data LIMIT 5;

-- Show the relationship works
SELECT 
    o.order_number,
    o.customer_name,
    o.total,
    o.order_status,
    oi.product_name,
    oi.quantity,
    oi.price,
    oi.status as item_status
FROM order_data o
LEFT JOIN order_item_data oi ON o.id = oi.order_id
ORDER BY o.created_at DESC, oi.id;

COMMIT;