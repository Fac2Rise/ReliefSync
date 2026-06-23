<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Disaster Map Dashboard - Relief Coordinator</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Shared map configuration -->
    <script src="js/disaster-map-config.js"></script>
    <link rel="stylesheet" href="css/adminDashboard.css"/>
</head>
<body>
    <div class="dashboard-header">
        <div class="logo">
            <i class="fas fa-hand-holding-heart"></i> DisasterRelief
        </div>
        <div class="nav-links">
            <a href="dashboard.jsp"><i class="fas fa-map"></i> Dashboard</a>
            <a href="admin-disasters.jsp"><i class="fas fa-table"></i> Disaster Table</a>
            <a href="report-disaster.jsp"><i class="fas fa-plus"></i> Report</a>
            <a href="logout.jsp"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="stats-bar" id="statsBar">
        <div class="stat-card">
            <div class="stat-number" id="totalIncidents">0</div>
            <div>Total Incidents</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="activeIncidents">0</div>
            <div>Active</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="criticalIncidents">0</div>
            <div>Critical</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="resolvedIncidents">0</div>
            <div>Resolved</div>
        </div>
    </div>
    
    <div class="map-wrapper">
        <div class="map-container" id="mapContainer">
            <div id="disasterMap"></div>
            <button class="refresh-btn" onclick="refreshMap()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <div class="map-legend">
                <h4>Status Legend</h4>
                <div class="legend-item">
                    <div class="legend-color red"></div>
                    <span>Active / Critical</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color blue"></div>
                    <span>Resolved / Recovered</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color green"></div>
                    <span>Fatalities / Critical</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        let dashboardMap;
        let allIncidents = [];
        let currentMarkers = [];
        
        const contextPath = "${pageContext.request.contextPath}";
        const servletUrl = contextPath + "/DisasterMapServlet";
        
        // Initialize map using shared configuration
        dashboardMap = initMalaysiaMap('disasterMap', {
            zoomControl: true,
            scrollWheelZoom: true
        });
        
        // Clear all markers
        function clearMarkers() {
            currentMarkers.forEach(marker => {
                if (dashboardMap && marker) {
                    dashboardMap.removeLayer(marker);
                }
            });
            currentMarkers = [];
        }
        
        // Update statistics
        function updateStats(incidents) {
            const total = incidents.length;
            const active = incidents.filter(i => i.status === 'ACTIVE').length;
            const critical = incidents.filter(i => i.status === 'CRITICAL').length;
            const resolved = incidents.filter(i => i.status === 'RECOVERED' || i.status === 'RESOLVED').length;
            
            document.getElementById('totalIncidents').innerText = total;
            document.getElementById('activeIncidents').innerText = active;
            document.getElementById('criticalIncidents').innerText = critical;
            document.getElementById('resolvedIncidents').innerText = resolved;
        }
        
        // Load and display incidents using shared function
        async function loadIncidentsToMap() {
            try {
                const incidents = await loadIncidents(servletUrl);
                allIncidents = incidents;
                
                updateStats(incidents);
                clearMarkers();
                
                incidents.forEach(incident => {
                    const marker = addDisasterMarker(dashboardMap, incident, true);
                    currentMarkers.push(marker);
                });
                
                // Fit bounds to show all markers
                if (currentMarkers.length > 0) {
                    const bounds = L.latLngBounds(currentMarkers.map(m => m.getLatLng()));
                    dashboardMap.fitBounds(bounds.pad(0.1));
                }
                
                console.log(`Loaded ${incidents.length} incidents`);
            } catch (error) {
                console.error('Error loading incidents:', error);
            }
        }
        
        function refreshMap() {
            loadIncidentsToMap();
        }
        
        // Auto-refresh every 30 seconds
        loadIncidentsToMap();
        setInterval(refreshMap, 30000);
    </script>
</body>
</html>