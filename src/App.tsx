import React from 'react';
import MapComponent from './components/MapComponent';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div>
            <h1>Mapa de Sismos en Latinoamérica</h1>
            <MapComponent />
        </div>
    );
}

export default App;
