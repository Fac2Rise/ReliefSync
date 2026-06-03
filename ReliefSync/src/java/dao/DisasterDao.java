package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import model.Disaster;
import util.DBConnection;

public class DisasterDao {
    
    // Add a new disaster report
    public boolean addDisaster(Disaster disaster) throws SQLException {
        String sql = "INSERT INTO disasters (location, latitude, longitude, disaster_type, status, age_group, reported_at) "
                   + "VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, disaster.getLocation());
            pstmt.setDouble(2, disaster.getLatitude());
            pstmt.setDouble(3, disaster.getLongitude());
            pstmt.setString(4, disaster.getDisaster_type());
            pstmt.setString(5, disaster.getStatus());
            pstmt.setString(6, disaster.getAge_group());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                ResultSet generatedKeys = pstmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    disaster.setId(generatedKeys.getInt(1));
                }
                return true;
            }
            return false;
        }
    }
    
    // Get all disasters
    public List<Disaster> getAllDisasters() throws SQLException {
        List<Disaster> disasters = new ArrayList<>();
        String sql = "SELECT * FROM disasters ORDER BY reported_at DESC";
        
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Disaster disaster = mapResultSetToDisaster(rs);
                disasters.add(disaster);
            }
        }
        return disasters;
    }
    
    // Get disaster by ID
    public Disaster getDisasterById(int id) throws SQLException {
        String sql = "SELECT * FROM disasters WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToDisaster(rs);
            }
        }
        return null;
    }
    
    // Get disasters by status
    public List<Disaster> getDisastersByStatus(String status) throws SQLException {
        List<Disaster> disasters = new ArrayList<>();
        String sql = "SELECT * FROM disasters WHERE status = ? ORDER BY reported_at DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Disaster disaster = mapResultSetToDisaster(rs);
                disasters.add(disaster);
            }
        }
        return disasters;
    }
    
    // Get disasters by type
    public List<Disaster> getDisastersByType(String disasterType) throws SQLException {
        List<Disaster> disasters = new ArrayList<>();
        String sql = "SELECT * FROM disasters WHERE disaster_type = ? ORDER BY reported_at DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, disasterType);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Disaster disaster = mapResultSetToDisaster(rs);
                disasters.add(disaster);
            }
        }
        return disasters;
    }
    
    // Get disasters by location (nearby)
    public List<Disaster> getDisastersByLocation(double latitude, double longitude, double radiusKm) throws SQLException {
        List<Disaster> disasters = new ArrayList<>();
        // 1 degree latitude ≈ 111 km
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));
        
        String sql = "SELECT * FROM disasters WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setDouble(1, latitude - latDelta);
            pstmt.setDouble(2, latitude + latDelta);
            pstmt.setDouble(3, longitude - lngDelta);
            pstmt.setDouble(4, longitude + lngDelta);
            
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Disaster disaster = mapResultSetToDisaster(rs);
                disasters.add(disaster);
            }
        }
        return disasters;
    }
    
    // Update disaster status
    public boolean updateDisasterStatus(int id, String newStatus) throws SQLException {
        String sql = "UPDATE disasters SET status = ? WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, newStatus);
            pstmt.setInt(2, id);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        }
    }
    
    // Update full disaster
    public boolean updateDisaster(Disaster disaster) throws SQLException {
        String sql = "UPDATE disasters SET location = ?, latitude = ?, longitude = ?, "
                   + "disaster_type = ?, status = ?, age_group = ? WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, disaster.getLocation());
            pstmt.setDouble(2, disaster.getLatitude());
            pstmt.setDouble(3, disaster.getLongitude());
            pstmt.setString(4, disaster.getDisaster_type());
            pstmt.setString(5, disaster.getStatus());
            pstmt.setString(6, disaster.getAge_group());
            pstmt.setInt(7, disaster.getId());
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        }
    }
    
    // Delete disaster
    public boolean deleteDisaster(int id) throws SQLException {
        String sql = "DELETE FROM disasters WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        }
    }
    
    // Get count of active disasters
    public int getActiveDisastersCount() throws SQLException {
        String sql = "SELECT COUNT(*) FROM disasters WHERE status = 'ACTIVE'";
        
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
    
    // Get count by status
    public int getCountByStatus(String status) throws SQLException {
        String sql = "SELECT COUNT(*) FROM disasters WHERE status = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
    
    // Map ResultSet to Disaster object
    private Disaster mapResultSetToDisaster(ResultSet rs) throws SQLException {
        Disaster disaster = new Disaster();
        disaster.setId(rs.getInt("id"));
        disaster.setLocation(rs.getString("location"));
        disaster.setLatitude(rs.getDouble("latitude"));
        disaster.setLongitude(rs.getDouble("longitude"));
        disaster.setDisaster_type(rs.getString("disaster_type"));
        disaster.setStatus(rs.getString("status"));
        disaster.setAge_group(rs.getString("age_group"));
        disaster.setTimestamp(rs.getTimestamp("reported_at").toString());
        return disaster;
    }
    
    
}
