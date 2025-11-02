package com.paulino.service;
import com.paulino.enums.OrderItemStatus;
import com.paulino.model.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> getAll();
    List<OrderItem> getOrderItems(Integer customerId);
    List<OrderItem> getCartItems(Integer customerId);
    OrderItem create(OrderItem orderItem);
    List<OrderItem> create(List<OrderItem> orderItems);
    OrderItem update(OrderItem orderItem);
    List<OrderItem> update(List<OrderItem> orderItems);
    List<OrderItem> updateStatus(List<Long> id, OrderItemStatus orderItemStatus);
    OrderItem get(Long id);
    void delete (Long id);
}
