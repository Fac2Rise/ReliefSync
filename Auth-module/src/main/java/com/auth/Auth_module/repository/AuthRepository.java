/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.auth.Auth_module.repository;

/**
 *
 * @author fuyan_iqg
 */

import com.auth.Auth_module.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<AuthUser,Long> {
    // This allows us to find a user by their email during login
    Optional<AuthUser> findByEmail(String email);
}
