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
    <link rel="stylesheet" href="css/admin-disasters.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
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
            <select id="statusFilter" onchange="applyFilters()">
                <option value="all">All</option>
                <option value="ACTIVE">Active</option>
                <option value="CRITICAL">Critical</option>
                <option value="RESOLVED">Resolved</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Type:</label>
            <select id="typeFilter" onchange="applyFilters()">
                <option value="all">All</option>
                <option value="flood">Flood</option>
                <option value="earthquake">Earthquake</option>
                <option value="wildfire">Wildfire</option>
                <option value="landslide">Landslide</option>
                <option value="hurricane">Hurricane</option>
            </select>
        </div>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search by location..." onkeyup="applyFilters()">
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
                <tr><td colspan="7" style="text-align:center;">Loading disasters...</td></tr>
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

    <!-- Toast -->
    <div id="toast" class="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toastMessage"></span>
    </div>

    <script src="js/admin-disasters.js"></script> 
</body>
</html>