import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

interface Earthquake {
    lat: number;
    lon: number;
    magnitude: number;
    location: string;
    time: string;
    depth: number;
    url: string;
}

interface Feature {
    geometry: {
        coordinates: [number, number, number]
    },
    properties: {
        mag: number;
        place: string;
        time: number;
        url: string;
    }
}

interface EarthquakeResponse {
    features: Feature[];
}

const MapComponent: React.FC = () => {
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [minMagnitude, setMinMagnitude] = useState<number>(0);
    const [maxDepth, setMaxDepth] = useState<number>(700);  // La mayoría de los sismos son menos profundos que 700 km
    const [timeframe, setTimeframe] = useState<string>("all_day");


    useEffect(() => {
        axios.get<EarthquakeResponse>(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeframe}.geojson`)
            .then(response => {
                const earthquakesData = response.data.features
                    .filter(feature => feature.properties.mag >= minMagnitude && feature.geometry.coordinates[2] <= maxDepth)
                    .map((feature: Feature) => ({
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0],
                        magnitude: feature.properties.mag,
                        location: feature.properties.place,
                        time: new Date(feature.properties.time).toLocaleString(),
                        depth: feature.geometry.coordinates[2],
                        url: feature.properties.url
                    }));
                setEarthquakes(earthquakesData);
            });
    }, [minMagnitude, maxDepth, timeframe]);


    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Min Magnitude:
                    <input type="number" value={minMagnitude} onChange={(e) => setMinMagnitude(Number(e.target.value))} />
                </label>
                <label>
                    Max Depth:
                    <input type="number" value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} />
                </label>
                <label>
                    Timeframe:
                    <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                        <option value="all_day">Last 24 hours</option>
                        <option value="all_week">Last week</option>
                    </select>
                </label>
            </div>

            <MapContainer center={[-20, -70]} zoom={2} style={{ width: '100%', height: '80vh' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {earthquakes.map((quake, idx) => (
                    <div key={idx}>
                        <Marker position={[quake.lat, quake.lon]}>
                            <Popup>
                                Magnitud: {quake.magnitude}<br />
                                Ubicación: {quake.location}<br />
                                Profundidad: {quake.depth} km<br />
                                Fecha y Hora: {quake.time}<br />
                                <a href={quake.url} target="_blank" rel="noreferrer">Más detalles</a>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[quake.lat, quake.lon]}
                            fillColor="red"
                            radius={quake.magnitude * 10000}
                        />
                    </div>
                ))}
            </MapContainer>
        </>
    );
}

export default MapComponent;
