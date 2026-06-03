<%-- 
    Document   : login
    Created on : May 12, 2026, 8:33:38 PM
    Author     : junel
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disaster Relief Coordinator - Login</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- Left Side - Branding Section -->
        <div class="brand-section">
            <div class="brand-content">
                <div class="logo">
                    <i class="fas fa-hand-holding-heart"></i>
                    <span>ReliefSync</span>
                </div>
                <h1>Welcome Back</h1>
                <p>Access the disaster relief coordination system to manage responses, track resources, and coordinate aid efforts efficiently.</p>
                <div class="stats">
                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>1,234+</span>
                        <small>Rescues Coordinated</small>
                    </div>
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>56</span>
                        <small>Active Teams</small>
                    </div>
                    <div class="stat">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>12</span>
                        <small>Regions Covered</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="login-section">
            <div class="login-container">
                <div class="login-header">
                    <h2>Sign In</h2>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                <!-- Display error message if login fails -->
                <%
                    String error = request.getParameter("error");
                    if (error != null && error.equals("invalid")) {
                %>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        Invalid username or password. Please try again.
                    </div>
                <% } else if (error != null && error.equals("empty")) { %>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        Please enter both username and password.
                    </div>
                <% } %>

                <form action="login" method="post" class="login-form">
                    
                    <div class="radio-group">
                        <label><i class="fas fa-user-tag"></i> Select Role</label>
                        <div class="radio-options">
                            <label class="radio-container">
                                <input type="radio" name="role" value="Admin" checked>
                                <span class="radio-checkmark"></span>
                                <span><i class="fas"></i> Admin</span>
                            </label>
                            <label class="radio-container">
                                <input type="radio" name="role" value="Volunteer">
                                <span class="radio-checkmark"></span>
                                <span><i class="fas"></i> Volunteer</span>
                            </label>
                            <label class="radio-container">
                                <input type="radio" name="role" value="Manager">
                                <span class="radio-checkmark"></span>
                                <span><i class="fab"></i> Manager</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="username">
                            <i class="fas fa-user"></i>
                            Username or Email
                        </label>
                        <input type="text" id="username" name="username" 
                               placeholder="Enter your username" required autofocus>
                    </div>
                    

                    <div class="form-group">
                        <label for="password">
                            <i class="fas fa-lock"></i>
                            Password
                        </label>
                        <input type="password" id="password" name="password" 
                               placeholder="Enter your password" required>
                        <div class="password-toggle" onclick="togglePassword()">
                            <i class="far fa-eye" id="toggleIcon"></i>
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" name="remember">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                        <a href="forgot-password.jsp" class="forgot-link">Forgot Password?</a>
                    </div>

                    <button type="submit" class="login-btn">
                        <span>Sign In</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>

                    <div class="register-link">
                        Don't have an account? <a href="register.jsp">Create an account</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }
    </script>
</body>
</html>
