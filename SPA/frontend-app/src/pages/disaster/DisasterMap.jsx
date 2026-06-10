// File: src/components/DisasterMap.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './disastermap.css';

// 🚨 Replace these with your actual API Keys
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '15px'
};

// Default center (e.g., Kuala Lumpur, Malaysia)
const center = {
  lat: 3.1390,
  lng: 101.6869
};

const DisasterMap = () => {
    // 1. Load Google Maps Script
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [disasters, setDisasters] = useState([]);
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);

    // 2. Fetch Disasters from your Spring Boot Backend
    useEffect(() => {
        // Mock data for demonstration. 
        // Replace this with: fetch('http://localhost:8084/api/disasters/all')
        setDisasters([
            { id: 1, location: "Shah Alam", latitude: 3.0738, longitude: 101.5183, disaster_type: "flood", status: "CRITICAL" },
            { id: 2, location: "Klang", latitude: 3.0367, longitude: 101.4433, disaster_type: "fire", status: "ACTIVE" }
        ]);
    }, []);

    // 3. Handle Marker Click & Fetch Live Weather
    const handleMarkerClick = async (disaster) => {
        setSelectedDisaster(disaster);
        setWeatherData(null); // Reset weather data
        setIsLoadingWeather(true);

        try {
            // Fetch live weather from OpenWeatherMap using the disaster's coordinates
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${disaster.latitude}&lon=${disaster.longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            const response = await fetch(weatherUrl);
            const data = await response.json();
            
            setWeatherData({
                temp: data.main.temp,
                condition: data.weather[0].description,
                icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setIsLoadingWeather(false);
        }
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2><i className="fas fa-map-marked-alt"></i> Live Disaster & Weather Map</h2>
            
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {/* 4. Render Markers for all disasters */}
                {disasters.map(disaster => (
                    <Marker 
                        key={disaster.id}
                        position={{ lat: disaster.latitude, lng: disaster.longitude }}
                        onClick={() => handleMarkerClick(disaster)}
                        // Optional: Custom icons based on status
                        // icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} 
                    />
                ))}

                {/* 5. Show InfoWindow when a marker is clicked */}
                {selectedDisaster && (
                    <InfoWindow
                        position={{ lat: selectedDisaster.latitude, lng: selectedDisaster.longitude }}
                        onCloseClick={() => setSelectedDisaster(null)}
                    >
                        <div style={{ padding: '10px', maxWidth: '250px', fontFamily: 'Arial' }}>
                            <h3 style={{ color: '#6B46C1', margin: '0 0 10px 0' }}>
                                {selectedDisaster.location}
                            </h3>
                            <p><strong>Type:</strong> {selectedDisaster.disaster_type.toUpperCase()}</p>
                            <p><strong>Status:</strong> {selectedDisaster.status}</p>
                            
                            <hr style={{ margin: '10px 0', border: '0.5px solid #eee' }} />
                            
                            {/* Weather Section */}
                            <h4 style={{ margin: '5px 0' }}>Live Weather Info</h4>
                            {isLoadingWeather ? (
                                <p style={{ fontSize: '12px', color: 'gray' }}>Fetching weather...</p>
                            ) : weatherData ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={weatherData.icon} alt="weather icon" width="40" height="40" />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                                            {weatherData.temp} °C
                                        </p>
                                        <p style={{ margin: 0, fontSize: '12px', textTransform: 'capitalize' }}>
                                            {weatherData.condition}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ fontSize: '12px', color: 'red' }}>Failed to load weather.</p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default DisasterMap;