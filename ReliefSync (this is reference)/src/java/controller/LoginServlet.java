/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dao.AdminDao;
import dao.VolunteerDao;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Admin;
import model.Volunteer;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;

/**
 *
 * @author junel
 */

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    
    private VolunteerDao volunteerDAO;
    private AdminDao adminDAO;
    
    @Override
    public void init (){
        volunteerDAO = new VolunteerDao();
        adminDAO = new AdminDao();
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
            out.println("<title>Servlet LoginServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet LoginServlet at " + request.getContextPath() + "</h1>");
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
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        
        // Validate user against the specific table based on role
        System.out.println("Passed successfully " + username + password + role);
        Volunteer volunteer = null;
        Admin admin = null;
        
        if("Volunteer".equals(role)){
            volunteer = volunteerDAO.validateVolunteer(username, password);
        } else if("Admin".equals(role)){
            admin = adminDAO.validateAdmin(username, password);
        }
        
        if (volunteer != null) {
            // Login successful
            HttpSession session = request.getSession();
            session.setAttribute("user", volunteer);
            session.setAttribute("username", username);
            session.setAttribute("role", "volunteer");
            
//            String token = generateToken(username, role);
            
            // API Gateway Section
//            response.setContentType("application/json");
//            response.setStatus(HttpServletResponse.SC_OK);
//            PrintWriter out = response.getWriter();
//            out.println(String.format("{\"token\":\"%s\",\"expires_in\":%d}", token, EXPIRATION_TIME));
//            out.flush();
            
            response.sendRedirect("volunteerDashboard.jsp");
        } else if (admin != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", admin);
            session.setAttribute("username", username);
            session.setAttribute("role", "admin");
            
//            String token = generateToken(username, role);
            
//            // API Gateway Section
//            response.setContentType("application/json");
//            response.setStatus(HttpServletResponse.SC_OK);
//            PrintWriter out = response.getWriter();
//            out.println(String.format("{\"token\":\"%s\",\"expires_in\":%d}", token, EXPIRATION_TIME));
//            out.flush();
            
            response.sendRedirect("dashboard.jsp");
        } else {
            // Login failed
            
            // API Gateway Section
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            PrintWriter out = response.getWriter();
//            out.println("{\"error\":\"Invalid username or password\"}");
//            out.flush();
            
            request.setAttribute("error", "Invalid username, password, or role");
            request.getRequestDispatcher("login.jsp").forward(request, response);
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

//    private String generateToken(String username, String role) {
//        return Jwts.builder()
//                .subject(username)
//                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .claim("role", role)  // Add custom claims
//                .signWith(SECRET_KEY)
//                .compact();
//    }
}
