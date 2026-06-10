import React, { useState, useEffect } from 'react';
import './task-assign-dashboard.css';

function TaskAssign() {
  // 資料狀態
  const [volunteers, setVolunteers] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [tasks, setTasks] = useState([]);

  // 選取狀態
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);  // 陣列，多選
  const [selectedDisasterId, setSelectedDisasterId] = useState('');
  const [description, setDescription] = useState('');

  // 載入狀態與錯誤
  const [loading, setLoading] = useState({ volunteers: true, disasters: true, tasks: true });
  const [error, setError] = useState('');

  // 取得認證 header
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  // 取得所有志工 (經由 Gateway)
  const fetchVolunteers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/volunteers/all', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch volunteers');
      const data = await res.json();
      setVolunteers(data);
    } catch (err) {
      console.error(err);
      setError('無法載立志工列表');
    } finally {
      setLoading(prev => ({ ...prev, volunteers: false }));
    }
  };

  // 取得所有災難
  const fetchDisasters = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/disasters/all', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch disasters');
      const data = await res.json();
      setDisasters(data);
    } catch (err) {
      console.error(err);
      setError('無法載入災難列表');
    } finally {
      setLoading(prev => ({ ...prev, disasters: false }));
    }
  };

  // 取得現有任務 (用於表格)
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/tasks/all', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchDisasters();
    fetchTasks();
  }, []);

  // 處理志工複選框變更
  const handleVolunteerCheck = (volunteerId) => {
    setSelectedVolunteerIds(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  // 處理災難單選
  const handleDisasterSelect = (disasterId) => {
    setSelectedDisasterId(disasterId);
  };

  // 提交批量指派
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVolunteerIds.length === 0) {
      alert('請至少選擇一位志工');
      return;
    }
    if (!selectedDisasterId) {
      alert('請選擇一個災難');
      return;
    }
    if (!description.trim()) {
      alert('請填寫任務描述');
      return;
    }

    const payload = {
      volunteerIds: selectedVolunteerIds,
      disasterId: parseInt(selectedDisasterId),
      description: description.trim()
    };

    try {
      const res = await fetch('http://localhost:8080/api/tasks/assign-batch', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const result = await res.text();
      alert(result);
      // 清空表單並重新載入任務列表
      setSelectedVolunteerIds([]);
      setSelectedDisasterId('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      alert('指派失敗: ' + err.message);
    }
  };

  // 輔助函數：取得志工名稱
  const getVolunteerName = (id) => {
    const vol = volunteers.find(v => v.volunteerId === id);
    return vol ? vol.name : `Volunteer ${id}`;
  };

  // 輔助函數：取得災難地點
  const getDisasterLocation = (id) => {
    const dis = disasters.find(d => d.id === id);
    return dis ? dis.location : `Disaster ${id}`;
  };

  return (
    <div className="ta-layout">
      <header className="ta-header">
        <div className="ta-logo">
          <i className="fas fa-hand-holding-heart"></i> ReliefSync Admin
        </div>
      </header>

      <main className="ta-container">
        <div className="ta-title">
          <h1>📋 Task Assignment Dashboard</h1>
          <p>Select volunteers (multiple) and a disaster, then assign task</p>
        </div>

        {error && <div className="error-message" style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <div className="ta-content-grid" style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
          {/* 左側容器：垂直排列 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 左上：志工列表 */}
            <div className="ta-form-card" style={{ flex: 1 }}>
              <h3><i className="fas fa-users"></i> Select Volunteers (Multiple)</h3>
              {loading.volunteers ? (
                <p>Loading volunteers...</p>
              ) : volunteers.length === 0 ? (
                <p>No volunteers found.</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {volunteers.map(vol => (
                    <div key={vol.volunteerId} style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedVolunteerIds.includes(vol.volunteerId)}
                          onChange={() => handleVolunteerCheck(vol.volunteerId)}
                        />
                        <strong>{vol.name}</strong> <span style={{ fontSize: '12px', color: '#718096' }}>({vol.skill})</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 左下：災難列表 */}
            <div className="ta-form-card" style={{ flex: 1 }}>
              <h3><i className="fas fa-exclamation-triangle"></i> Select Disaster (Single)</h3>
              {loading.disasters ? (
                <p>Loading disasters...</p>
              ) : disasters.length === 0 ? (
                <p>No disasters found.</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {disasters.map(dis => (
                    <div key={dis.id} style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="disaster"
                          value={dis.id}
                          checked={selectedDisasterId === dis.id}
                          onChange={() => handleDisasterSelect(dis.id)}
                        />
                        <strong>{dis.location}</strong> <span style={{ fontSize: '12px', color: '#718096' }}>({dis.disaster_type})</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右側：任務表單 */}
          <div className="ta-form-card" style={{ flex: 1.2 }}>
            <h3><i className="fas fa-pen-alt"></i> Task Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="ta-form-group">
                <label>Description *</label>
                <textarea
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the task (e.g., deliver supplies, rescue operation, medical aid...)"
                  required
                ></textarea>
              </div>
              <div className="ta-form-group" style={{ marginTop: '20px' }}>
                <p><strong>Selected Volunteers:</strong> {selectedVolunteerIds.length > 0 ? selectedVolunteerIds.map(id => getVolunteerName(id)).join(', ') : 'None'}</p>
                <p><strong>Selected Disaster:</strong> {selectedDisasterId ? getDisasterLocation(selectedDisasterId) : 'None'}</p>
              </div>
              <button type="submit" className="ta-submit-btn">
                Assign Task(s) <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        {/* 下方任務表格：顯示已指派的任務 */}
        <div className="ta-table-card" style={{ marginTop: '30px' }}>
          <h3><i className="fas fa-list-ul"></i> Existing Tasks</h3>
          {loading.tasks ? (
            <p>Loading tasks...</p>
          ) : (
            <div className="ta-table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Disaster</th>
                    <th>Volunteer</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan="5" className="ta-empty-state">No tasks found.</td></tr>
                  ) : (
                    tasks.map(task => (
                      <tr key={task.taskId}>
                        <td>#{task.taskId}</td>
                        <td>{getDisasterLocation(task.disasterId)}</td>
                        <td><span className="ta-vol-id">{getVolunteerName(task.volunteerId)}</span></td>
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
          )}
        </div>
      </main>
    </div>
  );
}

export default TaskAssign;