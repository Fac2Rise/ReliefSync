import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './admin-disasters.css';

// 修復 Leaflet 預設圖示
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 馬來西亞地圖邊界 (與 JSP 一致)
const malaysiaBounds = [[0.85, 99.5], [7.5, 119.5]];
const malaysiaCenter = [4.2105, 101.9758];

// 地圖點擊元件 (獲取座標)
function LocationPicker({ onLocationSelect, initialPosition }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        }
    });
    // 若有初始位置，移動視圖
    useEffect(() => {
        if (initialPosition && map) {
            map.setView(initialPosition, 12);
        }
    }, [initialPosition, map]);
    return null;
}

const AdminDisasters = () => {
    const navigate = useNavigate();

    // --- State ---
    const [disasters, setDisasters] = useState([]);
    const [filteredDisasters, setFilteredDisasters] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, critical: 0, resolved: 0 });
    const [filters, setFilters] = useState({ status: 'all', type: 'all', search: '' });
    const [modals, setModals] = useState({ view: false, edit: false, delete: false, add: false });
    const [currentDisaster, setCurrentDisaster] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    // 擴充表單欄位 (與 JSP 對應)
    const initialFormState = {
        location: '',
        disaster_type: 'flood',
        latitude: '',
        longitude: '',
        status: 'ACTIVE',
        age_group: '',               // 年齡層字串
        description: '',             // 事件描述
        estimated_people: '',        // 受影響人數
        affected_homes: '',          // 房屋損壞數
        reporter_name: '',           // 回報者姓名
        reporter_phone: '',          // 電話
        reporter_org: ''             // 組織
    };
    const [formData, setFormData] = useState(initialFormState);
    const [selectedPosition, setSelectedPosition] = useState(null); // { lat, lng }

    // --- API 相關函數 (保持原樣) ---
    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    });

    const loadDisasters = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/disasters/all', {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setDisasters(data);
            } else if (response.status === 401) {
                navigate('/login');
            }
        } catch (error) {
            showToast('Error loading disasters', 'error');
        }
    };

    useEffect(() => {
        loadDisasters();
    }, []);

    useEffect(() => {
        let result = [...disasters];
        if (filters.status !== 'all') result = result.filter(d => d.status === filters.status);
        if (filters.type !== 'all') result = result.filter(d => d.disaster_type === filters.type);
        if (filters.search) result = result.filter(d => d.location.toLowerCase().includes(filters.search.toLowerCase()));

        setFilteredDisasters(result);
        setStats({
            total: disasters.length,
            active: disasters.filter(d => d.status === 'ACTIVE').length,
            critical: disasters.filter(d => d.status === 'CRITICAL').length,
            resolved: disasters.filter(d => ['RESOLVED', 'RECOVERED'].includes(d.status)).length
        });
    }, [disasters, filters]);

    // --- 其他處理函數 ---
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({ status: 'all', type: 'all', search: '' });
    };

    const showToast = (message, type) => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: '' }), 3000);
    };

    // CRUD
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        // 檢查地圖是否已點選
        if (!formData.latitude || !formData.longitude) {
            showToast('Please click on the map to select the disaster location!', 'error');
            return;
        }
        try {
            const payload = { ...formData };
            // 確保數值欄位為數字
            payload.latitude = parseFloat(payload.latitude);
            payload.longitude = parseFloat(payload.longitude);
            payload.estimated_people = payload.estimated_people ? parseInt(payload.estimated_people) : null;
            payload.affected_homes = payload.affected_homes ? parseInt(payload.affected_homes) : null;

            const res = await fetch('http://localhost:8080/api/disasters/add', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showToast('Disaster added successfully', 'success');
                setModals({ ...modals, add: false });
                loadDisasters();
                resetFormData();
            } else {
                const errorText = await res.text();
                showToast(`Error: ${res.status} - ${errorText}`, 'error');
            }
        } catch (err) {
            showToast('Error adding disaster', 'error');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const statusValue = formData.status;
            const res = await fetch(`http://localhost:8080/api/disasters/update-status/${currentDisaster.id}?status=${statusValue}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Disaster updated successfully', 'success');
                setModals({ ...modals, edit: false });
                loadDisasters();
            } else {
                showToast('Failed to update disaster', 'error');
            }
        } catch (err) {
            showToast('Error updating disaster', 'error');
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/disasters/delete/${currentDisaster.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Disaster deleted successfully', 'success');
                setModals({ ...modals, delete: false });
                loadDisasters();
            }
        } catch (err) {
            showToast('Error deleting disaster', 'error');
        }
    };

    // 輔助函數
    const getDisasterIcon = (type) => {
        const icons = { flood: '🌊', earthquake: '🌍', wildfire: '🔥', landslide: '⛰️', hurricane: '🌀' };
        return icons[type?.toLowerCase()] || '❗';
    };

    const resetFormData = () => {
        setFormData(initialFormState);
        setSelectedPosition(null);
    };

    const openModal = (type, disaster = null) => {
        setCurrentDisaster(disaster);
        if (type === 'edit') {
            // 編輯模式載入現有資料 (包括新欄位，若後端有回傳)
            setFormData({
                location: disaster.location || '',
                disaster_type: disaster.disaster_type || 'flood',
                latitude: disaster.latitude || '',
                longitude: disaster.longitude || '',
                status: disaster.status || 'ACTIVE',
                age_group: disaster.age_group || '',
                description: disaster.description || '',
                estimated_people: disaster.estimated_people || '',
                affected_homes: disaster.affected_homes || '',
                reporter_name: disaster.reporter_name || '',
                reporter_phone: disaster.reporter_phone || '',
                reporter_org: disaster.reporter_org || ''
            });
            setSelectedPosition(disaster.latitude && disaster.longitude ? { lat: disaster.latitude, lng: disaster.longitude } : null);
        } else if (type === 'add') {
            resetFormData();
        }
        setModals({ ...modals, [type]: true });
    };

    // 地圖點擊處理
    const handleMapClick = (latlng) => {
        const { lat, lng } = latlng;
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        setSelectedPosition({ lat, lng });
        // 可選：使用 reverse geocoding 自動填入地點名稱
        if (!formData.location) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
                .then(res => res.json())
                .then(data => {
                    if (data.display_name) {
                        setFormData(prev => ({ ...prev, location: data.display_name.substring(0, 100) }));
                    }
                })
                .catch(err => console.log('Reverse geocoding error:', err));
        }
    };

    // 使用目前位置
    const useMyLocation = () => {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                handleMapClick({ lat, lng });
            },
            (error) => {
                let msg = "Could not get your location: ";
                switch(error.code) {
                    case error.PERMISSION_DENIED: msg += "Please allow location access."; break;
                    case error.POSITION_UNAVAILABLE: msg += "Location information unavailable."; break;
                    case error.TIMEOUT: msg += "Request timed out."; break;
                    default: msg += "Unknown error.";
                }
                showToast(msg, 'error');
            }
        );
    };

    return (
        <div style={{ width: '100%', maxWidth: '100%' }}>
            <h2 style={{ color: '#2d3748', fontSize: '24px', fontWeight: '700' }}>📋 Manage Disasters</h2>
            <p style={{ color: '#666' }}>View all registered disasters and manage their statuses.</p>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon total"><i className="fas fa-chart-line"></i></div>
                    <div className="stat-info"><h3>{stats.total}</h3><p>Total Disasters</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon active"><i className="fas fa-exclamation-triangle"></i></div>
                    <div className="stat-info"><h3>{stats.active}</h3><p>Active</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon critical"><i className="fas fa-skull-crossbones"></i></div>
                    <div className="stat-info"><h3>{stats.critical}</h3><p>Critical</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon resolved"><i className="fas fa-check-circle"></i></div>
                    <div className="stat-info"><h3>{stats.resolved}</h3><p>Resolved</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-container">
                <div className="filter-group">
                    <label>Status:</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Type:</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="flood">Flood</option>
                        <option value="earthquake">Earthquake</option>
                        <option value="wildfire">Wildfire</option>
                        <option value="landslide">Landslide</option>
                        <option value="hurricane">Hurricane</option>
                    </select>
                </div>
                <div className="search-box">
                    <input type="text" name="search" placeholder="Search by location..." value={filters.search} onChange={handleFilterChange} />
                    <button className="btn-filter" onClick={resetFilters} style={{ background: 'var(--gray-600)' }}><i className="fas fa-undo"></i> Reset</button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2><i className="fas fa-list"></i> Disaster Incidents</h2>
                    <button className="btn-add" onClick={() => openModal('add')}>
                        <i className="fas fa-plus"></i> Add New Disaster
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Location</th><th>Type</th><th>Status</th><th>Age Group</th><th>Reported</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDisasters.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No disasters found</td></tr>
                        ) : (
                            filteredDisasters.map(d => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td><i className="fas fa-map-marker-alt" style={{ color: 'var(--purple-primary)' }}></i> {d.location}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{getDisasterIcon(d.disaster_type)} {d.disaster_type}</td>
                                    <td><span className={`status-badge status-${d.status.toLowerCase()}`}>{d.status}</span></td>
                                    <td>{d.age_group || 'N/A'}</td>
                                    <td>{d.reportedAt ? new Date(d.reportedAt).toLocaleString() : 'No date'}</td>
                                    <td className="action-buttons">
                                        <button className="btn-view" onClick={() => openModal('view', d)}><i className="fas fa-eye"></i> View</button>
                                        <button className="btn-edit" onClick={() => openModal('edit', d)}><i className="fas fa-edit"></i> Edit</button>
                                        <button className="btn-delete" onClick={() => openModal('delete', d)}><i className="fas fa-trash"></i> Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {modals.view && currentDisaster && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3><i className="fas fa-info-circle"></i> Disaster Details</h3>
                            <button className="modal-close" onClick={() => setModals({ ...modals, view: false })}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Location:</strong> {currentDisaster.location}</p>
                            <p><strong>Type:</strong> {getDisasterIcon(currentDisaster.disaster_type)} {currentDisaster.disaster_type}</p>
                            <p><strong>Status:</strong> <span className={`status-badge status-${currentDisaster.status.toLowerCase()}`}>{currentDisaster.status}</span></p>
                            <p><strong>Coordinates:</strong> {currentDisaster.latitude}, {currentDisaster.longitude}</p>

                            {/* React-Leaflet Map inside View Modal */}
                            <div className="map-preview" style={{ height: '250px', marginTop: '15px' }}>
                                <MapContainer center={[currentDisaster.latitude, currentDisaster.longitude]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                    <Marker position={[currentDisaster.latitude, currentDisaster.longitude]} />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal (已改為地圖選點 + 完整欄位) */}
            {(modals.add || modals.edit) && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3><i className={`fas ${modals.add ? 'fa-plus-circle' : 'fa-edit'}`}></i> {modals.add ? 'Add New' : 'Edit'} Disaster</h3>
                            <button className="modal-close" onClick={() => setModals({ ...modals, add: false, edit: false })}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={modals.add ? handleAddSubmit : handleEditSubmit}>
                                {/* 災害基本資訊 */}
                                <div className="form-group">
                                    <label>Location Name *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleFormChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Disaster Type *</label>
                                    <select name="disaster_type" value={formData.disaster_type} onChange={handleFormChange}>
                                        <option value="flood">🌊 Flood</option>
                                        <option value="earthquake">🌍 Earthquake</option>
                                        <option value="wildfire">🔥 Wildfire</option>
                                        <option value="hurricane">🌀 Hurricane</option>
                                        <option value="landslide">⛰️ Landslide</option>
                                        <option value="tsunami">🌊 Tsunami</option>
                                        <option value="other">❗ Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" rows="3" value={formData.description} onChange={handleFormChange} placeholder="Describe the situation, affected areas, immediate needs..."></textarea>
                                </div>

                                {/* 受影響人口 */}
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Estimated People Affected</label>
                                        <input type="number" name="estimated_people" value={formData.estimated_people} onChange={handleFormChange} placeholder="Number of people" />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Homes Destroyed/Damaged</label>
                                        <input type="number" name="affected_homes" value={formData.affected_homes} onChange={handleFormChange} placeholder="Number of homes" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Age Group Most Affected</label>
                                    <select name="age_group" value={formData.age_group} onChange={handleFormChange}>
                                        <option value="">Select age group</option>
                                        <option value="<18">&lt;18</option>
                                        <option value="18-29">18-29</option>
                                        <option value="30-39">30-39</option>
                                        <option value="40-49">40-49</option>
                                        <option value="50-59">50-59</option>
                                        <option value="60-69">60-69</option>
                                        <option value="70+">70+</option>
                                    </select>
                                </div>

                                {/* 地圖選點 */}
                                <div className="form-group highlight">
                                    <label>Location on Map *</label>
                                    <p className="help-text" style={{ fontSize: '12px', color: '#718096' }}>📍 Click anywhere on the map to mark the disaster location</p>
                                    <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
                                        <MapContainer
                                            center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : malaysiaCenter}
                                            zoom={selectedPosition ? 12 : 7}
                                            style={{ height: '100%', width: '100%' }}
                                            bounds={malaysiaBounds}
                                            maxBounds={malaysiaBounds}
                                            scrollWheelZoom={true}
                                        >
                                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                            {selectedPosition && <Marker position={[selectedPosition.lat, selectedPosition.lng]} />}
                                            <LocationPicker onLocationSelect={handleMapClick} initialPosition={selectedPosition} />
                                        </MapContainer>
                                    </div>
                                    <div className="coordinates-display" style={{ background: '#f3e8ff', padding: '8px', borderRadius: '8px', marginBottom: '10px' }}>
                                        {formData.latitude && formData.longitude ? (
                                            <><i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> ✅ Location selected! <strong>Lat:</strong> {formData.latitude} | <strong>Lng:</strong> {formData.longitude}</>
                                        ) : (
                                            <><i className="fas fa-info-circle"></i> No location selected. Click on the map above.</>
                                        )}
                                    </div>
                                    <button type="button" className="current-location-btn" onClick={useMyLocation} style={{ background: 'var(--purple-primary)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                                        <i className="fas fa-location-dot"></i> Use My Current Location
                                    </button>
                                </div>

                                {/* 回報者資訊 */}
                                <div style={{ marginTop: '20px' }}>
                                    <h4 style={{ marginBottom: '10px' }}><i className="fas fa-user"></i> Reporter Information</h4>
                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Your Name *</label>
                                            <input type="text" name="reporter_name" value={formData.reporter_name} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Phone Number</label>
                                            <input type="tel" name="reporter_phone" value={formData.reporter_phone} onChange={handleFormChange} placeholder="For follow-up" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Organization/Agency</label>
                                        <input type="text" name="reporter_org" value={formData.reporter_org} onChange={handleFormChange} placeholder="e.g., Red Cross, Local Government, Volunteer" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Status *</label>
                                    <select name="status" value={formData.status} onChange={handleFormChange}>
                                        <option value="ACTIVE">Active</option>
                                        <option value="CRITICAL">Critical</option>
                                        <option value="RESOLVED">Resolved</option>
                                    </select>
                                </div>

                                <div className="modal-footer" style={{ marginTop: '20px' }}>
                                    <button type="button" className="btn-cancel" onClick={() => setModals({ ...modals, add: false, edit: false })}>Cancel</button>
                                    <button type="submit" className="btn-save">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {modals.delete && currentDisaster && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3><i className="fas fa-trash-alt"></i> Delete Disaster</h3>
                        </div>
                        <div className="modal-body">
                            <div className="delete-warning">Warning: This action cannot be undone!</div>
                            <p>Are you sure you want to delete <strong>{currentDisaster.location}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setModals({ ...modals, delete: false })}>Cancel</button>
                            <button className="btn-save" style={{ background: 'var(--error)' }} onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div className={`toast ${toast.type}`} style={{ display: 'flex' }}>
                    <i className={toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default AdminDisasters;