import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';

const Login = () => {
    const navigate = useNavigate();
    
    // React 的状态管理，代替传统的 form 提交
    const [credentials, setCredentials] = useState({
        email: '', // 按照微服务标准，我们用 email 代替 username
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 调用你的 API Gateway 的 Auth 接口
        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
        .then(async (res) => {
            const data = await res.json();
            if (res.ok) {
                // 登录成功！保存 JWT Token 和用户角色
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data.userId);
                
                // React 前端路由分流 (代替 Servlet 的 sendRedirect)
                if (data.role === 'Admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/volunteer/portal');
                }
            } else {
                // 登录失败，显示错误信息
                setError(data.message || 'Invalid credentials');
            }
        })
        .catch(err => {
            setError('Network error. Is backend running?');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="container">
            {/* 左侧品牌区 - 完全复刻你的 login.jsp */}
            <div className="brand-section">
                <div className="brand-content">
                    <div className="logo">
                        <i className="fas fa-hand-holding-heart"></i>
                        <span>ReliefSync</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Access the disaster relief coordination system to manage responses, track resources, and coordinate aid efforts efficiently.</p>
                    <div className="stats">
                        <div className="stat">
                            <i className="fas fa-check-circle"></i>
                            <span>1,234+</span>
                            <small>Rescues Coordinated</small>
                        </div>
                        <div className="stat">
                            <i className="fas fa-users"></i>
                            <span>56</span>
                            <small>Active Teams</small>
                        </div>
                        <div className="stat">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>12</span>
                            <small>Regions Covered</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧登录表单 */}
            <div className="login-section">
                <div className="login-container">
                    <div className="login-header">
                        <h2>Sign In</h2>
                        <p>Enter your credentials to access the dashboard</p>
                    </div>

                    {/* 错误提示框 */}
                    {error && (
                        <div className="alert alert-error">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email"><i className="fas fa-user"></i> Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={credentials.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                name="password" 
                                value={credentials.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password" 
                                required 
                            />
                            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" name="remember" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                        </div>

                        <button type="submit" className={`login-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>

                        <div className="register-link">
                            Don't have an account? <Link to="/register">Create an account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;