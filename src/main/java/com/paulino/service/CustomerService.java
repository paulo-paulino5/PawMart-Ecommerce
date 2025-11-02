package com.paulino.service;

import com.paulino.entity.CustomerData;
import com.paulino.model.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    
    /**
     * Register a new customer
     * @param customer the customer data to register
     * @return the saved customer data
     */
    CustomerData registerCustomer(Customer customer);
    
    /**
     * Authenticate customer login
     * @param email the customer's email
     * @param password the customer's password
     * @return Optional CustomerData if authentication successful
     */
    Optional<CustomerData> authenticateCustomer(String email, String password);
    
    /**
     * Find customer by email
     * @param email the email to search for
     * @return Optional CustomerData
     */
    Optional<CustomerData> findCustomerByEmail(String email);
    
    /**
     * Check if email already exists
     * @param email the email to check
     * @return true if email exists
     */
    boolean emailExists(String email);
    
    /**
     * Get all customers
     * @return list of all customers
     */
    List<CustomerData> getAllCustomers();
    
    /**
     * Convert CustomerData entity to Customer model
     * @param customerData the entity to convert
     * @return Customer model
     */
    Customer convertToModel(CustomerData customerData);
}
