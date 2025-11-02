package com.paulino.repository;

import com.paulino.entity.OrderItemData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemDataRepository extends JpaRepository<OrderItemData, Long> {
    
    /**
     * Find all order items by order ID
     */
    List<OrderItemData> findAllByOrderId(Long orderId);
    
    /**
     * Find all order items by customer ID (through orders)
     */
    @Query("SELECT oi FROM OrderItemData oi JOIN oi.order o WHERE o.customerId = :customerId")
    List<OrderItemData> findAllByCustomerId(@Param("customerId") Integer customerId);
}
