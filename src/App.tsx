import React from 'react';
import MapComponent from './components/MapComponent';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div>
            <h1>Mapa de Sismos y Desastres Naturales</h1>
            <MapComponent />
        </div>
    );
}

export default App;
