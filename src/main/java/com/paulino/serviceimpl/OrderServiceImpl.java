package com.paulino.serviceimpl;

import com.paulino.entity.OrderData;
import com.paulino.entity.OrderItemData;
import com.paulino.model.Order;
import com.paulino.model.OrderItem;
import com.paulino.repository.OrderRepository;
import com.paulino.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public OrderData createOrder(Order order) {
        // Generate order number if not provided
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber(generateOrderNumber());
        }

        // Create OrderData entity
        OrderData orderData = new OrderData();
        orderData.setOrderNumber(order.getOrderNumber());
        orderData.setCustomerId(order.getCustomerId());
        orderData.setCustomerEmail(order.getCustomerEmail());
        orderData.setCustomerName(order.getCustomerName());
        orderData.setCustomerPhone(order.getCustomerPhone());
        orderData.setSubtotal(order.getSubtotal());
        orderData.setShippingFee(order.getShippingFee());
        orderData.setTotal(order.getTotal());
        
        // Set payment method
        if (order.getPaymentMethod() != null) {
            try {
                orderData.setPaymentMethod(OrderData.PaymentMethod.valueOf(order.getPaymentMethod()));
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid payment method: " + order.getPaymentMethod());
                throw new RuntimeException("Invalid payment method: " + order.getPaymentMethod());
            }
        }
        
        // Set initial statuses
        orderData.setPaymentStatus(OrderData.PaymentStatus.PENDING);
        orderData.setOrderStatus(OrderData.OrderStatus.PENDING);
        
        // Set shipping address
        orderData.setShippingFullName(order.getShippingFullName());
        orderData.setShippingAddressLine1(order.getShippingAddressLine1());
        orderData.setShippingAddressLine2(order.getShippingAddressLine2());
        orderData.setShippingCity(order.getShippingCity());
        orderData.setShippingProvince(order.getShippingProvince());
        orderData.setShippingPostalCode(order.getShippingPostalCode());
        orderData.setShippingPhone(order.getShippingPhone());
        
        // Set payment details
        orderData.setEwalletProvider(order.getEwalletProvider());
        orderData.setReferenceNumber(order.getReferenceNumber());
        
        // Set estimated delivery (3 days from now)
        orderData.setEstimatedDelivery(LocalDateTime.now().plusDays(3));

        // Save the order first
        OrderData savedOrder = orderRepository.save(orderData);

        // Create and save order items if provided
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            List<OrderItemData> orderItems = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemData orderItemData = new OrderItemData();
                    orderItemData.setOrder(savedOrder);
                    orderItemData.setProductId(item.getProductId());
                    orderItemData.setProductName(item.getProductName());
                    orderItemData.setProductDescription(item.getProductDescription());
                    orderItemData.setProductCategoryName(item.getProductCategoryName());
                    orderItemData.setProductImageFile(item.getProductImageFile());
                    orderItemData.setProductUnitOfMeasure(item.getProductUnitOfMeasure());
                    orderItemData.setQuantity(item.getQuantity());
                    orderItemData.setPrice(item.getPrice());
                    orderItemData.setSubtotal(item.getSubtotal());
                    orderItemData.setStatus(item.getStatus());
                    return orderItemData;
                })
                .collect(Collectors.toList());
            
            savedOrder.setOrderItems(orderItems);
        }

        return orderRepository.save(savedOrder);
    }

    @Override
    public Optional<OrderData> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    @Override
    public Optional<OrderData> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Override
    public List<OrderData> getOrdersByCustomerId(Integer customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Override
    public List<OrderData> getOrdersByCustomerEmail(String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
    }

    @Override
    public OrderData updateOrderStatus(Long orderId, OrderData.OrderStatus status) {
        Optional<OrderData> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            OrderData order = orderOpt.get();
            order.setOrderStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    @Override
    public OrderData updatePaymentStatus(Long orderId, OrderData.PaymentStatus status) {
        Optional<OrderData> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            OrderData order = orderOpt.get();
            order.setPaymentStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    @Override
    public String generateOrderNumber() {
        // Generate format: PET + current timestamp
        return "PET" + System.currentTimeMillis();
    }

    @Override
    public Order convertToModel(OrderData orderData) {
        Order order = new Order();
        order.setId(orderData.getId());
        order.setOrderNumber(orderData.getOrderNumber());
        order.setCustomerId(orderData.getCustomerId());
        order.setCustomerEmail(orderData.getCustomerEmail());
        order.setCustomerName(orderData.getCustomerName());
        order.setCustomerPhone(orderData.getCustomerPhone());
        order.setSubtotal(orderData.getSubtotal());
        order.setShippingFee(orderData.getShippingFee());
        order.setTotal(orderData.getTotal());
        order.setPaymentMethod(orderData.getPaymentMethod() != null ? orderData.getPaymentMethod().toString() : null);
        order.setPaymentStatus(orderData.getPaymentStatus() != null ? orderData.getPaymentStatus().toString() : null);
        order.setOrderStatus(orderData.getOrderStatus() != null ? orderData.getOrderStatus().toString() : null);
        order.setShippingFullName(orderData.getShippingFullName());
        order.setShippingAddressLine1(orderData.getShippingAddressLine1());
        order.setShippingAddressLine2(orderData.getShippingAddressLine2());
        order.setShippingCity(orderData.getShippingCity());
        order.setShippingProvince(orderData.getShippingProvince());
        order.setShippingPostalCode(orderData.getShippingPostalCode());
        order.setShippingPhone(orderData.getShippingPhone());
        order.setEwalletProvider(orderData.getEwalletProvider());
        order.setReferenceNumber(orderData.getReferenceNumber());
        order.setEstimatedDelivery(orderData.getEstimatedDelivery());
        order.setCreatedAt(orderData.getCreatedAt());
        order.setUpdatedAt(orderData.getUpdatedAt());

        // Convert order items if present
        if (orderData.getOrderItems() != null) {
            List<OrderItem> orderItems = orderData.getOrderItems().stream()
                .map(this::convertOrderItemToModel)
                .collect(Collectors.toList());
            order.setOrderItems(orderItems);
        }

        return order;
    }

    private OrderItem convertOrderItemToModel(OrderItemData orderItemData) {
        OrderItem orderItem = new OrderItem();
        orderItem.setId(orderItemData.getId());
        orderItem.setProductId(orderItemData.getProductId());
        orderItem.setProductName(orderItemData.getProductName());
        orderItem.setProductDescription(orderItemData.getProductDescription());
        orderItem.setProductCategoryName(orderItemData.getProductCategoryName());
        orderItem.setProductImageFile(orderItemData.getProductImageFile());
        orderItem.setProductUnitOfMeasure(orderItemData.getProductUnitOfMeasure());
        orderItem.setQuantity(orderItemData.getQuantity());
        orderItem.setPrice(orderItemData.getPrice());
        orderItem.setSubtotal(orderItemData.getSubtotal());
        orderItem.setStatus(orderItemData.getStatus());
        orderItem.setCreatedAt(orderItemData.getCreatedAt());
        orderItem.setUpdatedAt(orderItemData.getUpdatedAt());
        return orderItem;
    }

    // Legacy method implementations for backward compatibility
    @Override
    public Order create(Order order) {
        OrderData orderData = createOrder(order);
        return convertToModel(orderData);
    }

    @Override
    public Order invoice(Order order) {
        // Implementation for invoicing
        return order;
    }

    @Override
    public Order pay(Order order) {
        // Implementation for payment processing
        if (order.getId() != null) {
            updatePaymentStatus(order.getId(), OrderData.PaymentStatus.PAID);
        }
        return order;
    }

    @Override
    public Order pick(Order order) {
        // Implementation for picking
        if (order.getId() != null) {
            updateOrderStatus(order.getId(), OrderData.OrderStatus.PROCESSING);
        }
        return order;
    }

    @Override
    public Order ship(Order order) {
        // Implementation for shipping
        if (order.getId() != null) {
            updateOrderStatus(order.getId(), OrderData.OrderStatus.SHIPPED);
        }
        return order;
    }

    @Override
    public Order complete(Order order) {
        // Implementation for completion
        if (order.getId() != null) {
            updateOrderStatus(order.getId(), OrderData.OrderStatus.DELIVERED);
        }
        return order;
    }

    @Override
    public Order cancel(Order order) {
        // Implementation for cancellation
        if (order.getId() != null) {
            updateOrderStatus(order.getId(), OrderData.OrderStatus.CANCELLED);
        }
        return order;
    }

    @Override
    public Order suspend(Order order) {
        // Implementation for suspension
        return order;
    }

    @Override
    public Order update(Order order) {
        // Implementation for updating
        return order;
    }

    @Override
    public void deleteOrder(Long orderId) {
        Optional<OrderData> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            orderRepository.deleteById(orderId);
        } else {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
    }
}