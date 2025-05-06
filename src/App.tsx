import React from 'react';
import MapComponent from './components/MapComponent';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1 className="app-title">Mapa de Sismos y Desastres Naturales</h1>
                    <p className="app-subtitle">Visualiza y explora la actividad sísmica en tiempo real</p>
                </div>
            </header>
            <MapComponent />
        </div>
    );
}

export default App;
