let allDisasters = [];
let editMap = null;

// Load disasters from API
async function loadDisasters() {
    try {
        const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
        const response = await fetch(contextPath + '/DisasterMapServlet');

        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }

        allDisasters = await response.json();
        applyFilters();
        updateStats();
    } catch (error) {
        console.error('Error loading disasters:', error);
        showToast('Error loading disasters: ' + error.message, 'error');
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Failed to load disasters. Please check if server is running.</td></tr>';
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
            <td><i class="fas fa-map-marker-alt" style="color:var(--purple-primary);"></i> ${escapeHtml(d.location)}</td>
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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
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
    try {
        return new Date(timestamp).toLocaleString();
    } catch(e) {
        return timestamp;
    }
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
            <p>${escapeHtml(disaster.location)}</p>
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
    }, 100);
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
        const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
        const response = await fetch(contextPath + '/UpdateDisasterServlet', {
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
        const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
        const response = await fetch(contextPath + '/DeleteDisasterServlet?id=' + deleteId, {
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
document.addEventListener('DOMContentLoaded', function() {
    loadDisasters();
});