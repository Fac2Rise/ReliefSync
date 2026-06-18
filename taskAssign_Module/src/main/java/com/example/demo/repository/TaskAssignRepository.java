/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.repository;

/**
 *
 * @author fuyan_iqg
 */

import com.example.demo.model.TaskAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
// by inherit JpaRepository, all the feature include save(), findAll(), 
// deleteById() will automaticaly include
public interface TaskAssignRepository extends JpaRepository<TaskAssign,Long> {
    
    List<TaskAssign> findByVolunteerId(Long volunteerId);
}
