// File: src/pages/AdminDashboard/AdminVolunteerManage.jsx
import React, { useState, useEffect } from 'react';
import './admin-volunteer-manage.css'; // Create this CSS file for styling the admin volunteer management page

const AdminVolunteerManage = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        fetchAllVolunteers();
    }, []);

    // Fetch all volunteers from Volunteer Module (Port 8082 or via Gateway 8080)
    const fetchAllVolunteers = () => {
        fetch('http://localhost:8080/api/volunteers/all')
            .then(res => res.json())
            .then(data => setVolunteers(data))
            .catch(err => console.error("Error fetching volunteers:", err));
    };

    // Delete a volunteer
    const handleDelete = (volunteerId) => {
        if (window.confirm("Are you sure you want to delete this volunteer?")) {
            fetch(`http://localhost:8080/api/volunteers/delete/${volunteerId}`, {
                method: 'DELETE'
            })
            .then(res => res.text())
            .then(message => {
                alert("✅ " + message);
                // Refresh the list after successful deletion
                fetchAllVolunteers();
            })
            .catch(err => alert("Error deleting volunteer."));
        }
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="logo"><i className="fas fa-users-cog"></i> Admin Portal</div>
            </header>

            <main className="admin-container" style={{ padding: '40px' }}>
                <h2>📋 Manage Volunteers</h2>
                <p>View all registered volunteers and remove inactive accounts.</p>
                
                <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8f9fa', height: '50px' }}>
                            <tr>
                                <th style={{ padding: '10px' }}>Vol. ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Skills</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No volunteers found.</td></tr>
                            ) : (
                                volunteers.map(vol => (
                                    <tr key={vol.volunteerId} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 10px' }}><strong>v{String(vol.volunteerId).padStart(3, '0')}</strong></td>
                                        <td>{vol.name}</td>
                                        <td>{vol.email}</td>
                                        <td><span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>{vol.skill}</span></td>
                                        <td>
                                            {/* ONLY Delete button exists here, no Edit button */}
                                            <button 
                                                onClick={() => handleDelete(vol.volunteerId)}
                                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminVolunteerManage;