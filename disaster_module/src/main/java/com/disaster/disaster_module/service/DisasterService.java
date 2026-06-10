/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.disaster.disaster_module.service;

/**
 *
 * @author fuyan_iqg
 */
import com.disaster.disaster_module.model.Disaster;
import com.disaster.disaster_module.repository.DisasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class DisasterService {

    @Autowired
    private DisasterRepository disasterRepository;

    // Get all disasters
    public List<Disaster> getAllDisasters() {
        return disasterRepository.findAll();
    }

    // Add a new disaster
    public Disaster createDisaster(Disaster disaster) {
        // Set the current time before saving to database
        disaster.setReportedAt(new Timestamp(System.currentTimeMillis()));

        // Ensure default status is ACTIVE if not provided
        if (disaster.getStatus() == null || disaster.getStatus().isEmpty()) {
            disaster.setStatus("ACTIVE");
        }

        return disasterRepository.save(disaster);
    }

    public Disaster updateDisaster(Integer id, Disaster updatedData) {
        Disaster existing = disasterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));
        // 更新所有可編輯欄位
        existing.setLocation(updatedData.getLocation());
        existing.setDisaster_type(updatedData.getDisaster_type());
        existing.setLatitude(updatedData.getLatitude());
        existing.setLongitude(updatedData.getLongitude());
        existing.setStatus(updatedData.getStatus());
        existing.setAge_group(updatedData.getAge_group());
        existing.setDescription(updatedData.getDescription());
        existing.setEstimated_people(updatedData.getEstimated_people());
        existing.setAffected_homes(updatedData.getAffected_homes());
        existing.setReporter_name(updatedData.getReporter_name());
        existing.setReporter_phone(updatedData.getReporter_phone());
        existing.setReporter_org(updatedData.getReporter_org());
        return disasterRepository.save(existing);
    }

    // Update disaster status
    public Disaster updateStatus(Integer id, String newStatus) {
        Disaster existingDisaster = disasterRepository.findById(id).orElse(null);
        if (existingDisaster != null) {
            existingDisaster.setStatus(newStatus);
            return disasterRepository.save(existingDisaster);
        }
        throw new RuntimeException("Disaster ID not found");
    }

    // Delete disaster
    public void deleteDisaster(Integer id) {
        disasterRepository.deleteById(id);
    }

}
