// File: src/pages/Login/MockLogin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MockLogin = () => {
    const navigate = useNavigate();

    // 模拟 Admin 登录
    const handleAdminLogin = () => {
        // 1. 假装拿到了 Token 和 Role
        localStorage.setItem("token", "fake-jwt-token-admin");
        localStorage.setItem("role", "Admin");
        localStorage.setItem("userId", "99"); // Admin ID
        
        // 2. 跳转到 Admin 页面
        navigate('/admin/volunteers');
    };

    // 模拟 Volunteer 登录
    const handleVolunteerLogin = () => {
        // 1. 假装拿到了 Token 和 Role
        localStorage.setItem("token", "fake-jwt-token-vol");
        localStorage.setItem("role", "Volunteer");
        localStorage.setItem("userId", "101"); // Volunteer ID
        
        // 2. 跳转到 Volunteer 页面
        navigate('/volunteer/portal');
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
            <h2>🛠️ Dev Test: Mock Login</h2>
            <p>Auth backend is not ready. Choose a role to test the UI flow:</p>
            
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button 
                    onClick={handleAdminLogin}
                    style={{ padding: '15px 30px', background: '#553C9A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Login as Admin
                </button>
                
                <button 
                    onClick={handleVolunteerLogin}
                    style={{ padding: '15px 30px', background: '#48BB78', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Login as Volunteer
                </button>
            </div>
        </div>
    );
};

export default MockLogin;