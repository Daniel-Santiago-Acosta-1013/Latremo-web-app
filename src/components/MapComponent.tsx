import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
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
    const [maxDepth, setMaxDepth] = useState<number>(700);
    const [timeframe, setTimeframe] = useState<string>("all_day");
    const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null); // Nuevo estado para el sismo seleccionado

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

    // Función para abrir la ventana modal al hacer clic en un sismo
    const handleEarthquakeClick = (quake: Earthquake) => {
        setSelectedEarthquake(quake);
    }

    // Función para cerrar la ventana modal
    const handleCloseModal = () => {
        setSelectedEarthquake(null);
    }

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
                        <Marker position={[quake.lat, quake.lon]} eventHandlers={{ click: () => handleEarthquakeClick(quake) }}>
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
                <Tooltip permanent={true} direction="bottom" offset={[0, 20]} opacity={1} className="map-tooltip">
                    <div>
                        Tamaño del círculo: Magnitud del sismo<br />
                        Color del círculo: Intensidad (rojo = alto)
                    </div>
                </Tooltip>
            </MapContainer>

            {/* Ventana modal para mostrar detalles adicionales del sismo seleccionado */}
            {selectedEarthquake && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <h2>Detalles del Sismo</h2>
                        <p><strong>Magnitud:</strong> {selectedEarthquake.magnitude}</p>
                        <p><strong>Ubicación:</strong> {selectedEarthquake.location}</p>
                        <p><strong>Profundidad:</strong> {selectedEarthquake.depth} km</p>
                        <p><strong>Fecha y Hora:</strong> {selectedEarthquake.time}</p>
                        <p><a href={selectedEarthquake.url} target="_blank" rel="noreferrer">Más detalles en USGS</a></p>
                    </div>
                </div>
            )}
        </>
    );
}

export default MapComponent;
