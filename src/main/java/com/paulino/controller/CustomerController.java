package com.paulino.controller;

import com.paulino.entity.CustomerData;
import com.paulino.model.Customer;
import com.paulino.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * Register a new customer
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerCustomer(@RequestBody Customer customer) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if email already exists
            if (customerService.emailExists(customer.getEmail())) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Register the customer
            CustomerData savedCustomer = customerService.registerCustomer(customer);
            Customer customerModel = customerService.convertToModel(savedCustomer);

            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("user", customerModel);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Authenticate customer login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginCustomer(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            Optional<CustomerData> authenticatedCustomer = customerService.authenticateCustomer(email, password);

            if (authenticatedCustomer.isPresent()) {
                Customer customerModel = customerService.convertToModel(authenticatedCustomer.get());
                
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", customerModel);
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all customers (for admin purposes)
     */
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerData>> getAllCustomers() {
        try {
            List<CustomerData> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get customer by email
     */
    @GetMapping("/customer/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        try {
            Optional<CustomerData> customerData = customerService.findCustomerByEmail(email);
            
            if (customerData.isPresent()) {
                Customer customer = customerService.convertToModel(customerData.get());
                return ResponseEntity.ok(customer);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
