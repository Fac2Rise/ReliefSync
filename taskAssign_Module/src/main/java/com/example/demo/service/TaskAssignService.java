/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.service;

import com.example.demo.repository.TaskAssignRepository;
import com.example.demo.model.TaskAssign;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.example.demo.dto.NotificationMessageDTO;

/**
 *
 * @author fuyan_iqg
 */
@Service
public class TaskAssignService {
    
    @Autowired
    private TaskAssignRepository taskRepository;
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public String processTaskAssignment(Long volunteerId, Long disasterId, String description){
        
        //logic 1:
        
        //logic 2: create new object and store in mysql
        TaskAssign newTask = new TaskAssign();
        newTask.setVolunteerId(volunteerId);
        newTask.setDisasterId(disasterId);
        newTask.setDescription(description);
        newTask.setStatus("PENDING"); // default status
        
        taskRepository.save(newTask); // use for insert to database
        
        // logic 3: trigger notification system
        NotificationMessageDTO notificationData = new NotificationMessageDTO();
        notificationData.setTaskName("Task for disaster " + disasterId);
        notificationData.setMessageBody("Alert: Volunteer " + volunteerId 
                + "assigned to Disaster " + disasterId + ". Task: " +description);
        
        // s4end dto
        rabbitTemplate.convertAndSend("task_queue", notificationData);
        
        return "Task Assign successful stored and notification trigged";
    }
    
    // Create function 
    public TaskAssign createTask(TaskAssign task){
        if(task.getDescription() == null){
            throw new RuntimeException("content cannot be empty");
        }
        return taskRepository.save(task);
    }
    
    // Read All function
    public List<TaskAssign> getAllTasks(){
        return taskRepository.findAll(); 
        // auto execute SELECT * FROM task_assignments
    }
    
    // Read by id
    public TaskAssign getTaskById(Long id){
        return taskRepository.findById(id).orElse(null);
        // find with id
    }
    
    //Update function
    public TaskAssign updateTaskStatus(Long taskId, String newStatus){
        //1. find old data from database
        TaskAssign existingTask = taskRepository.findById(taskId).orElse(null);
        if(existingTask != null){
            
            //2. update status
            existingTask.setStatus(newStatus);
            
            //3. save again (spring will execute update when got existing id)
            return taskRepository.save(existingTask);
        }
        return null;
    }
    
    // Delete function
    public void deleteTask(Long taskId){
        taskRepository.deleteById(taskId);
        // execute DELETE FROM WHERE id = ?
    }
  
}
