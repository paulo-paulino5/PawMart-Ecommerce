package com.paulino.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class Product {
    int id;
    String name;
    String description;
    String categoryName;
    @JsonProperty("image")
    String imageFile;
    String unitOfMeasure;
    BigDecimal price;
    @JsonProperty("inStock")
    boolean inStock = true;
    BigDecimal rating = BigDecimal.valueOf(4.0);
}
