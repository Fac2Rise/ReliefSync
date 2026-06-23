/**
 * Shared Map Configuration for Disaster Relief System
 * Used by both registration and dashboard pages
 */

// Malaysia boundaries (consistent across all pages)
const MALAYSIA_BOUNDS = {
    south: 0.85,
    north: 7.5,
    west: 99.5,
    east: 119.5,
    bounds: [[0.85, 99.5], [7.5, 119.5]]
};

// Malaysia center point
const MALAYSIA_CENTER = [4.2105, 101.9758];

// Default zoom levels
const ZOOM_LEVELS = {
    default: 7,
    marker: 12,
    min: 6,
    max: 15
};

// Marker colors based on status
const MARKER_COLORS = {
    ACTIVE: '#ef4444',     // Red
    CRITICAL: '#10b981',   // Green
    RECOVERED: '#3b82f6',  // Blue
    RESOLVED: '#3b82f6'    // Blue
};

// Disaster types with icons
const DISASTER_TYPES = {
    FLOOD: { icon: '🌊', color: '#3b82f6' },
    EARTHQUAKE: { icon: '🌍', color: '#f59e0b' },
    WILDFIRE: { icon: '🔥', color: '#ef4444' },
    HURRICANE: { icon: '🌀', color: '#8b5cf6' },
    TORNADO: { icon: '🌪️', color: '#6b7280' },
    LANDSLIDE: { icon: '⛰️', color: '#92400e' },
    TSUNAMI: { icon: '🌊', color: '#06b6d4' },
    OTHER: { icon: '❗', color: '#9ca3af' }
};

/**
 * Initialize a map with Malaysia restrictions
 * @param {string} elementId - The HTML element ID for the map
 * @param {Object} options - Optional configuration
 * @returns {L.Map} The Leaflet map instance
 */
function initMalaysiaMap(elementId, options = {}) {
    const mapOptions = {
        maxBounds: MALAYSIA_BOUNDS.bounds,
        maxBoundsViscosity: 1.0,
        minZoom: options.minZoom || ZOOM_LEVELS.min,
        maxZoom: options.maxZoom || ZOOM_LEVELS.max,
        zoomControl: options.zoomControl !== false,
        scrollWheelZoom: options.scrollWheelZoom !== false,
        doubleClickZoom: options.doubleClickZoom !== false,
        ...options
    };
    
    const map = L.map(elementId, mapOptions);
    
    // Use consistent tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        bounds: MALAYSIA_BOUNDS.bounds
    }).addTo(map);
    
    map.setView(options.center || MALAYSIA_CENTER, options.zoom || ZOOM_LEVELS.default);
    
    return map;
}

/**
 * Add a marker to the map with consistent styling
 * @param {L.Map} map - The Leaflet map instance
 * @param {Object} incident - Incident data object
 * @param {boolean} interactive - Whether marker should be interactive (popup, click)
 * @returns {L.CircleMarker} The created marker
 */
function addDisasterMarker(map, incident, interactive = true) {
    let color = MARKER_COLORS.ACTIVE;
    if (incident.status === 'RECOVERED' || incident.status === 'RESOLVED') {
        color = MARKER_COLORS.RECOVERED;
    } else if (incident.status === 'CRITICAL') {
        color = MARKER_COLORS.CRITICAL;
    }
    
    const marker = L.circleMarker([incident.latitude, incident.longitude], {
        radius: incident.severity === 'CRITICAL' ? 14 : 
                incident.severity === 'HIGH' ? 12 : 10,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);
    
    if (interactive) {
        const popupContent = `
            <div style="min-width: 200px;">
                <b>📍 ${incident.location || incident.locationName}</b><br>
                <b>Type:</b> ${incident.disasterType || incident.type}<br>
                <b>Status:</b> <span style="color:${color};">${incident.status || 'ACTIVE'}</span><br>
                ${incident.ageGroup ? `<b>Age Group:</b> ${incident.ageGroup}<br>` : ''}
                ${incident.severity ? `<b>Severity:</b> ${incident.severity}<br>` : ''}
                <b>Reported:</b> ${new Date(incident.reportedAt || incident.timestamp).toLocaleString()}<br>
                ${incident.estimatedPeople ? `<b>People Affected:</b> ${incident.estimatedPeople}<br>` : ''}
            </div>
        `;
        marker.bindPopup(popupContent);
    }
    
    return marker;
}

/**
 * Get the current user's location
 * @returns {Promise} Promise resolving to {lat, lng}
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise} Promise resolving to address string
 */
function reverseGeocode(lat, lng) {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => data.display_name || '')
        .catch(() => '');
}

/**
 * Load all incidents from the server
 * @param {string} servletUrl - The URL to fetch incidents from
 * @returns {Promise} Promise resolving to array of incidents
 */
function loadIncidents(servletUrl) {
    return fetch(servletUrl)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load incidents');
            return response.json();
        })
        .catch(error => {
            console.error('Error loading incidents:', error);
            return [];
        });
}

/**
 * Submit a new incident report
 * @param {string} servletUrl - The URL to submit to
 * @param {Object} incidentData - The incident data
 * @returns {Promise} Promise resolving to response
 */
function submitIncident(servletUrl, incidentData) {
    return fetch(servletUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(incidentData)
    }).then(response => response.json());
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MALAYSIA_BOUNDS,
        MALAYSIA_CENTER,
        ZOOM_LEVELS,
        MARKER_COLORS,
        DISASTER_TYPES,
        initMalaysiaMap,
        addDisasterMarker,
        getUserLocation,
        reverseGeocode,
        loadIncidents,
        submitIncident
    };
}