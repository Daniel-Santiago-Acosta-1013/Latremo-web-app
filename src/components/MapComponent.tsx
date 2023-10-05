import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Earthquake {
    lat: number;
    lon: number;
    magnitude: number;
    location: string;
}

const MapComponent: React.FC = () => {
    // Mocked data for demo purposes
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([
        { lat: -33.45, lon: -70.65, magnitude: 5.5, location: 'Santiago, Chile' }
    ]);

    useEffect(() => {
        // TODO: Fetch real-time data from an API or data source
    }, []);

    return (
        <MapContainer center={[-20, -70]} zoom={4} style={{ width: '100%', height: '80vh' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {earthquakes.map((quake, idx) => (
                <Marker key={idx} position={[quake.lat, quake.lon]}>
                    <Popup>
                        Magnitud: {quake.magnitude}<br />
                        Ubicación: {quake.location}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapComponent;
