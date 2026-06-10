/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.disaster.disaster_module.controller;

/**
 *
 * @author fuyan_iqg
 */
import com.disaster.disaster_module.model.Disaster;
import com.disaster.disaster_module.service.DisasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/disasters")
public class DisasterController {

    @Autowired
    private DisasterService disasterService;

    // read all
    @GetMapping("/all")
    public List<Disaster> getAll() {
        return disasterService.getAllDisasters();
    }

    // Create
    @PostMapping("/add")
    public Disaster addDisaster(@RequestBody Disaster disaster) {
        return disasterService.createDisaster(disaster);
    }

    @PutMapping("/update/{id}")
    public Disaster updateDisaster(@PathVariable("id") Integer id, @RequestBody Disaster updatedData) {
        return disasterService.updateDisaster(id, updatedData);
    }

    // Update status
    @PutMapping("/update-status/{id}")
    public Disaster updateStatus(@PathVariable("id") Integer id, @RequestParam String status) {
        return disasterService.updateStatus(id, status);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public String deleteDisaster(@PathVariable("id") Integer id) {
        disasterService.deleteDisaster(id);
        return "Disaster successfully deleted";
    }
}
