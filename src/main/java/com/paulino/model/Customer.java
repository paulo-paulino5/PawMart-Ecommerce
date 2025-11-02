package com.paulino.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    private Integer id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private Date dateOfBirth;
    private String gender;
}
