import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
// import * as d3 from 'd3';
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
                            <strong>Magnitud:</strong> {quake.magnitude}<br />
                            <strong>Ubicación:</strong> {quake.location}<br />
                            <strong>Profundidad:</strong> {quake.depth} km<br />
                            <strong>Fecha y Hora:</strong> {quake.time}<br />
                            <strong>Tipo:</strong> {quake.type}<br />
                            <strong>Alerta:</strong> {quake.alert ? quake.alert : "No disponible"}<br />
                            <strong>Tsunami:</strong> {quake.tsunami ? 'Sí' : 'No'}<br />
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
