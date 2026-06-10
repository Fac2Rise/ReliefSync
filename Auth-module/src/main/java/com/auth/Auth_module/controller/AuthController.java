/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.auth.Auth_module.controller;

/**
 *
 * @author fuyan_iqg
 */
import com.auth.Auth_module.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // The endpoint your React app will call to login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        // Let service handle validation and token generation
        return authService.authenticateAndGenerateToken(email, password);
    }
    
    // The endpoint your React app will call to register
    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> userData) {
        // Handle saving new user...
        return authService.registerNewUser(userData);
    }
}
