<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Disaster - Relief Coordinator</title>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- ===== SHARED MAP CONFIGURATION ===== -->
    <script src="js/disaster-map-config.js"></script>
    
    <link rel="stylesheet" href="css/report-disaster.css"/>
</head>
<body>
    <div class="report-container">
        <div class="report-header">
            <div class="logo">
                <i class="fas fa-hand-holding-heart"></i> DisasterRelief
            </div>
            <h1>Report New Disaster Incident</h1>
            <p>Fill out the form below. Click on the map to mark the exact location.</p>
        </div>

        <form action="ReportDisasterServlet" method="post" class="report-form" id="disasterForm">
            <div class="form-section">
                <h3><i class="fas fa-info-circle"></i> Incident Details</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="incidentType">Disaster Type <span class="required">*</span></label>
                        <select id="incidentType" name="incidentType" required>
                            <option value="">Select disaster type</option>
                            <option value="flood">🌊 Flood</option>
                            <option value="earthquake">🌍 Earthquake</option>
                            <option value="wildfire">🔥 Wildfire</option>
                            <option value="hurricane">🌀 Hurricane</option>
                            <option value="tornado">🌪️ Tornado</option>
                            <option value="landslide">⛰️ Landslide</option>
                            <option value="tsunami">🌊 Tsunami</option>
                            <option value="Other">❗ Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="locationName">Location Name <span class="required">*</span></label>
                    <input type="text" id="locationName" name="locationName" 
                           placeholder="e.g., Kuala Lumpur City Centre" required>
                </div>

                <div class="form-group">
                    <label for="description">Incident Description</label>
                    <textarea id="description" name="description" rows="3" 
                              placeholder="Describe the situation, affected areas, immediate needs..."></textarea>
                </div>
            </div>

            <div class="form-section">
                <h3><i class="fas fa-users"></i> Affected Population</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="estimatedPeople">Estimated People Affected</label>
                        <input type="number" id="estimatedPeople" name="estimatedPeople" 
                               placeholder="Number of people">
                    </div>
                    
                    <div class="form-group">
                        <label for="affectedHomes">Homes Destroyed/Damaged</label>
                        <input type="number" id="affectedHomes" name="affectedHomes" 
                               placeholder="Number of homes">
                    </div>
                </div>

                <div class="form-group">
                    <label>Age Group Most Affected</label>
                    <div class="age-group-options">
                        <label class="age-option"><input type="radio" name="ageGroup" value="<18"> &lt;18</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="18-29"> 18-29</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="30-39"> 30-39</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="40-49"> 40-49</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="50-59"> 50-59</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="60-69"> 60-69</label>
                        <label class="age-option"><input type="radio" name="ageGroup" value="70+"> 70+</label>
                    </div>
                </div>
            </div>

            <!-- Map Location Picker -->
            <div class="form-section highlight">
                <h3><i class="fas fa-map-marker-alt"></i> Location on Map <span class="required">*</span></h3>
                <p class="help-text">📍 Click anywhere on the map to mark the disaster location</p>
                
                <div class="map-container">
                    <div id="locationMap"></div>
                </div>
                
                <div class="coordinates-display" id="coordDisplay">
                    <i class="fas fa-info-circle"></i> No location selected. Click on the map above.
                </div>
                
                <div id="errorMsg" class="error-message"></div>
                
                <button type="button" class="current-location-btn" onclick="useMyLocation()">
                    <i class="fas fa-location-dot"></i> Use My Current Location
                </button>
                
                <input type="hidden" id="latitude" name="latitude" required>
                <input type="hidden" id="longitude" name="longitude" required>
            </div>

            <!-- Reporter Information -->
            <div class="form-section">
                <h3><i class="fas fa-user"></i> Reporter Information</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="reporterName">Your Name <span class="required">*</span></label>
                        <input type="text" id="reporterName" name="reporterName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reporterPhone">Phone Number</label>
                        <input type="tel" id="reporterPhone" name="reporterPhone" 
                               placeholder="For follow-up">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reporterOrg">Organization/Agency</label>
                    <input type="text" id="reporterOrg" name="reporterOrg" 
                           placeholder="e.g., Red Cross, Local Government, Volunteer">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" onclick="resetForm()" class="btn-secondary">
                    <i class="fas fa-redo"></i> Reset Form
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit Disaster Report
                </button>
            </div>
        </form>
    </div>

    <script>
        // Initialize the map using shared functions
        let map;
        let selectedMarker = null;
        
        // Make sure the DOM is fully loaded before creating the map
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM loaded, initializing map with shared config...");
            
            // Use the shared map initialization function
            if (typeof initMalaysiaMap !== 'undefined') {
                map = initMalaysiaMap('locationMap', {
                    zoomControl: true,
                    scrollWheelZoom: true
                });
                console.log("Map initialized using shared config");
            } else {
                // Fallback if shared config not loaded
                console.warn("Shared config not loaded, using fallback");
                const malaysiaBounds = [[0.85, 99.5], [7.5, 119.5]];
                const malaysiaCenter = [4.2105, 101.9758];
                map = L.map('locationMap').setView(malaysiaCenter, 7);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; OSM &copy; CARTO',
                    subdomains: 'abcd',
                    maxZoom: 19
                }).addTo(map);
                map.setMaxBounds(malaysiaBounds);
            }
            
            // Handle map click events
            map.on('click', function(e) {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                
                console.log("Map clicked at:", lat, lng);
                
                // Remove existing marker if any
                if (selectedMarker) {
                    map.removeLayer(selectedMarker);
                }
                
                // Add new marker at clicked location
                selectedMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup('📍 Disaster Location<br>Lat: ' + lat.toFixed(6) + '<br>Lng: ' + lng.toFixed(6))
                    .openPopup();
                
                // Update hidden form fields
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;
                
                // Update display for user
                const coordDisplay = document.getElementById('coordDisplay');
                coordDisplay.innerHTML = '<i class="fas fa-check-circle"></i> ✅ Location selected! <strong>Latitude:</strong> ' + lat.toFixed(6) + ' | <strong>Longitude:</strong> ' + lng.toFixed(6);
                coordDisplay.classList.add('has-location');
                
                // Use shared reverse geocoding if available
                if (typeof reverseGeocode !== 'undefined') {
                    reverseGeocode(lat, lng).then(address => {
                        if (address && document.getElementById('locationName').value === '') {
                            document.getElementById('locationName').value = address.substring(0, 100);
                        }
                    });
                } else {
                    // Fallback geocoding
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.display_name && document.getElementById('locationName').value === '') {
                                document.getElementById('locationName').value = data.display_name.substring(0, 100);
                            }
                        })
                        .catch(error => console.log('Geocoding error:', error));
                }
            });
            
            console.log("Map initialized successfully");
        });
        
        // Use current location using shared function if available
        function useMyLocation() {
            if (typeof getUserLocation !== 'undefined') {
                document.getElementById('coordDisplay').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting your location...';
                
                getUserLocation()
                    .then(location => {
                        map.setView([location.lat, location.lng], 12);
                        map.fire('click', {
                            latlng: { lat: location.lat, lng: location.lng }
                        });
                    })
                    .catch(error => {
                        showError('Could not get your location: ' + error.message);
                    });
            } else {
                // Fallback to original implementation
                if (!navigator.geolocation) {
                    showError('Geolocation is not supported by your browser');
                    return;
                }
                
                document.getElementById('coordDisplay').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting your location...';
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        map.setView([lat, lng], 12);
                        map.fire('click', {
                            latlng: { lat: lat, lng: lng }
                        });
                    },
                    function(error) {
                        let errorMsg = "Could not get your location: ";
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMsg += "Please allow location access.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMsg += "Location information unavailable.";
                                break;
                            case error.TIMEOUT:
                                errorMsg += "Request timed out.";
                                break;
                            default:
                                errorMsg += "Unknown error.";
                        }
                        showError(errorMsg);
                    }
                );
            }
        }
        
        function showError(msg) {
            const errorDiv = document.getElementById('errorMsg');
            errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + msg;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
        
        function resetForm() {
            document.getElementById('disasterForm').reset();
            if (selectedMarker) {
                map.removeLayer(selectedMarker);
                selectedMarker = null;
            }
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';
            document.getElementById('coordDisplay').innerHTML = '<i class="fas fa-info-circle"></i> No location selected. Click on the map above.';
            document.getElementById('coordDisplay').classList.remove('has-location');
        }
        
        // Form validation before submit
        document.getElementById('disasterForm').addEventListener('submit', function(e) {
            const lat = document.getElementById('latitude').value;
            const lng = document.getElementById('longitude').value;
            
            if (!lat || !lng) {
                e.preventDefault();
                showError('Please click on the map to select the disaster location!');
                return false;
            }
        });
    </script>
</body>
</html>