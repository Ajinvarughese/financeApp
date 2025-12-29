package com.project.finance_api.service;

import com.project.finance_api.component.JwtUtil;
import com.project.finance_api.dto.Login;
import com.project.finance_api.entity.User;
import com.project.finance_api.enums.LoginType;
import com.project.finance_api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    //get all user
    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    //get Specific user by id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("User not found At id:"+id));
    }


    //Create a new user
    public String addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return jwtUtil.generateToken(user);
    }

    public String authUserFrequent(Login login) {
        String email = jwtUtil.extractEmail(login.getPassword());
        userRepository.findByEmail(login.getEmail())
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        return login.getPassword();
    }

    // Get user by email
    public User authExistingUser(Login login) throws EntityNotFoundException {
        User findUser = userRepository.findByEmail(login.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: "+login.getEmail()));
        if (passwordEncoder.matches(login.getPassword(), findUser.getPassword())) {
            return findUser;
        }
        throw new IllegalArgumentException("Wrong credentials");
    }


    //update password
    public User updatePassword(String email, String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }


    // Update an existing user
    public User updateUser(Long id, User updateUser){
        return userRepository.findById(id).map( user -> {
            user.setFirstName(updateUser.getFirstName());
            user.setEmail(updateUser.getEmail());
            user.setAge(updateUser.getAge());
            user.setRole(updateUser.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new IllegalArgumentException("User not found with id:"+id));
    }

    //delete an user
    public void deleteUser(Long id){
        if(!userRepository.existsById(id)){
            throw new EntityNotFoundException();
        }
        userRepository.deleteById(id);
    }
}
