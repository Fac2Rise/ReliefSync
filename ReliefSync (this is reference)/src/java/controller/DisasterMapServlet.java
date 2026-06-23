/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import model.Disaster;
import dao.DisasterDao;
import java.io.PrintWriter;

/**
 *
 * @author junel
 */

public class DisasterMapServlet extends HttpServlet {
    
    private DisasterDao disasterDAO;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        super.init();
        disasterDAO = new DisasterDao();
        gson = new Gson();
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet DisasterMapServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet DisasterMapServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            // Get parameters for filtering
            String status = request.getParameter("status");
            String type = request.getParameter("type");
            
            List<Disaster> disasters;
            
            if (status != null && !status.isEmpty()) {
                disasters = disasterDAO.getDisastersByStatus(status);
            } else if (type != null && !type.isEmpty()) {
                disasters = disasterDAO.getDisastersByType(type);
            } else {
                disasters = disasterDAO.getAllDisasters();
            }
            
            // Convert to JSON-friendly format
            List<Map<String, Object>> jsonDisasters = new java.util.ArrayList<>();
            for (Disaster d : disasters) {
                Map<String, Object> disasterMap = new HashMap<>();
                disasterMap.put("id", d.getId());
                disasterMap.put("location", d.getLocation());
                disasterMap.put("latitude", d.getLatitude());
                disasterMap.put("longitude", d.getLongitude());
                disasterMap.put("disasterType", d.getDisaster_type());
                disasterMap.put("status", d.getStatus());
                disasterMap.put("ageGroup", d.getAge_group());
                disasterMap.put("timestamp", d.getTimestamp());
                jsonDisasters.add(disasterMap);
            }
            
            String json = gson.toJson(jsonDisasters);
            response.getWriter().write(json);
            
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
    

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
