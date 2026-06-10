// File: src/pages/AdminDashboard/AdminVolunteerManage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin-volunteer-manage.css';

const AdminVolunteerManage = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchAllVolunteers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please login again.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/volunteers/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.clear();
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setVolunteers(data);
            setError('');
        } catch (err) {
            console.error('Error fetching volunteers:', err);
            setError('Failed to load volunteers. Please check network or backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllVolunteers();
    }, []);

    const handleDelete = async (volunteerId) => {
        if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/volunteers/delete/${volunteerId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Volunteer deleted successfully');
                fetchAllVolunteers();
            } else {
                alert('Failed to delete volunteer');
            }
        } catch (err) {
            alert('Error deleting volunteer.');
        }
    };

    if (loading) {
        return <div className="v-main-container" style={{ textAlign: 'center', padding: '2rem' }}>Loading volunteers...</div>;
    }

    if (error) {
        return <div className="v-main-container" style={{ color: 'var(--error)', padding: '2rem' }}>{error}</div>;
    }

    return (
        <div className="v-main-container">
            <div className="v-profile-card" style={{ marginBottom: '0' }}>
                <h2 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>📋 Manage Volunteers</h2>
                <p style={{ color: 'var(--gray-600)' }}>View all registered volunteers and remove inactive accounts.</p>
            </div>

            <div className="v-tasks-section">
                <div className="v-section-title">
                    <h3><i className="fas fa-users"></i> Volunteer List</h3>
                </div>
                <div className="v-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Vol. ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Skills</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No volunteers found.
                                    </td>
                                </tr>
                            ) : (
                                volunteers.map(vol => (
                                    <tr key={vol.volunteerId}>
                                        <td><strong>v{String(vol.volunteerId).padStart(3, '0')}</strong></td>
                                        <td>{vol.name}</td>
                                        <td>{vol.email}</td>
                                        <td>
                                            <span className="status-badge status-active" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                                                {vol.skill}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(vol.volunteerId)}
                                                className="btn-delete"
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminVolunteerManage;