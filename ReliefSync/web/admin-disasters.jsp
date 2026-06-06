<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.util.List"%>
<%@page import="model.Disaster"%>
<%@page import="dao.DisasterDao"%>
<%
    // Check if admin is logged in
    String role = (String) session.getAttribute("role");
    if (role == null || !role.equals("admin")) {
        response.sendRedirect("login.jsp?error=unauthorized");
        return;
    }
    
    // Get all disasters
    DisasterDao disasterDao = new DisasterDao();
    List<Disaster> disasters = disasterDao.getAllDisasters();
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Disaster Management</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="css/admin-disasters.css"/>
</head>
<body>
    <div class="admin-header">
        <div class="logo">
            <i class="fas fa-hand-holding-heart"></i> DisasterRelief
        </div>
        <div>
            <span class="admin-badge"><i class="fas fa-user-shield"></i> Admin Panel</span>
        </div>
        <div class="nav-links">
            <a href="dashboard.jsp"><i class="fas fa-map"></i> Dashboard</a>
            <a href="admin-disasters.jsp"><i class="fas fa-home"></i> Disaster Table</a>
            <a href="report-disaster.jsp"><i class="fas fa-plus"></i> Report</a>
            <a href="logout.jsp"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container" id="statsContainer">
        <div class="stat-card">
            <div class="stat-icon total"><i class="fas fa-chart-line"></i></div>
            <div class="stat-info">
                <h3 id="totalCount">0</h3>
                <p>Total Disasters</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="stat-info">
                <h3 id="activeCount">0</h3>
                <p>Active</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon critical"><i class="fas fa-skull-crossbones"></i></div>
            <div class="stat-info">
                <h3 id="criticalCount">0</h3>
                <p>Critical</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon resolved"><i class="fas fa-check-circle"></i></div>
            <div class="stat-info">
                <h3 id="resolvedCount">0</h3>
                <p>Resolved</p>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters-container">
        <div class="filter-group">
            <label>Status:</label>
            <select id="statusFilter">
                <option value="all">All</option>
                <option value="ACTIVE">Active</option>
                <option value="CRITICAL">Critical</option>
                <option value="RESOLVED">Resolved</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Type:</label>
            <select id="typeFilter">
                <option value="all">All</option>
                <option value="flood">Flood</option>
                <option value="earthquake">Earthquake</option>
                <option value="wildfire">Wildfire</option>
                <option value="landslide">Landslide</option>
                <option value="hurricane">Hurricane</option>
            </select>
        </div>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search by location...">
            <button class="btn-filter" onclick="applyFilters()"><i class="fas fa-search"></i> Filter</button>
            <button class="btn-filter" onclick="resetFilters()" style="background: var(--gray-600);"><i class="fas fa-undo"></i> Reset</button>
        </div>
    </div>

    <!-- Table -->
    <div class="table-container">
        <div class="table-header">
            <h2><i class="fas fa-list"></i> Disaster Incidents</h2>
            <button class="btn-add" onclick="window.location.href='report-disaster.jsp'">
                <i class="fas fa-plus"></i> Add New Disaster
            </button>
        </div>
        
        <table id="disasterTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Age Group</th>
                    <th>Reported</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- Data will be loaded via JavaScript -->
            </tbody>
        </table>
    </div>

    <!-- View Modal -->
    <div id="viewModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> Disaster Details</h3>
                <button class="modal-close" onclick="closeViewModal()">&times;</button>
            </div>
            <div class="modal-body" id="viewModalBody">
                <!-- Content loaded dynamically -->
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeViewModal()">Close</button>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Disaster</h3>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editForm">
                    <input type="hidden" id="editId">
                    <div class="form-group">
                        <label>Location *</label>
                        <input type="text" id="editLocation" required>
                    </div>
                    <div class="form-group">
                        <label>Disaster Type *</label>
                        <select id="editType">
                            <option value="flood">Flood</option>
                            <option value="earthquake">Earthquake</option>
                            <option value="wildfire">Wildfire</option>
                            <option value="landslide">Landslide</option>
                            <option value="hurricane">Hurricane</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex:1">
                            <label>Latitude *</label>
                            <input type="number" step="any" id="editLatitude" required>
                        </div>
                        <div class="form-group" style="flex:1">
                            <label>Longitude *</label>
                            <input type="number" step="any" id="editLongitude" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select id="editStatus">
                            <option value="ACTIVE">Active</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Age Group</label>
                        <select id="editAgeGroup">
                            <option value="<18">&lt;18</option>
                            <option value="18-29">18-29</option>
                            <option value="30-39">30-39</option>
                            <option value="40-49">40-49</option>
                            <option value="50-59">50-59</option>
                            <option value="60-69">60-69</option>
                            <option value="70+">70+</option>
                        </select>
                    </div>
                    <div id="editMapPreview" class="map-preview"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeEditModal()">Cancel</button>
                <button class="btn-save" onclick="saveEdit()">Save Changes</button>
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-trash-alt"></i> Delete Disaster</h3>
                <button class="modal-close" onclick="closeDeleteModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="delete-warning">
                    <i class="fas fa-exclamation-triangle"></i> Warning: This action cannot be undone!
                </div>
                <p>Are you sure you want to delete this disaster report?</p>
                <p id="deleteInfo" style="margin-top: 10px; color: var(--purple-primary);"></p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeDeleteModal()">Cancel</button>
                <button class="btn-save" onclick="confirmDelete()" style="background: var(--error);">Delete Permanently</button>
            </div>
        </div>
    </div>

    <!-- Add Modal -->
    <div id="addModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Add New Disaster</h3>
                <button class="modal-close" onclick="closeAddModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addForm">
                    <div class="form-group">
                        <label>Location *</label>
                        <input type="text" id="addLocation" required>
                    </div>
                    <div class="form-group">
                        <label>Disaster Type *</label>
                        <select id="addType">
                            <option value="flood">Flood</option>
                            <option value="earthquake">Earthquake</option>
                            <option value="wildfire">Wildfire</option>
                            <option value="landslide">Landslide</option>
                            <option value="hurricane">Hurricane</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex:1">
                            <label>Latitude *</label>
                            <input type="number" step="any" id="addLatitude" required>
                        </div>
                        <div class="form-group" style="flex:1">
                            <label>Longitude *</label>
                            <input type="number" step="any" id="addLongitude" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select id="addStatus">
                            <option value="ACTIVE">Active</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Age Group</label>
                        <select id="addAgeGroup">
                            <option value="<18">&lt;18</option>
                            <option value="18-29">18-29</option>
                            <option value="30-39">30-39</option>
                            <option value="40-49">40-49</option>
                            <option value="50-59">50-59</option>
                            <option value="60-69">60-69</option>
                            <option value="70+">70+</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeAddModal()">Cancel</button>
                <button class="btn-save" onclick="saveAdd()">Add Disaster</button>
            </div>
        </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toastMessage"></span>
    </div>

    <script>
        let allDisasters = [];
        let editMap = null;
        
        // Load disasters from API
        async function loadDisasters() {
            try {
                const response = await fetch('${pageContext.request.contextPath}/DisasterMapServlet');
                allDisasters = await response.json();
                applyFilters();
                updateStats();
            } catch (error) {
                console.error('Error loading disasters:', error);
                showToast('Error loading disasters', 'error');
            }
        }
        
        // Update statistics
        function updateStats() {
            const total = allDisasters.length;
            const active = allDisasters.filter(d => d.status === 'ACTIVE').length;
            const critical = allDisasters.filter(d => d.status === 'CRITICAL').length;
            const resolved = allDisasters.filter(d => d.status === 'RESOLVED').length;
            
            document.getElementById('totalCount').innerText = total;
            document.getElementById('activeCount').innerText = active;
            document.getElementById('criticalCount').innerText = critical;
            document.getElementById('resolvedCount').innerText = resolved;
        }
        
        // Apply filters
        function applyFilters() {
            const statusFilter = document.getElementById('statusFilter').value;
            const typeFilter = document.getElementById('typeFilter').value;
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            let filtered = [...allDisasters];
            
            if (statusFilter !== 'all') {
                filtered = filtered.filter(d => d.status === statusFilter);
            }
            if (typeFilter !== 'all') {
                filtered = filtered.filter(d => d.disasterType === typeFilter);
            }
            if (searchTerm) {
                filtered = filtered.filter(d => d.location.toLowerCase().includes(searchTerm));
            }
            
            renderTable(filtered);
        }
        
        // Render table
        function renderTable(disasters) {
            const tbody = document.getElementById('tableBody');
            
            if (disasters.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No disasters found</td></tr>';
                return;
            }
            
            tbody.innerHTML = disasters.map(d => `
                <tr>
                    <td>${d.id}</td>
                    <td><i class="fas fa-map-marker-alt" style="color:var(--purple-primary);"></i> ${d.location}</td>
                    <td>${getDisasterIcon(d.disasterType)} ${d.disasterType}</td>
                    <td><span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span></td>
                    <td>${d.ageGroup || 'N/A'}</td>
                    <td>${formatDate(d.timestamp)}</td>
                    <td class="action-buttons">
                        <button class="btn-view" onclick="viewDisaster(${d.id})"><i class="fas fa-eye"></i> View</button>
                        <button class="btn-edit" onclick="openEditModal(${d.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-delete" onclick="openDeleteModal(${d.id})"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
            `).join('');
        }
        
        function getDisasterIcon(type) {
            const icons = {
                flood: '🌊',
                earthquake: '🌍',
                wildfire: '🔥',
                landslide: '⛰️',
                hurricane: '🌀'
            };
            return icons[type] || '❗';
        }
        
        function formatDate(timestamp) {
            if (!timestamp) return 'N/A';
            return new Date(timestamp).toLocaleString();
        }
        
        function resetFilters() {
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('typeFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            applyFilters();
        }
        
        // View disaster
        function viewDisaster(id) {
            const disaster = allDisasters.find(d => d.id === id);
            if (!disaster) return;
            
            const modalBody = document.getElementById('viewModalBody');
            modalBody.innerHTML = `
                <div class="form-group">
                    <label><strong>Location:</strong></label>
                    <p>${disaster.location}</p>
                </div>
                <div class="form-group">
                    <label><strong>Disaster Type:</strong></label>
                    <p>${getDisasterIcon(disaster.disasterType)} ${disaster.disasterType}</p>
                </div>
                <div class="form-group">
                    <label><strong>Status:</strong></label>
                    <p><span class="status-badge status-${disaster.status.toLowerCase()}">${disaster.status}</span></p>
                </div>
                <div class="form-group">
                    <label><strong>Coordinates:</strong></label>
                    <p>${disaster.latitude}, ${disaster.longitude}</p>
                </div>
                <div class="form-group">
                    <label><strong>Age Group Affected:</strong></label>
                    <p>${disaster.ageGroup || 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label><strong>Reported At:</strong></label>
                    <p>${formatDate(disaster.timestamp)}</p>
                </div>
                <div id="viewMap" class="map-preview"></div>
            `;
            
            document.getElementById('viewModal').style.display = 'flex';
            
            // Initialize map in modal
            setTimeout(() => {
                const viewMap = L.map('viewMap').setView([disaster.latitude, disaster.longitude], 12);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OSM, © CARTO'
                }).addTo(viewMap);
                L.marker([disaster.latitude, disaster.longitude]).addTo(viewMap);
            }, 100);
        }
        
        function closeViewModal() {
            document.getElementById('viewModal').style.display = 'none';
        }
        
        // Open edit modal
        function openEditModal(id) {
            const disaster = allDisasters.find(d => d.id === id);
            if (!disaster) return;
            
            document.getElementById('editId').value = disaster.id;
            document.getElementById('editLocation').value = disaster.location;
            document.getElementById('editType').value = disaster.disasterType;
            document.getElementById('editLatitude').value = disaster.latitude;
            document.getElementById('editLongitude').value = disaster.longitude;
            document.getElementById('editStatus').value = disaster.status;
            document.getElementById('editAgeGroup').value = disaster.ageGroup || '<18';
            
            document.getElementById('editModal').style.display = 'flex';
            
            // Initialize map in edit modal
            setTimeout(() => {
                if (editMap) editMap.remove();
                editMap = L.map('editMapPreview').setView([disaster.latitude, disaster.longitude], 12);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OSM, © CARTO'
                }).addTo(editMap);
                L.marker([disaster.latitude, disaster.longitude]).addTo(editMap);
                
                // Update marker when coordinates change
                document.getElementById('editLatitude').addEventListener('change', updateEditMap);
                document.getElementById('editLongitude').addEventListener('change', updateEditMap);
            }, 100);
        }
        
        function updateEditMap() {
            const lat = parseFloat(document.getElementById('editLatitude').value);
            const lng = parseFloat(document.getElementById('editLongitude').value);
            if (!isNaN(lat) && !isNaN(lng) && editMap) {
                editMap.setView([lat, lng], 12);
                editMap.eachLayer(layer => {
                    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                        editMap.removeLayer(layer);
                    }
                });
                L.marker([lat, lng]).addTo(editMap);
            }
        }
        
        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }
        
        // Save edit
        async function saveEdit() {
            const id = document.getElementById('editId').value;
            const updatedDisaster = {
                id: parseInt(id),
                location: document.getElementById('editLocation').value,
                disasterType: document.getElementById('editType').value,
                latitude: parseFloat(document.getElementById('editLatitude').value),
                longitude: parseFloat(document.getElementById('editLongitude').value),
                status: document.getElementById('editStatus').value,
                ageGroup: document.getElementById('editAgeGroup').value
            };
            
            try {
                const response = await fetch('${pageContext.request.contextPath}/UpdateDisasterServlet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedDisaster)
                });
                
                if (response.ok) {
                    showToast('Disaster updated successfully', 'success');
                    closeEditModal();
                    loadDisasters();
                } else {
                    showToast('Error updating disaster', 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        // Delete modal
        let deleteId = null;
        function openDeleteModal(id) {
            const disaster = allDisasters.find(d => d.id === id);
            deleteId = id;
            document.getElementById('deleteInfo').innerHTML = `<strong>${disaster.location}</strong> (${disaster.disasterType})`;
            document.getElementById('deleteModal').style.display = 'flex';
        }
        
        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
            deleteId = null;
        }
        
        async function confirmDelete() {
            if (!deleteId) return;
            
            try {
                const response = await fetch('${pageContext.request.contextPath}/DeleteDisasterServlet?id=' + deleteId, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToast('Disaster deleted successfully', 'success');
                    closeDeleteModal();
                    loadDisasters();
                } else {
                    showToast('Error deleting disaster', 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        // Add disaster
        function openAddModal() {
            document.getElementById('addModal').style.display = 'flex';
        }
        
        function closeAddModal() {
            document.getElementById('addModal').style.display = 'none';
        }
        
        async function saveAdd() {
            const newDisaster = {
                location: document.getElementById('addLocation').value,
                disasterType: document.getElementById('addType').value,
                latitude: parseFloat(document.getElementById('addLatitude').value),
                longitude: parseFloat(document.getElementById('addLongitude').value),
                status: document.getElementById('addStatus').value,
                ageGroup: document.getElementById('addAgeGroup').value
            };
            
            try {
                const response = await fetch('${pageContext.request.contextPath}/AddDisasterServlet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDisaster)
                });
                
                if (response.ok) {
                    showToast('Disaster added successfully', 'success');
                    closeAddModal();
                    loadDisasters();
                    document.getElementById('addForm').reset();
                } else {
                    showToast('Error adding disaster', 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        function showToast(message, type) {
            const toast = document.getElementById('toast');
            toast.className = `toast ${type}`;
            document.getElementById('toastMessage').innerText = message;
            toast.style.display = 'flex';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
        
        // Close modals when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
        
        // Load data on page load
        loadDisasters();
    </script>
</body>
</html>