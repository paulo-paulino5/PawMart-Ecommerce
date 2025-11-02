-- Create order tables for the checkout system
USE petsupplyecom;

-- Create order_data table
CREATE TABLE IF NOT EXISTS order_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    
    -- Shipping Address
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
    
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_customer_email (customer_email),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Update existing order_item_data table structure
-- First check if the table exists and has the old structure
DESCRIBE order_item_data;

-- Drop and recreate order_item_data table with new structure
DROP TABLE IF EXISTS order_item_data;

CREATE TABLE order_item_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES order_data(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status)
);

-- Insert sample order data for testing
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

-- Get the order ID for the sample order
SET @sample_order_id = LAST_INSERT_ID();

-- Insert sample order items
INSERT INTO order_item_data (
    order_id, product_id, product_name, product_description, product_category_name,
    product_image_file, product_unit_of_measure, quantity, price, subtotal
) VALUES 
(
    @sample_order_id, 1, 'Premium Dog Food - Chicken & Rice', 
    'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs.',
    'Dog', '/DogFood.jpg', 'kg', 1, 300.00, 300.00
),
(
    @sample_order_id, 4, 'Interactive Dog Toy',
    'Puzzle toy that dispenses treats to keep your dog mentally stimulated and entertained.',
    'Dog', '/DogToy.jpg', 'piece', 1, 150.00, 150.00
);

-- Verify the tables were created
DESCRIBE order_data;
DESCRIBE order_item_data;

-- Show sample data
SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.total,
    o.payment_method,
    o.order_status,
    o.created_at
FROM order_data o
ORDER BY o.created_at DESC
LIMIT 5;

SELECT 
    oi.id,
    oi.order_id,
    oi.product_name,
    oi.quantity,
    oi.price,
    oi.subtotal
FROM order_item_data oi
JOIN order_data o ON oi.order_id = o.id
ORDER BY oi.id DESC
LIMIT 10;