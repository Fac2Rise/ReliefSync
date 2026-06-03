package model;

import java.sql.Timestamp;

public class Disaster {
    
    private int id;
    private String location;
    private double latitude;
    private double longitude;
    private String disaster_type;
    private String status;
    private String age_group;
    private String timestamp;  // For string representation
    private Timestamp reportedAt;  // For proper date handling
    
    public Disaster() {}
    
    public Disaster(String location, double latitude, double longitude, 
                    String disaster_type, String status, String age_group, String timestamp) {
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.disaster_type = disaster_type;
        this.status = status;
        this.age_group = age_group;
        this.timestamp = timestamp;
    }
    
    public Disaster(int id, String location, double latitude, double longitude, 
                    String disaster_type, String status, String age_group, String timestamp) {
        this.id = id;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.disaster_type = disaster_type;
        this.status = status;
        this.age_group = age_group;
        this.timestamp = timestamp;
    }

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

    public String getTimestamp() {
        if (timestamp == null && reportedAt != null) {
            return reportedAt.toString();
        }
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    
    public Timestamp getReportedAt() {
        return reportedAt;
    }
    
    public void setReportedAt(Timestamp reportedAt) {
        this.reportedAt = reportedAt;
    }
    
    @Override
    public String toString() {
        return "Disaster{" +
                "id=" + id +
                ", location='" + location + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", disaster_type='" + disaster_type + '\'' +
                ", status='" + status + '\'' +
                ", age_group='" + age_group + '\'' +
                ", timestamp='" + getTimestamp() + '\'' +
                '}';
    }
}