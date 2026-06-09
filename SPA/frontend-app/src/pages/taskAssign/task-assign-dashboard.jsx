import React, { useState, useEffect } from 'react';
import './task-assign-dashboard.css';

function TaskAssign() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    disasterId: '',
    volunteerId: '',
    description: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:8083/api/tasks/all')
      .then((res) => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8083/api/tasks/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then((res) => res.text())
    .then(message => {
      alert("✅ " + message);
      setFormData({ disasterId: '', volunteerId: '', description: '' });
      fetchTasks();
    })
    .catch(err => alert("Error network connection."));
  };

  return (
    <div className="ta-layout">
      {/* Header */}
      <header className="ta-header">
         <div className="ta-logo">
            <i className="fas fa-hand-holding-heart"></i> ReliefSync Admin
         </div>
      </header>

      <main className="ta-container">
        <div className="ta-title">
          <h1>📋 Task Assignment Dashboard</h1>
          <p>Assign and monitor volunteer rescue tasks</p>
        </div>
        
        <div className="ta-content-grid">
          {/* Form Section */}
          <div className="ta-form-card">
            <h3><i className="fas fa-plus-circle"></i> Assign New Task</h3>
            <form onSubmit={handleSubmit} className="ta-form">
              <div className="ta-form-group">
                <label>Disaster ID</label>
                <input type="number" name="disasterId" placeholder="e.g. 1" value={formData.disasterId} onChange={handleInputChange} required />
              </div>
              
              <div className="ta-form-group">
                <label>Volunteer ID</label>
                <input type="number" name="volunteerId" placeholder="e.g. 101" value={formData.volunteerId} onChange={handleInputChange} required />
              </div>
              
              <div className="ta-form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Describe the task details..." value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
              </div>
              
              <button type="submit" className="ta-submit-btn">
                Assign Task <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="ta-table-card">
            <h3><i className="fas fa-list-ul"></i> Active Tasks</h3>
            <div className="ta-table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Disaster ID</th>
                    <th>Vol. ID</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan="5" className="ta-empty-state">No tasks found. Fetching from database...</td></tr>
                  ) : (
                    tasks.map(task => (
                      <tr key={task.taskId}>
                        <td><strong>#{task.taskId}</strong></td>
                        <td>#{task.disasterId}</td>
                        <td><span className="ta-vol-id"><i className="fas fa-user"></i> {task.volunteerId}</span></td>
                        <td>{task.description}</td>
                        <td>
                          <span className={`ta-badge ${task.status === 'PENDING' ? 'badge-pending' : 'badge-active'}`}>
                            {task.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TaskAssign;