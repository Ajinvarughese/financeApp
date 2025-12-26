package com.project.finance_api.dto;

import com.project.finance_api.enums.LoginType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Login {
    private String email;
    private String password; // recieves token or password
    private LoginType loginType;
}
