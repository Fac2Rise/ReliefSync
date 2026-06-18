// File: src/pages/VolunteerDashboard/VolunteerPortal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './volunteer-dashboard.css';

const VolunteerPortal = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        // 🚀 在 useEffect 內部即時獲取，確保此時 localStorage 已經完全寫入
        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("userId");

        if (!token || !currentUserId) {
            console.log("未檢測到合法的 Token 或 ID，正在安全跳轉...");
            navigate('/login');
            return;
        }
        
        // 將動態拿到的最正確 ID 與 Token 傳給 fetch 函數
        fetchMyProfile(currentUserId, token);
        fetchMyTasks(currentUserId, token);
    }, []);

    // 1. Fetch own profile from Volunteer Module
    const fetchMyProfile = (userId, token) => {
        fetch(`http://localhost:8080/api/volunteers/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log("成功動態加載志工資料:", data);
                setProfile(data);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
            });
    };

    // 2. Fetch assigned tasks from TASK ASSIGN MODULE
    const fetchMyTasks = (userId, token) => {
        fetch(`http://localhost:8080/api/tasks/volunteer/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log("成功動態加載任務清單:", data);
                setTasks(data);
            })
            .catch(err => console.error("Error fetching tasks:", err));
    };

    // 打開編輯視窗時，把目前拿到的 profile 塞進表單裡
    const openEditModal = () => {
        setEditForm({
            volunteerId: profile.volunteerId || '',
            name: profile.name || '',
            email: profile.email || '',
            skill: profile.skill || ''
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    // 3. Update own profile to Volunteer Module
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        
        // 🚀 每次觸發更新時，重新獲取最新的 ID 與 通行證，避免未定義錯誤
        const activeUserId = localStorage.getItem("userId");
        const activeToken = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/volunteers/update/${activeUserId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editForm)
        })
            .then(res => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then(updatedData => {
                setProfile(updatedData); 
                setIsEditModalOpen(false); 
                alert("Profile updated successfully!");
            })
            .catch(err => alert("Error updating profile. Please try again."));
    };

    return (
        <div className="volunteer-layout">
            <header className="v-header">
                <div className="logo"><i className="fas fa-hand-holding-heart"></i> ReliefSync</div>
                <div className="v-header-right">
                    <span className="v-badge">Volunteer Portal</span>
                </div>
            </header>

            <main className="v-main-container">
                {/* PROFILE SECTION */}
                <section className="v-profile-card">
                    <div className="v-profile-header">
                        <div className="v-avatar"><i className="fas fa-user"></i></div>
                        <div className="v-profile-info">
                            <h2>{profile.name || "Loading..."}</h2>
                            <p><i className="fas fa-envelope"></i> {profile.email}</p>
                            <p><i className="fas fa-tools"></i> Skills: <strong>{profile.skill}</strong></p>
                        </div>
                        <button className="btn-edit-profile" onClick={openEditModal}>
                            <i className="fas fa-pen"></i> Edit Profile
                        </button>
                    </div>
                </section>

                {/* TASKS SECTION */}
                <section className="v-tasks-section">
                    <div className="v-section-title">
                        <h3><i className="fas fa-clipboard-list"></i> My Assigned Tasks</h3>
                    </div>
                    <div className="v-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Disaster ID</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length === 0 ? (
                                    <tr><td colSpan="4">You have no tasks assigned currently.</td></tr>
                                ) : (
                                    tasks.map(task => (
                                        <tr key={task.taskId}>
                                            <td>#{task.taskId}</td>
                                            <td>#{task.disasterId}</td>
                                            <td>{task.description}</td>
                                            <td><span className="status-badge status-active">{task.status || 'PENDING'}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="v-modal-overlay">
                    <div className="v-modal-content">
                        <div className="v-modal-header">
                            <h3>Update Profile</h3>
                            <button className="v-close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="v-modal-body">
                                <div className="v-form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={editForm.name} onChange={handleInputChange} required />
                                </div>
                                <div className="v-form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={editForm.email} onChange={handleInputChange} required />
                                </div>
                                <div className="v-form-group">
                                    <label>Specialized Skills</label>
                                    <input type="text" name="skill" value={editForm.skill} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="v-modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerPortal;