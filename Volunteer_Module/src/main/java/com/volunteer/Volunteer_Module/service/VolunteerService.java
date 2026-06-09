/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.volunteer.Volunteer_Module.service;

/**
 *
 * @author fuyan_iqg
 */

import com.volunteer.Volunteer_Module.repository.VolunteerRepository;
import com.volunteer.Volunteer_Module.model.Volunteer;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class VolunteerService {
    
    @Autowired
    private VolunteerRepository volunteerRepository;
    
    
    public String processVolunteer(String name, 
                    String skill, String email){
        
        Volunteer newVolunteer = new Volunteer();
        newVolunteer.setName(name);
        newVolunteer.setSkill(skill);
        newVolunteer.setEmail(email);
        
        volunteerRepository.save(newVolunteer);
        
        return "Volunteer successfully saved to database.";
    }
    
    // Create function
    public Volunteer createVolunteer(Volunteer volunteer){
        if(volunteer.getName() == null && volunteer.getEmail() == null){
            throw new RuntimeException("content cannot be empty");
        }
        return volunteerRepository.save(volunteer);
    }
    
    //Read All function
    public List<Volunteer> getAllVolunteer(){
        return volunteerRepository.findAll();
    }
    
    //Read by Id
    public Volunteer getVolunteerById(Long volunteerId){
        return volunteerRepository.findById(volunteerId).orElse(null);
    }
    
    //Update function
    public Volunteer updateVolunteer(Long volunteerId, Volunteer updatedData){
        
        Volunteer existingVolunteer = volunteerRepository.findById(volunteerId).orElse(null);
        if(existingVolunteer != null){
            
            existingVolunteer.setName(updatedData.getName());
            existingVolunteer.setSkill(updatedData.getSkill());
            existingVolunteer.setEmail(updatedData.getEmail());
            
            return volunteerRepository.save(existingVolunteer);
        }
        return null;
    }
    
    //Delete function
    public void deleteVolunteer(Long volunteerId){
        volunteerRepository.deleteById(volunteerId);
    }
    
    
    
}
