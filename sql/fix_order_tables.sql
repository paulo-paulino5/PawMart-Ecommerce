-- Fix the order tables to ensure proper AUTO_INCREMENT and constraints

-- Drop existing tables if they exist (to recreate with proper structure)
DROP TABLE IF EXISTS order_item_data;
DROP TABLE IF EXISTS order_data;

-- Create order_data table with proper AUTO_INCREMENT
CREATE TABLE order_data (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('E_WALLET', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'),
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    order_status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_full_name VARCHAR(255),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_province VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_phone VARCHAR(20),
    ewallet_provider VARCHAR(50),
    reference_number VARCHAR(100),
    estimated_delivery DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create order_item_data table with proper AUTO_INCREMENT and foreign key
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
    status ENUM('CREATED', 'ORDERED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'CREATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES order_data(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_order_data_customer_id ON order_data(customer_id);
CREATE INDEX idx_order_data_customer_email ON order_data(customer_email);
CREATE INDEX idx_order_data_order_number ON order_data(order_number);
CREATE INDEX idx_order_item_data_order_id ON order_item_data(order_id);
CREATE INDEX idx_order_item_data_product_id ON order_item_data(product_id);