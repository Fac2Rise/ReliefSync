/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.volunteer.Volunteer_Module.model;

/**
 *
 * @author fuyan_iqg
 */
import jakarta.persistence.*;

@Entity
@Table(name = "volunteer")
public class Volunteer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long volunteerId;
    private String name;
    private String skill;
    private String email;
    
    public Long getVolunteerId(){return volunteerId;}
    public void setVolunteerId(Long volunteerId){this.volunteerId = volunteerId;}
    public String getName(){return name;}
    public void setName(String name){this.name = name;}
    public String getSkill(){return skill;}
    public void setSkill(String skill){this.skill = skill;}
    public String getEmail(){return email;}
    public void setEmail(String email){this.email = email;}
    
    
}
