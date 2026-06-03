<%-- 
    Document   : logout
    Created on : Jun 3, 2026, 11:29:55 PM
    Author     : junel
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    // Invalidate the session when the page loads
    session.invalidate();
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout - Disaster Relief Coordinator</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --purple-primary: #6B46C1;
            --purple-dark: #553C9A;
            --purple-light: #9F7AEA;
            --purple-ultra-light: #F3E8FF;
            --white: #FFFFFF;
            --gray-50: #F7FAFC;
            --gray-100: #EDF2F7;
            --gray-200: #E2E8F0;
            --gray-600: #718096;
            --gray-800: #2D3748;
            --success: #48BB78;
            --error: #F56565;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .logout-container {
            max-width: 500px;
            width: 100%;
            background: var(--white);
            border-radius: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            animation: slideUp 0.5s ease;
            text-align: center;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes checkmark {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                visibility: hidden;
            }
        }

        /* Header Section */
        .logout-header {
            background: linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%);
            color: white;
            padding: 40px 30px;
        }

        .logo {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .logout-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .logout-header p {
            font-size: 14px;
            opacity: 0.9;
        }

        /* Content Section */
        .logout-content {
            padding: 40px 30px;
        }

        /* Success Icon */
        .success-icon {
            width: 80px;
            height: 80px;
            background: var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
            animation: checkmark 0.5s ease;
        }

        .success-icon i {
            font-size: 45px;
            color: white;
        }

        /* Message Text */
        .message-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--gray-800);
            margin-bottom: 10px;
        }

        .message-text {
            color: var(--gray-600);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        /* Session Info */
        .session-info {
            background: var(--gray-50);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
            border: 1px solid var(--gray-200);
        }

        .session-info h4 {
            color: var(--purple-primary);
            font-size: 14px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .session-info ul {
            list-style: none;
            padding-left: 0;
        }

        .session-info li {
            padding: 8px 0;
            font-size: 13px;
            color: var(--gray-600);
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid var(--gray-100);
        }

        .session-info li:last-child {
            border-bottom: none;
        }

        .session-info li i {
            width: 20px;
            color: var(--purple-primary);
            font-size: 12px;
        }

        /* Tips Box */
        .tips-box {
            background: var(--purple-ultra-light);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 30px;
            text-align: left;
        }

        .tips-box h4 {
            color: var(--purple-dark);
            font-size: 13px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tips-box p {
            font-size: 12px;
            color: var(--purple-primary);
            line-height: 1.5;
            margin-bottom: 8px;
        }

        .tips-box p:last-child {
            margin-bottom: 0;
        }

        /* Buttons */
        .button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .btn-primary, .btn-secondary {
            padding: 12px 28px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-family: inherit;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
        }

        .btn-secondary {
            background: var(--gray-200);
            color: var(--gray-800);
        }

        .btn-secondary:hover {
            background: var(--gray-300);
            transform: translateY(-2px);
        }

        /* Auto-redirect Message */
        .auto-redirect {
            margin-top: 25px;
            font-size: 12px;
            color: var(--gray-600);
        }

        .countdown {
            color: var(--purple-primary);
            font-weight: 700;
            font-size: 14px;
        }

        /* Footer */
        .logout-footer {
            background: var(--gray-50);
            padding: 15px 30px;
            border-top: 1px solid var(--gray-200);
            font-size: 12px;
            color: var(--gray-600);
        }

        /* Responsive */
        @media (max-width: 480px) {
            .logout-container {
                margin: 10px;
            }
            .logout-content {
                padding: 30px 20px;
            }
            .button-group {
                flex-direction: column;
            }
            .btn-primary, .btn-secondary {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="logout-container">
        <div class="logout-header">
            <div class="logo">
                <i class="fas fa-hand-holding-heart"></i>
            </div>
            <h1>Goodbye!</h1>
            <p>You have been successfully logged out</p>
        </div>

        <div class="logout-content">
            <!-- Success Animation -->
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>

            <div class="message-title">
                Logout Successful
            </div>
            <div class="message-text">
                Thank you for using the Disaster Relief Coordination System.<br>
                Your session has been securely terminated.
            </div>

            <!-- Session Information -->
            <div class="session-info">
                <h4><i class="fas fa-shield-alt"></i> Session Information</h4>
                <ul>
                    <li><i class="fas fa-check-circle"></i> Session has been invalidated</li>
                    <li><i class="fas fa-trash-alt"></i> All session data cleared</li>
                    <li><i class="fas fa-clock"></i> Logout time: <span id="logoutTime"></span></li>
                </ul>
            </div>

            <!-- Security Tips -->
            <div class="tips-box">
                <h4><i class="fas fa-lightbulb"></i> Security Tips</h4>
                <p>✓ Close all browser windows for complete security</p>
                <p>✓ Clear your browser cache if using a public computer</p>
                <p>✓ Use strong passwords and enable 2FA for your account</p>
            </div>

            <!-- Action Buttons -->
            <div class="button-group">
                <a href="login.jsp" class="btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Login Again
                </a>
                <a href="index.jsp" class="btn-secondary">
                    <i class="fas fa-home"></i> Return to Home
                </a>
            </div>

            <!-- Auto-redirect Countdown -->
            <div class="auto-redirect">
                Redirecting to login page in <span class="countdown" id="countdown">5</span> seconds...
            </div>
        </div>

        <div class="logout-footer">
            <p><i class="fas fa-shield-alt"></i> Disaster Relief Coordination System © 2024 | Secure Logout</p>
        </div>
    </div>

    <script>
        // Display current logout time
        function displayLogoutTime() {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            };
            document.getElementById('logoutTime').textContent = now.toLocaleTimeString();
        }
        
        // Auto-redirect countdown
        let seconds = 5;
        const countdownElement = document.getElementById('countdown');
        
        function updateCountdown() {
            seconds--;
            if (countdownElement) {
                countdownElement.textContent = seconds;
            }
            if (seconds <= 0) {
                clearInterval(timer);
                window.location.href = 'login.jsp';
            }
        }
        
        // Prevent back button from accessing cached page
        function preventBackNavigation() {
            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function() {
                window.history.go(1);
            };
        }
        
        // Clear browser cache for this page
        function disablePageCaching() {
            window.addEventListener('pageshow', function(event) {
                if (event.persisted) {
                    window.location.reload();
                }
            });
        }
        
        // Initialize page
        displayLogoutTime();
        const timer = setInterval(updateCountdown, 1000);
        preventBackNavigation();
        disablePageCaching();
        
        // Optional: Clear any stored user data from localStorage/sessionStorage
        function clearStoredData() {
            // Clear any disaster report drafts
            localStorage.removeItem('disasterReportDraft');
            sessionStorage.clear();
            console.log('Local storage cleared for security');
        }
        
        clearStoredData();
    </script>
</body>
</html>
