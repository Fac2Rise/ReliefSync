/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.dto;

import java.util.List;
/**
 *
 * @author fuyan_iqg
 */// this is data transfer object
public class NotificationMessageDTO {
    private String taskName;
    private String messageBody;
    private List<String> targetEmails; // list of multiple emails
    
    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }
    
    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }
    
    public List<String> getTargetEmails() { return targetEmails; }
    public void setTargetEmails(List<String> targetEmails) { this.targetEmails = targetEmails; }
    
}
