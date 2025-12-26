package com.project.finance_api.entity;

import com.project.finance_api.enums.UserRole;
import com.project.finance_api.component.EntityDetails;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User extends EntityDetails {

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private Integer age;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}
