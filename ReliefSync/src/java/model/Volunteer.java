/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author junel
 */
public class Volunteer {
    
    private int id;
    private String username;
    private String password;
    private String name;
    private String phoneNo;
    private String email;
    private String address;
    
    public Volunteer(){}
    
    // For inserting new user into DB
    public Volunteer (int id, String username, String password, String name, String phoneNo, String email, String address){
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.phoneNo = phoneNo;
        this.email = email;
        this.address = address;
    }
    
    // For Reading, Updating and Deleting
    public Volunteer (String name, String phoneNo, String email, String address){
        this.name = name;
        this.phoneNo = phoneNo;
        this.email = email;
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    
}
