// File: src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 引入你的页面
import MockLogin from './pages/login/MockLogin';
import AdminVolunteerManage from './pages/admin-dashboard/admin-volunteer-manage.jsx';
import VolunteerPortal from './pages/volunteer/volunteer-dashboard.jsx';
import Register from './pages/register/register.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认打开时进入 Login 页面 */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 登录页面 */}
        <Route path="/login" element={<MockLogin />} />
        
        {/* Admin 页面 */}
        <Route path="/admin/volunteers" element={<AdminVolunteerManage />} />
        
        {/* Volunteer 页面 */}
        <Route path="/volunteer/portal" element={<VolunteerPortal />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;