/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.disaster.disaster_module.model;

/**
 *
 * @author fuyan_iqg
 */
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "disasters")
public class Disaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String location;
    private double latitude;
    private double longitude;
    private String disaster_type;
    private String status;
    private String age_group;
    private String description;
    private Integer estimated_people;
    private Integer affected_homes;
    private String reporter_name;
    private String reporter_phone;
    private String reporter_org;

    @Column(name = "reported_at")
    private Timestamp reportedAt;

    @Transient
    private String timestamp;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getDisaster_type() {
        return disaster_type;
    }

    public void setDisaster_type(String disaster_type) {
        this.disaster_type = disaster_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAge_group() {
        return age_group;
    }

    public void setAge_group(String age_group) {
        this.age_group = age_group;
    }

    public Timestamp getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(Timestamp reportedAt) {
        this.reportedAt = reportedAt;
    }

    public String getTimestamp() {
        if (timestamp == null && reportedAt != null) {
            return reportedAt.toString();
        }
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getEstimated_people() {
        return estimated_people;
    }

    public void setEstimated_people(Integer estimated_people) {
        this.estimated_people = estimated_people;
    }

    public Integer getAffected_homes() {
        return affected_homes;
    }

    public void setAffected_homes(Integer affected_homes) {
        this.affected_homes = affected_homes;
    }

    public String getReporter_name() {
        return reporter_name;
    }

    public void setReporter_name(String reporter_name) {
        this.reporter_name = reporter_name;
    }

    public String getReporter_phone() {
        return reporter_phone;
    }

    public void setReporter_phone(String reporter_phone) {
        this.reporter_phone = reporter_phone;
    }

    public String getReporter_org() {
        return reporter_org;
    }

    public void setReporter_org(String reporter_org) {
        this.reporter_org = reporter_org;
    }

}
