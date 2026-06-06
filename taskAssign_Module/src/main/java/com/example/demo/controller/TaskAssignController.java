/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.controller;

/**
 *
 * @author fuyan_iqg
 */

import com.example.demo.model.TaskAssign;
import com.example.demo.service.TaskAssignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This declares that this is an API controller; all methods will 
// automatically return JSON format.
@RestController 
@RequestMapping("/api/tasks") // Base URL path
public class TaskAssignController {
    
    @Autowired // Automatically inject the database repository you just created
    private TaskAssignService taskService;
    
    
    
    // 1. Create function (post)
    @PostMapping("/assign")
    public String addTask(
            @RequestParam Long volunteerId,
            @RequestParam Long disasterId,
            @RequestParam String description){
        // let service handle the logic
        return taskService.processTaskAssignment(volunteerId, disasterId, description);
    }
    
    // 2. Read function (get)
    @GetMapping("/all")
    public List<TaskAssign>getAllTasks(){
        // when frontend open the dashboard will call this api and get all data
        return taskService.getAllTasks();
    }
    
    // update function (put)
    @PutMapping("/update/{id}")
    public TaskAssign updateTaskStatus(
            @PathVariable("id") Long taskId,
            @RequestParam String newStatus){
        // let service to edit
        return taskService.updateTaskStatus(taskId, newStatus);
    }
    
    // delete function (delete)
    @DeleteMapping("/delete/{id}")
    public String deleteTask(@PathVariable("id") Long taskId){
        taskService.deleteTask(taskId);
        return "Task " + taskId + " has been successfully deleted.";

    }
    
}

