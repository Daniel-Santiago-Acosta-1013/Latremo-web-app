import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import './EarthquakeMap.css';

interface Earthquake {
    lat: number;
    lon: number;
    magnitude: number;
    location: string;
    time: string;
    depth: number;
    url: string;
    type: string;
    alert: string;
    tsunami: number;
}

interface EarthquakeMapProps {
    earthquakes: Earthquake[];
    onEarthquakeClick: (quake: Earthquake) => void;
    isLoading?: boolean;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ 
    earthquakes, 
    onEarthquakeClick,
    isLoading = false
}) => {
    const [legendCollapsed, setLegendCollapsed] = useState(false);

    const toggleLegend = () => {
        setLegendCollapsed(!legendCollapsed);
    };

    // Función para determinar el color basado en la magnitud
    const getMagnitudeColor = (magnitude: number) => {
        if (magnitude >= 7) return '#ff3838'; // Rojo intenso
        if (magnitude >= 5.5) return '#ff5757'; // Rojo medio
        if (magnitude >= 4) return '#ff8c00';  // Naranja
        if (magnitude >= 2.5) return '#ffc107'; // Amarillo
        return '#4caf50'; // Verde para magnitudes bajas
    };

    // Función para determinar la opacidad basada en la profundidad (más profundo = más transparente)
    const getDepthOpacity = (depth: number) => {
        const normalizedDepth = Math.min(depth, 700) / 700; // Normalizar entre 0 y 700 km
        return 0.8 - (normalizedDepth * 0.5); // Opacidad entre 0.8 y 0.3
    };

    return (
        <MapContainer 
            center={[-20, -70]} 
            zoom={2} 
            className={`earthquake-map ${isLoading ? 'is-loading' : ''}`}
            attributionControl={false} // Quitamos control de atribución por defecto
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {earthquakes.map((quake, idx) => {
                const color = getMagnitudeColor(quake.magnitude);
                const opacity = getDepthOpacity(quake.depth);
                
                return (
                    <div key={idx}>
                        <Marker 
                            position={[quake.lat, quake.lon]} 
                            eventHandlers={{ click: () => onEarthquakeClick(quake) }}
                        >
                            <Popup className="earthquake-tooltip">
                                <div>
                                    <strong>Magnitud:</strong> {quake.magnitude}<br />
                                    <strong>Ubicación:</strong> {quake.location}<br />
                                    <strong>Profundidad:</strong> {quake.depth} km<br />
                                    <strong>Fecha y Hora:</strong> {quake.time}<br />
                                    <strong>Tipo:</strong> {quake.type}<br />
                                    <strong>Alerta:</strong> {quake.alert ? quake.alert : "No disponible"}<br />
                                    <strong>Tsunami:</strong> {quake.tsunami ? 'Sí' : 'No'}<br />
                                    <a href={quake.url} target="_blank" rel="noreferrer">Más detalles</a>
                                </div>
                            </Popup>
                            <Tooltip className="earthquake-tooltip" direction="top">
                                <strong>Magnitud:</strong> {quake.magnitude}<br />
                                <strong>Ubicación:</strong> {quake.location}
                            </Tooltip>
                        </Marker>
                        <Circle
                            center={[quake.lat, quake.lon]}
                            pathOptions={{
                                fillColor: color,
                                fillOpacity: opacity,
                                color: color,
                                weight: 1,
                                opacity: opacity + 0.1
                            }}
                            radius={quake.magnitude * 50000}
                        />
                    </div>
                );
            })}
            
            <div className="leaflet-bottom leaflet-left" style={{ margin: '15px' }}>
                <div className={`map-tooltip ${legendCollapsed ? 'collapsed' : ''}`}>
                    <button 
                        className="map-tooltip-toggle" 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLegend();
                        }} 
                        aria-label={legendCollapsed ? "Expandir leyenda" : "Minimizar leyenda"}
                    >
                        {legendCollapsed ? '+' : '-'}
                    </button>
                    <div>
                        <strong className="text-gradient">Leyenda:</strong><br />
                        <span style={{ color: '#ff3838' }}>●</span> Magnitud ≥ 7.0<br />
                        <span style={{ color: '#ff5757' }}>●</span> Magnitud 5.5-6.9<br />
                        <span style={{ color: '#ff8c00' }}>●</span> Magnitud 4.0-5.4<br />
                        <span style={{ color: '#ffc107' }}>●</span> Magnitud 2.5-3.9<br />
                        <span style={{ color: '#4caf50' }}>●</span> Magnitud &lt; 2.5<br /><br />
                        <small>* Tamaño del círculo: Proporcional a la magnitud<br />
                        * Opacidad: Inversamente proporcional a la profundidad</small>
                    </div>
                </div>
            </div>
            
            {/* Atribución en esquina inferior derecha con estilo personalizado */}
            <div className="leaflet-bottom leaflet-right" style={{ margin: '10px' }}>
                <div className="leaflet-control-attribution leaflet-control">
                    &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
                </div>
            </div>
        </MapContainer>
    );
}

export default EarthquakeMap;
