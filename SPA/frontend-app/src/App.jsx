import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Auth Pages
import Login from './pages/login/Login';
import Register from './pages/register/Register';

//layout component
import AdminLayout from './pages/AdminDashboard/AdminLayout';

// 2. Admin Pages
import AdminVolunteerManage from './pages/AdminDashboard/AdminVolunteerManage';
import AdminDisasters from './pages/AdminDashboard/AdminDisasters';
import Dashboard from './pages/AdminDashboard/Dashboard'; // This is the Map Dashboard
import TaskAssign from './pages/taskAssign/TaskAssign';

// 3. Volunteer Pages
import VolunteerPortal from './pages/volunteer/VolunteerPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="disasters" element={<AdminDisasters />} />
          <Route path="volunteers" element={<AdminVolunteerManage />} />
          <Route path="tasks" element={<TaskAssign />} />
        </Route>
        
        {/* Volunteer Routes */}
        <Route path="/volunteer/portal" element={<VolunteerPortal />} />

        {/* Fallback route for 404 Not Found */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;