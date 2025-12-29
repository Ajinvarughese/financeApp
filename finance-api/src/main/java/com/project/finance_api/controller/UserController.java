package com.project.finance_api.controller;

import com.project.finance_api.dto.Login;
import com.project.finance_api.entity.User;
import com.project.finance_api.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ------------------------------------
    // GET ALL USERS
    // ------------------------------------
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUser());
    }

    // ------------------------------------
    // GET USER BY ID
    // ------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ------------------------------------
    // REGISTER / CREATE USER
    // ------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String token = userService.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                java.util.Map.of(
                        "message", "User registered successfully",
                        "token", token
                )
        );
    }

    // ------------------------------------
    // LOGIN (EXISTING USER)
    // ------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        try {
            User user = userService.authExistingUser(login);
            String token = userService.addUser(user); // token generation

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "token", token,
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "role", user.getRole()
                    )
            );

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }
    }

    // ------------------------------------
    // UPDATE PASSWORD
    // ------------------------------------
    @PutMapping("/update-password")
    public ResponseEntity<User> updatePassword(
            @RequestParam String email,
            @RequestParam String password) {
        return ResponseEntity.ok(userService.updatePassword(email, password));
    }

    // ------------------------------------
    // UPDATE USER
    // ------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    // ------------------------------------
    // DELETE USER
    // ------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
