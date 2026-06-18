/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.controller;

/**
 *
 * @author fuyan_iqg
 */
import com.example.demo.dto.BatchTaskRequest;
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
    public String addTask(@RequestBody TaskAssign taskData) {
        //React send the JSON and spring boot change JSON to taskData
        return taskService.processTaskAssignment(
                taskData.getVolunteerId(),
                taskData.getDisasterId(),
                taskData.getDescription()
        );
    }

    // 2. Read function (get)
    @GetMapping("/all")
    public List<TaskAssign> getAllTasks() {
        // when frontend open the dashboard will call this api and get all data
        return taskService.getAllTasks();
    }

    // update function (put)
    @PutMapping("/update/{id}")
    public TaskAssign updateTaskStatus(
            @PathVariable("id") Long taskId,
            @RequestBody TaskAssign taskData) {
        // get new status from JSON and give to service
        return taskService.updateTaskStatus(taskId, taskData.getStatus());
    }

    // delete function (delete)
    @DeleteMapping("/delete/{id}")
    public String deleteTask(@PathVariable("id") Long taskId) {
        taskService.deleteTask(taskId);
        return "Task " + taskId + " has been successfully deleted.";

    }

    @GetMapping("/hello")
    public String hello() {
        return ("task is working");

    }

    @PostMapping("/assign-batch")
    public String assignBatch(@RequestBody BatchTaskRequest request) {
        return taskService.processBatchAssignment(
                request.getVolunteerIds(),
                request.getDisasterId(),
                request.getDescription()
        );
    }
    
    @GetMapping("/volunteer/{volunteerId}")
    public List<TaskAssign> getTasksByVolunteerId(@PathVariable("volunteerId") Long volunteerId) {

        return taskService.getTasksByVolunteerId(volunteerId);
    }

}
