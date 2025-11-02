package com.paulino.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private String orderNumber;
    private Integer customerId;
    private String customerEmail;
    private String customerName;
    private String customerPhone;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal total;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    
    // Shipping Address
    private String shippingFullName;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingProvince;
    private String shippingPostalCode;
    private String shippingPhone;
    
    // Payment details
    private String ewalletProvider;
    private String referenceNumber;
    
    private LocalDateTime estimatedDelivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<OrderItem> orderItems;
}
