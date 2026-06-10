/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.dto;

/**
 *
 * @author fuyan_iqg
 */
import java.util.List;

public class BatchTaskRequest {

    private List<Long> volunteerIds;
    private Long disasterId;
    private String description;

    public List<Long> getVolunteerIds() {
        return volunteerIds;
    }

    public void setVolunteerIds(List<Long> volunteerIds) {
        this.volunteerIds = volunteerIds;
    }

    public Long getDisasterId() {
        return disasterId;
    }

    public void setDisasterId(Long disasterId) {
        this.disasterId = disasterId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
