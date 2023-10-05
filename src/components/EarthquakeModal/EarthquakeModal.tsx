import React from 'react';

interface Earthquake {
    magnitude: number;
    location: string;
    time: string;
    depth: number;
    url: string;
}

interface EarthquakeModalProps {
    earthquake: Earthquake;
    onClose: () => void;
}

const EarthquakeModal: React.FC<EarthquakeModalProps> = ({ earthquake, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Detalles del Sismo</h2>
                <p><strong>Magnitud:</strong> {earthquake.magnitude}</p>
                <p><strong>Ubicación:</strong> {earthquake.location}</p>
                <p><strong>Profundidad:</strong> {earthquake.depth} km</p>
                <p><strong>Fecha y Hora:</strong> {earthquake.time}</p>
                <p><a href={earthquake.url} target="_blank" rel="noreferrer">Más detalles en USGS</a></p>
            </div>
        </div>
    );
}

export default EarthquakeModal;
