package com.paulino.repository;

import com.paulino.entity.CustomerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerData, Integer> {
    
    /**
     * Find customer by email address
     * @param email the email to search for
     * @return Optional CustomerData
     */
    Optional<CustomerData> findByEmail(String email);
    
    /**
     * Check if email exists
     * @param email the email to check
     * @return true if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find active customers by email
     * @param email the email to search for
     * @param isActive whether the customer is active
     * @return Optional CustomerData
     */
    Optional<CustomerData> findByEmailAndIsActive(String email, Boolean isActive);
}