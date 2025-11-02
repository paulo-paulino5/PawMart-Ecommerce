package com.paulino.model;

import com.paulino.enums.OrderItemStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private Long id;
    private Integer productId;
    private String productName;
    private String productDescription;
    private String productCategoryName;
    private String productImageFile;
    private String productUnitOfMeasure;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private OrderItemStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
