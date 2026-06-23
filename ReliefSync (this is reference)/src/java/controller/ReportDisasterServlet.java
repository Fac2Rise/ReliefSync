/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Disaster;
import dao.DisasterDao;
import java.sql.SQLException;

/**
 *
 * @author junel
 */
public class ReportDisasterServlet extends HttpServlet {
    
    private DisasterDao disasterDAO;
    
    @Override
    public void init() throws ServletException {
        super.init();
        disasterDAO = new DisasterDao();
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
            out.println("<title>Servlet ReportDisasterServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ReportDisasterServlet at " + request.getContextPath() + "</h1>");
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
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     * @throws java.sql.SQLException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String locationName = request.getParameter("locationName");
        String latitudeStr = request.getParameter("latitude");
        String longitudeStr = request.getParameter("longitude");
        String incidentType = request.getParameter("incidentType");
        String description = request.getParameter("description");
        String ageGroup = request.getParameter("ageGroup");
        String estimatedPeople = request.getParameter("estimatedPeople");
        String affectedHomes = request.getParameter("affectedHomes");
        String reporterName = request.getParameter("reporterName");
        String reporterPhone = request.getParameter("reporterPhone");
        String reporterOrg = request.getParameter("reporterOrg");

        // Validate required fields
        if (locationName == null || locationName.trim().isEmpty()) {
            response.sendRedirect("report-disaster.jsp?error=location");
            return;
        }

        if (latitudeStr == null || latitudeStr.trim().isEmpty()) {
            response.sendRedirect("report-disaster.jsp?error=latitude");
            return;
        }

        if (longitudeStr == null || longitudeStr.trim().isEmpty()) {
            response.sendRedirect("report-disaster.jsp?error=longitude");
            return;
        }

        if (incidentType == null || incidentType.trim().isEmpty()) {
            response.sendRedirect("report-disaster.jsp?error=type");
            return;
        }

        try {
            // Parse coordinates
            double latitude = Double.parseDouble(latitudeStr);
            double longitude = Double.parseDouble(longitudeStr);

            // Create Disaster object
            Disaster disaster = new Disaster();
            disaster.setLocation(locationName);
            disaster.setLatitude(latitude);
            disaster.setLongitude(longitude);
            disaster.setDisaster_type(incidentType);
            disaster.setStatus("ACTIVE"); // Default status for new reports
            disaster.setAge_group(ageGroup);

            // Set additional fields if needed (you may want to add these to your Disaster model)
            // For now, we'll use the basic Disaster object

            // Save to database using DAO
            boolean isSaved = disasterDAO.addDisaster(disaster);

            if (isSaved) {
                // Redirect to dashboard with success message
                response.sendRedirect("dashboard.jsp?success=reported");
            } else {
                response.sendRedirect("report-disaster.jsp?error=database");
            }

        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.sendRedirect("report-disaster.jsp?error=coordinates");
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect("report-disaster.jsp?error=database");
        }
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
