// File: src/pages/VolunteerDashboard/VolunteerPortal.jsx
import React, { useState, useEffect } from 'react';
import './volunteer-dashboard.css'; // Use the CSS I provided previously

const VolunteerPortal = () => {
    // We assume the user ID is saved in localStorage during Login
    const currentUserId = localStorage.getItem("userId") || 1; // Default to 1 for testing

    const [profile, setProfile] = useState({});
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchMyProfile();
        fetchMyTasks();
    }, []);

    // 1. Fetch own profile from Volunteer Module
    const fetchMyProfile = () => {
        // Assume you create a getById API in Volunteer controller
        fetch(`http://localhost:8080/api/volunteers/${currentUserId}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Error fetching profile", err));
    };

    // 2. Fetch assigned tasks from TASK ASSIGN MODULE (Port 8083 via Gateway 8080)
    const fetchMyTasks = () => {
        // Call the Task module API. You will need to create this endpoint in TaskController 
        // to filter tasks by volunteerId.
        fetch(`http://localhost:8080/api/tasks/volunteer/${currentUserId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks", err));
    };

    const openEditModal = () => {
        setEditForm(profile); 
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    // 3. Update own profile to Volunteer Module
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/volunteers/update/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        })
        .then(res => res.json())
        .then(updatedData => {
            setProfile(updatedData);
            setIsEditModalOpen(false);
            alert("Profile updated successfully!");
        })
        .catch(err => alert("Error updating profile."));
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
                {/* PROFILE SECTION (Can update) */}
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

                {/* TASKS SECTION (View only, data comes from Task Module) */}
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
                                    <input type="text" name="name" value={editForm.name || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="v-form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={editForm.email || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="v-form-group">
                                    <label>Specialized Skills</label>
                                    <input type="text" name="skill" value={editForm.skill || ''} onChange={handleInputChange} required />
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