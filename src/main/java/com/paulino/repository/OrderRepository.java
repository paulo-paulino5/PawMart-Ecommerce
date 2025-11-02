package com.paulino.repository;

import com.paulino.entity.OrderData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderData, Long> {
    
    /**
     * Find order by order number
     * @param orderNumber the order number to search for
     * @return Optional OrderData
     */
    Optional<OrderData> findByOrderNumber(String orderNumber);
    
    /**
     * Find orders by customer ID
     * @param customerId the customer ID
     * @return List of OrderData
     */
    List<OrderData> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);
    
    /**
     * Find orders by customer email
     * @param customerEmail the customer email
     * @return List of OrderData
     */
    List<OrderData> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    
    /**
     * Find orders by status
     * @param orderStatus the order status
     * @return List of OrderData
     */
    List<OrderData> findByOrderStatusOrderByCreatedAtDesc(OrderData.OrderStatus orderStatus);
    
    /**
     * Find orders by payment status
     * @param paymentStatus the payment status
     * @return List of OrderData
     */
    List<OrderData> findByPaymentStatusOrderByCreatedAtDesc(OrderData.PaymentStatus paymentStatus);
}