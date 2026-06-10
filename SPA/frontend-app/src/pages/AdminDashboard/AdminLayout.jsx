import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import './adminDashboard.css'; // 复用现有的样式

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* 1. 这部分是你原来的公共左侧菜单栏 / 顶部菜单栏 */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>Disaster Relief</h2>
                </div>
                <nav className="sidebar-menu">
                    <ul>
                        <li><Link to="/admin/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
                        <li><Link to="/admin/disasters"><i className="fas fa-exclamation-triangle"></i> Disasters</Link></li>
                        <li><Link to="/admin/volunteers"><i className="fas fa-users"></i> Volunteers</Link></li>
                        <li><Link to="/admin/tasks"><i className="fas fa-tasks"></i> Tasks</Link></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>

            {/* 2. 右侧核心内容区域：动态渲染子页面 */}
            <main className="main-content">
                <Outlet /> {/* 🚨 这里是关键！所有的子页面（Dashboard、Volunteers等）都会显示在这里 */}
            </main>
        </div>
    );
};

export default AdminLayout;