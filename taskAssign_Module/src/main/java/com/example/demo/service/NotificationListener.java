/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.service;

/**
 *
 * @author fuyan_iqg
 */
import com.example.demo.dto.NotificationMessageDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {
    
    @Autowired
    private EmailService emailService;
    
    // Listen to Rabbitmq queue named task-queue
    @RabbitListener(queues = "task_queue")
    public void processNotification(NotificationMessageDTO notificationData){
        System.out.println("Received new task assignment notification.");
        
        String subject = "New Task Assigned: " + notificationData.getTaskName();
        String body = notificationData.getMessageBody();
        
        // 1. loop through all emails and send
        if(notificationData.getTargetEmails() != null){
            for(String email : notificationData.getTargetEmails()){
                emailService.sendEmail(email, subject, body);
            }
        }
        
        System.out.println("All notifications send successfully.");
    }
    
}
