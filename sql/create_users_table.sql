-- Use the petsupplyecom database
USE petsupplyecom;

-- Create users table for customer authentication
CREATE TABLE IF NOT EXISTS customer_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email for faster lookups
CREATE INDEX idx_customer_email ON customer_data(email);

-- Insert a test user (password is 'password123' - you should hash this in production)
INSERT INTO customer_data (email, password, first_name, last_name, phone) 
VALUES ('demo@example.com', 'password123', 'Demo', 'User', '+1234567890');