package com.paulino.service;

import com.paulino.entity.OrderData;
import com.paulino.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    
    /**
     * Create a new order
     * @param order the order to create
     * @return the created order
     */
    OrderData createOrder(Order order);
    
    /**
     * Get order by ID
     * @param orderId the order ID
     * @return Optional OrderData
     */
    Optional<OrderData> getOrderById(Long orderId);
    
    /**
     * Get order by order number
     * @param orderNumber the order number
     * @return Optional OrderData
     */
    Optional<OrderData> getOrderByNumber(String orderNumber);
    
    /**
     * Get orders by customer ID
     * @param customerId the customer ID
     * @return List of OrderData
     */
    List<OrderData> getOrdersByCustomerId(Integer customerId);
    
    /**
     * Get orders by customer email
     * @param customerEmail the customer email
     * @return List of OrderData
     */
    List<OrderData> getOrdersByCustomerEmail(String customerEmail);
    
    /**
     * Update order status
     * @param orderId the order ID
     * @param status the new status
     * @return updated OrderData
     */
    OrderData updateOrderStatus(Long orderId, OrderData.OrderStatus status);
    
    /**
     * Update payment status
     * @param orderId the order ID
     * @param status the new payment status
     * @return updated OrderData
     */
    OrderData updatePaymentStatus(Long orderId, OrderData.PaymentStatus status);
    
    /**
     * Generate order number
     * @return unique order number
     */
    String generateOrderNumber();
    
    /**
     * Convert OrderData entity to Order model
     * @param orderData the entity to convert
     * @return Order model
     */
    Order convertToModel(OrderData orderData);
    
    // Legacy methods for backward compatibility
    Order create(Order order);
    Order invoice(Order order);
    Order pay(Order order);
    Order pick(Order order);
    Order ship(Order order);
    Order complete(Order order);
    Order cancel(Order order);
    Order suspend(Order order);
    Order update(Order order);
}
