/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Volunteer;
import util.DBConnection;

/**
 *
 * @author junel
 */
public class VolunteerDao {
    
    public Volunteer validateVolunteer(String username, String password){
        Volunteer volunteer = new Volunteer();
        
        String query = "SELECT * FROM volunteer WHERE username = ? AND password = ?";
        
        try (Connection conn = DBConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            
            ResultSet rs = pstmt.executeQuery();
            
            if(rs.next()){
                volunteer.setId(rs.getInt("id"));
                volunteer.setUsername(rs.getString("username"));
                volunteer.setName(rs.getString("name"));
                volunteer.setPhoneNo(rs.getString("phoneNo"));
                volunteer.setEmail(rs.getString("email"));
                volunteer.setAddress(rs.getString("address"));
            }
            
            return volunteer;
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return null;
    }
}
