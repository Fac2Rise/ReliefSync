/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.auth.Auth_module.service;

import com.auth.Auth_module.model.AuthUser;
import com.auth.Auth_module.repository.AuthRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Secret Key for JWT Token
    private static final String SECRET_STRING = "MySuperSecretKeyForDisasterReliefSystem2026!";
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

    // --- LOGIN LOGIC ---
    public Map<String, Object> authenticateAndGenerateToken(String email, String password) {

        // 1. Find user by email in database
        Optional<AuthUser> userOptional = authRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            AuthUser user = userOptional.get();

            // 2. Check if password matches (Note: In production, use BCrypt to hash passwords!)
            if (user.getPassword().equals(password)) {

                // 3. Generate Token
                long nowMillis = System.currentTimeMillis();
                Date now = new Date(nowMillis);
                Date exp = new Date(nowMillis + (1000 * 60 * 60 * 24)); // 24 hours

                String jwtToken = Jwts.builder()
                        .setSubject(user.getEmail())
                        .claim("userId", user.getId())
                        .claim("role", user.getRole())
                        .setIssuedAt(now)
                        .setExpiration(exp)
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();

                // 4. Return Data
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("role", user.getRole());
                response.put("userId", user.getId());
                response.put("name", user.getName());
                response.put("message", "Login successful");
                return response;
            }
        }

        // If email not found or password wrong
        throw new RuntimeException("Invalid email or password");
    }

    // --- REGISTER LOGIC ---
    public String registerNewUser(Map<String, String> userData) {
        String email = userData.get("email");

        // Check if email already exists
        if (authRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        // Create new user for AUTH purposes only (No skills needed here!)
        AuthUser newUser = new AuthUser();
        newUser.setName(userData.get("name"));
        newUser.setEmail(email);
        newUser.setPassword(userData.get("password"));
        newUser.setRole("Volunteer");
        authRepository.save(newUser);

        try {
            // establish Json body that will send to volunteer
            Map<String, String> volunteerRequest = new HashMap<>();
            volunteerRequest.put("name", userData.get("name"));
            volunteerRequest.put("email", email);

            String skill = userData.get("skill") != null ? userData.get("skill") : "General";
            volunteerRequest.put("skill", skill);

            // localhost:8082
            String volunteerServiceUrl = "http://volunteer-service:8082/api/volunteers/add";

            // send post request
            String response = restTemplate.postForObject(volunteerServiceUrl, volunteerRequest, String.class);
            System.out.println("====== 志工微服務同步成功 ======: " + response);

        } catch (Exception e) {
            System.err.println("❌ 無法同步到志工微服務，原因: " + e.getMessage());
        }

        return "User auth account created successfully";
    }
}
