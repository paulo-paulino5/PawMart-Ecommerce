package com.paulino.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "order_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Column(name = "customer_id")
    private Integer customerId;
    
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_phone")
    private String customerPhone;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;
    
    // Shipping Address fields
    @Column(name = "shipping_full_name")
    private String shippingFullName;
    
    @Column(name = "shipping_address_line1")
    private String shippingAddressLine1;
    
    @Column(name = "shipping_address_line2")
    private String shippingAddressLine2;
    
    @Column(name = "shipping_city")
    private String shippingCity;
    
    @Column(name = "shipping_province")
    private String shippingProvince;
    
    @Column(name = "shipping_postal_code")
    private String shippingPostalCode;
    
    @Column(name = "shipping_phone")
    private String shippingPhone;
    
    // Payment details
    @Column(name = "ewallet_provider")
    private String ewalletProvider;
    
    @Column(name = "reference_number")
    private String referenceNumber;
    
    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // One-to-many relationship with order items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItemData> orderItems;
    
    public enum PaymentMethod {
        E_WALLET, BANK_TRANSFER, CASH_ON_DELIVERY
    }
    
    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }
    
    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }
}
