/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.volunteer.Volunteer_Module.controller;

/**
 *
 * @author fuyan_iqg
 */

import com.volunteer.Volunteer_Module.model.Volunteer;
import com.volunteer.Volunteer_Module.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class VolunteerController {
    
    @Autowired
    private VolunteerService volunteerService;
    
    @PostMapping("/add")
    public String addVolunteer(@RequestBody Volunteer volunteerData){
        return volunteerService.processVolunteer(
            volunteerData.getName(),
            volunteerData.getSkill(),
            volunteerData.getEmail()
        );
    }
            
    @GetMapping("/all")
    public List<Volunteer>getAllVolunteer(){
        return volunteerService.getAllVolunteer();
    }
    
    @PutMapping("/update/{id}")
    public Volunteer updateVolunteer(
        @PathVariable("id")Long volunteerId,
        @RequestBody Volunteer volunteerData){
        
        return volunteerService.updateVolunteer(volunteerId, volunteerData);
    }
    
    @DeleteMapping("/delete/{id}")
    public String deleteVolunteer(@PathVariable("id")Long volunteerId){
        volunteerService.deleteVolunteer(volunteerId);
        return "Volunteer" + volunteerId + "has been successfully deleted.";
    }
    
    @GetMapping("/hello")
    public String hello(){
         return("volunteer is working");
         
    }
    
}
