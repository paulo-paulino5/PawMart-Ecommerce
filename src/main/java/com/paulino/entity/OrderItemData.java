package com.paulino.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.paulino.enums.OrderItemStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "order_item_data")
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Integer productId;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Column(name = "product_description")
    private String productDescription;
    
    @Column(name = "product_category_name")
    private String productCategoryName;
    
    @Column(name = "product_image_file")
    private String productImageFile;
    
    @Column(name = "product_unit_of_measure")
    private String productUnitOfMeasure;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;
    
    @Enumerated(EnumType.STRING)
    private OrderItemStatus status;
    
    // Many-to-one relationship with OrderData
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderData order;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
