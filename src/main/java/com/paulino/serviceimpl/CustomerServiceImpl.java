package com.paulino.serviceimpl;

import com.paulino.entity.CustomerData;
import com.paulino.model.Customer;
import com.paulino.repository.CustomerRepository;
import com.paulino.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public CustomerData registerCustomer(Customer customer) {
        // Check if email already exists
        if (emailExists(customer.getEmail())) {
            throw new RuntimeException("Email already exists: " + customer.getEmail());
        }

        // Create new CustomerData entity
        CustomerData customerData = new CustomerData();
        customerData.setEmail(customer.getEmail());
        customerData.setPassword(customer.getPassword()); // Note: In production, hash the password!
        customerData.setFirstName(customer.getFirstName());
        customerData.setLastName(customer.getLastName());
        customerData.setPhone(customer.getPhone());
        customerData.setDateOfBirth(customer.getDateOfBirth());
        customerData.setGender(customer.getGender());
        customerData.setIsActive(true);

        return customerRepository.save(customerData);
    }

    @Override
    public Optional<CustomerData> authenticateCustomer(String email, String password) {
        Optional<CustomerData> customer = customerRepository.findByEmailAndIsActive(email, true);
        
        if (customer.isPresent() && customer.get().getPassword().equals(password)) {
            return customer;
        }
        
        return Optional.empty();
    }

    @Override
    public Optional<CustomerData> findCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public boolean emailExists(String email) {
        return customerRepository.existsByEmail(email);
    }

    @Override
    public List<CustomerData> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer convertToModel(CustomerData customerData) {
        Customer customer = new Customer();
        customer.setId(customerData.getId());
        customer.setEmail(customerData.getEmail());
        customer.setFirstName(customerData.getFirstName());
        customer.setLastName(customerData.getLastName());
        customer.setPhone(customerData.getPhone());
        customer.setDateOfBirth(customerData.getDateOfBirth());
        customer.setGender(customerData.getGender());
        return customer;
    }
}