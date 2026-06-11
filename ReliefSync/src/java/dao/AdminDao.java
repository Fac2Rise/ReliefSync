/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Admin;
import util.DBConnection;

/**
 *
 * @author junel
 */
public class AdminDao {
    public Admin validateAdmin(String username, String password){
        Admin admin = new Admin();
        
        String query = "SELECT * FROM admin_users WHERE username = ? AND password = ?";
        
        try (Connection conn = DBConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            
            ResultSet rs = pstmt.executeQuery();
            
            if(rs.next()){
                admin.setId(rs.getInt("id"));
                admin.setUsername(rs.getString("username"));
                admin.setPassword(rs.getString("password"));
                admin.setPhone_number(rs.getString("phone_number"));
                admin.setEmail(rs.getString("email"));
                admin.setFull_name(rs.getString("full_name"));
            }
            
            return admin;
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return null;
    }
}
