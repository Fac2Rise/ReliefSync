/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.service;

import com.example.demo.dto.NotificationMessageDTO;
import com.example.demo.model.TaskAssign;
import com.example.demo.repository.TaskAssignRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


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

    @Autowired
    private RestTemplate restTemplate;

    public String processTaskAssignment(Long volunteerId, Long disasterId, String description) {

        //logic 1: create new object and store in mysql
        TaskAssign newTask = new TaskAssign();
        newTask.setVolunteerId(volunteerId);
        newTask.setDisasterId(disasterId);
        newTask.setDescription(description);
        newTask.setStatus("PENDING"); // default status

        taskRepository.save(newTask); // use for insert to database

        // logic 2: trigger notification system
        try {
            NotificationMessageDTO notificationData = new NotificationMessageDTO();
            notificationData.setTaskName("Task for disaster " + disasterId);
            notificationData.setMessageBody("Alert: Volunteer " + volunteerId
                    + "assigned to Disaster " + disasterId + ". Task: " + description);

            // send dto
            rabbitTemplate.convertAndSend("task_queue", notificationData);

            return "Task Assign successful stored and notification trigged";

        } catch (Exception e) {
            System.out.println("RabbitMQ connect failed, not available to notify " + e.getMessage());
            return "Task successfully saved to database, but RabbitMQ is down. Notification failed";
        }
    }

    // Create function 
    public TaskAssign createTask(TaskAssign task) {
        if (task.getDescription() == null) {
            throw new RuntimeException("content cannot be empty");
        }
        return taskRepository.save(task);
    }

    // Read All function
    public List<TaskAssign> getAllTasks() {
        return taskRepository.findAll();
        // auto execute SELECT * FROM task_assignments
    }

    // Read by id
    public TaskAssign getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
        // find with id
    }

    //Update function
    public TaskAssign updateTaskStatus(Long taskId, String newStatus) {
        //1. find old data from database
        TaskAssign existingTask = taskRepository.findById(taskId).orElse(null);
        if (existingTask != null) {

            //2. update status
            existingTask.setStatus(newStatus);

            //3. save again (spring will execute update when got existing id)
            return taskRepository.save(existingTask);
        }
        return null;
    }

    // Delete function
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
        // execute DELETE FROM WHERE id = ?
    }

    public String processBatchAssignment(List<Long> volunteerIds, Long disasterId, String description) {
        if (volunteerIds == null || volunteerIds.isEmpty()) {
            throw new RuntimeException("At least one volunteer must be selected");
        }
        List<String> targetEmails = new ArrayList<>();
        List<TaskAssign> createdTasks = new ArrayList<>();

        for (Long volunteerId : volunteerIds) {
            // 1. 取得志工 email (呼叫 Volunteer Module)
            String email = fetchVolunteerEmail(volunteerId);
            if (email != null) {
                targetEmails.add(email);
            }

            // 2. 建立 Task 記錄
            TaskAssign newTask = new TaskAssign();
            newTask.setVolunteerId(volunteerId);
            newTask.setDisasterId(disasterId);
            newTask.setDescription(description);
            newTask.setStatus("PENDING");
            taskRepository.save(newTask);
            createdTasks.add(newTask);
        }

        // 3. 發送 RabbitMQ 通知（一次性通知所有志工）
        try {
            NotificationMessageDTO notification = new NotificationMessageDTO();
            notification.setTaskName("New Task for Disaster " + disasterId);
            notification.setMessageBody("You have been assigned to a new task.\n\nDisaster ID: " + disasterId + "\nDescription: " + description);
            notification.setTargetEmails(targetEmails);
            rabbitTemplate.convertAndSend("task_queue", notification);
            return "Batch tasks created and notifications sent to " + targetEmails.size() + " volunteers.";
        } catch (Exception e) {
            System.err.println("RabbitMQ error: " + e.getMessage());
            return "Tasks saved (" + createdTasks.size() + " records) but notifications failed.";
        }
    }

// 輔助方法：透過 API Gateway 呼叫 Volunteer Module 取得 email
    private String fetchVolunteerEmail(Long volunteerId) {
        try {
            // 注意：這裡直接呼叫 Volunteer Module 的 API（可經由 Gateway 或直連）
            // 若使用 Gateway: http://localhost:8080/api/volunteers/{id}
            String url = "http://localhost:8082/api/volunteers/" + volunteerId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("email")) {
                return (String) response.getBody().get("email");
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch volunteer email for ID " + volunteerId + ": " + e.getMessage());
        }
        return null;
    }

}
