import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 移除了未使用的 Link
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './adminDashboard.css'; // 依然引入你原来的地图样式

// 修复 React-Leaflet 默认图标加载丢失的问题
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

// 为不同的灾难状态创建自定义颜色的图标
const createCustomIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
};

const icons = {
    ACTIVE: createCustomIcon('red'),
    CRITICAL: createCustomIcon('red'),
    RESOLVED: createCustomIcon('blue'),
    RECOVERED: createCustomIcon('blue'),
    FATALITIES: createCustomIcon('green')
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, critical: 0, resolved: 0 });

    // 从 Spring Boot (Disaster Module) 获取数据
    const loadIncidents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/disasters/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIncidents(data);
                
                setStats({
                    total: data.length,
                    active: data.filter(i => i.status === 'ACTIVE').length,
                    critical: data.filter(i => i.status === 'CRITICAL').length,
                    resolved: data.filter(i => i.status === 'RECOVERED' || i.status === 'RESOLVED').length
                });
            } else if (response.status === 401) {
                // 如果在主页发现 Token 失效，依然可以通过 layout 引导至登录
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching incidents:', error);
        }
    };

    useEffect(() => {
        loadIncidents();
        const interval = setInterval(loadIncidents, 30000); 
        return () => clearInterval(interval); 
    }, []);

    return (
        // 🚨 这里的最外层去掉了 dashboard-layout，直接用一个纯内容容器包裹
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#2d3748', fontSize: '24px', fontWeight: '700' }}>Summary Dashboard</h2>
            
            {/* 1. 统计卡片区 */}
            <div className="stats-bar">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div>Total Incidents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.active}</div>
                    <div>Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.critical}</div>
                    <div>Critical</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.resolved}</div>
                    <div>Resolved</div>
                </div>
            </div>
            
            {/* 2. 地图区 */}
            <div className="map-wrapper" style={{ marginTop: '20px' }}>
                <div className="map-container">
                    
                    <MapContainer 
                        center={[4.2105, 101.9758]} 
                        zoom={6} 
                        style={{ height: '550px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        
                        {incidents.map(incident => (
                            <Marker 
                                key={incident.id} 
                                position={[incident.latitude, incident.longitude]}
                                icon={icons[incident.status] || DefaultIcon}
                            >
                                <Popup>
                                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#6B46C1' }}>{incident.location}</h3>
                                        <p style={{ margin: '3px 0' }}><strong>Type:</strong> {incident.disaster_type}</p>
                                        <p style={{ margin: '3px 0' }}><strong>Status:</strong> {incident.status}</p>
                                        <p style={{ margin: '3px 0' }}><strong>Age Group:</strong> {incident.age_group}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <button className="refresh-btn" onClick={loadIncidents}>
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>

                    <div className="map-legend">
                        <h4 style={{ marginBottom: '10px' }}>Status Legend</h4>
                        <div className="legend-item">
                            <div className="legend-color red"></div>
                            <span>Active / Critical</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color blue"></div>
                            <span>Resolved / Recovered</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color green"></div>
                            <span>Fatalities</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Dashboard;