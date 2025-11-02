package com.paulino.repository;

import com.paulino.entity.ProductData;
import org.springframework.data.repository.CrudRepository;

public interface ProductDataRepository extends CrudRepository<ProductData, Integer> {
}
