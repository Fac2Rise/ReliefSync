/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.disaster.disaster_module.repository;

/**
 *
 * @author fuyan_iqg
 */
import com.disaster.disaster_module.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DisasterRepository extends JpaRepository<Disaster, Integer>{
    
    List<Disaster> findByStatus(String status);
    
    
    @Query("SELECT d FROM Disaster d WHERE d.disaster_type = :type")
    List<Disaster> findByDisasterType(@Param("type") String type);

}
    

