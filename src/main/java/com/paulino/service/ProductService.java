package com.paulino.service;

import com.paulino.model.Product;
import com.paulino.model.ProductCategory;

import java.util.*;

public interface ProductService {

    List<Product> getAllProducts();
    Product[] getAll();
    Product get(Integer id);
    Product create(Product product);
    Product update(Product product);
    void delete(Integer id);
    Map<String, List<Product>> getCategoryMappedProducts();
    List<ProductCategory> listProductCategories();
}
