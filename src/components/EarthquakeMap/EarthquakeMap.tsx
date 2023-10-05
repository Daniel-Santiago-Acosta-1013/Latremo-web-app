import React from 'react';
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
}

interface EarthquakeMapProps {
    earthquakes: Earthquake[];
    onEarthquakeClick: (quake: Earthquake) => void;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ earthquakes, onEarthquakeClick }) => {
    return (
        <MapContainer center={[-20, -70]} zoom={2} className="earthquake-map">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {earthquakes.map((quake, idx) => (
                <div key={idx}>
                    <Marker position={[quake.lat, quake.lon]} eventHandlers={{ click: () => onEarthquakeClick(quake) }}>
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
    );
}

export default EarthquakeMap;
