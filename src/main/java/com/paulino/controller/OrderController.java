package com.paulino.controller;

import com.paulino.entity.OrderData;
import com.paulino.model.Order;
import com.paulino.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Create a new order
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Order order) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("Received order creation request:");
            System.out.println("Order details: " + order.toString());
            
            OrderData createdOrder = orderService.createOrder(order);
            Order orderModel = orderService.convertToModel(createdOrder);

            response.put("success", true);
            response.put("message", "Order created successfully");
            response.put("order", orderModel);
            response.put("orderNumber", createdOrder.getOrderNumber());
            
            System.out.println("Order created successfully with order number: " + createdOrder.getOrderNumber());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get order by order number
     */
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Map<String, Object>> getOrderByNumber(@PathVariable String orderNumber) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<OrderData> orderData = orderService.getOrderByNumber(orderNumber);
            
            if (orderData.isPresent()) {
                Order order = orderService.convertToModel(orderData.get());
                response.put("success", true);
                response.put("order", order);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Order not found");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get orders by customer email
     */
    @GetMapping("/customer/email/{email}")
    public ResponseEntity<Map<String, Object>> getOrdersByCustomerEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<OrderData> ordersData = orderService.getOrdersByCustomerEmail(email);
            List<Order> orders = ordersData.stream()
                .map(orderService::convertToModel)
                .collect(Collectors.toList());
            
            response.put("success", true);
            response.put("orders", orders);
            response.put("count", orders.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve orders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
