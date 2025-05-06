import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EarthquakeFilter from './EarthquakeFilter/EarthquakeFilter';
import EarthquakeMap from './EarthquakeMap/EarthquakeMap';
import 'leaflet/dist/leaflet.css';

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

interface Feature {
    geometry: {
        coordinates: [number, number, number]
    },
    properties: {
        mag: number;
        place: string;
        time: number;
        url: string;
        type: string;
        alert: string;
        tsunami: number;
    }
}

interface EarthquakeResponse {
    features: Feature[];
}

const MapComponent: React.FC = () => {
    // Estado para los valores actuales en los controles
    const [currentMinMagnitude, setCurrentMinMagnitude] = useState<number>(0);
    const [currentMaxDepth, setCurrentMaxDepth] = useState<number>(700);
    const [currentTimeframe, setCurrentTimeframe] = useState<string>("all_day");
    
    // Estado para los valores aplicados (usados en la consulta)
    const [appliedMinMagnitude, setAppliedMinMagnitude] = useState<number>(0);
    const [appliedMaxDepth, setAppliedMaxDepth] = useState<number>(700);
    const [appliedTimeframe, setAppliedTimeframe] = useState<string>("all_day");
    
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    console.table(selectedEarthquake);
    
    // Función para cargar los datos, encapsulada con useCallback
    const fetchEarthquakeData = useCallback(() => {
        setIsLoading(true);
        
        axios.get<EarthquakeResponse>(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${appliedTimeframe}.geojson`)
            .then(response => {
                const earthquakesData = response.data.features
                    .filter(feature => 
                        feature.properties.mag >= appliedMinMagnitude && 
                        feature.geometry.coordinates[2] <= appliedMaxDepth
                    )
                    .map((feature: Feature) => ({
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0],
                        magnitude: feature.properties.mag,
                        location: feature.properties.place,
                        time: new Date(feature.properties.time).toLocaleString(),
                        depth: feature.geometry.coordinates[2],
                        url: feature.properties.url,
                        type: feature.properties.type,
                        alert: feature.properties.alert,
                        tsunami: feature.properties.tsunami
                    }));
                setEarthquakes(earthquakesData);
                setLastUpdated(new Date());
            })
            .catch(error => {
                console.error("Error fetching earthquake data:", error);
                // Aquí se podría implementar una notificación de error
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [appliedMinMagnitude, appliedMaxDepth, appliedTimeframe]);
    
    // Cargar datos la primera vez
    useEffect(() => {
        fetchEarthquakeData();
    }, []);

    const handleEarthquakeClick = (quake: Earthquake) => {
        setSelectedEarthquake(quake);
    }

    // Manejador para el botón de actualizar
    const handleRefresh = () => {
        // Aplicar los valores actuales como valores de filtro
        setAppliedMinMagnitude(currentMinMagnitude);
        setAppliedMaxDepth(currentMaxDepth);
        setAppliedTimeframe(currentTimeframe);
        
        // Actualizar datos con los nuevos valores aplicados
        // fetchEarthquakeData se ejecutará automáticamente por su dependencia
    };
    
    // useEffect para llamar a fetchEarthquakeData cuando cambien los valores aplicados
    useEffect(() => {
        fetchEarthquakeData();
    }, [appliedMinMagnitude, appliedMaxDepth, appliedTimeframe, fetchEarthquakeData]);
    
    return (
        <>
            <EarthquakeFilter
                minMagnitude={currentMinMagnitude}
                setMinMagnitude={setCurrentMinMagnitude}
                maxDepth={currentMaxDepth}
                setMaxDepth={setCurrentMaxDepth}
                timeframe={currentTimeframe}
                setTimeframe={setCurrentTimeframe}
                onRefresh={handleRefresh}
            />

            {isLoading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <div>Cargando datos de sismos...</div>
                </div>
            )}

            {!isLoading && earthquakes.length === 0 && (
                <div className="no-data-message">
                    No se encontraron sismos que coincidan con los criterios de filtrado.
                </div>
            )}

            <EarthquakeMap
                earthquakes={earthquakes}
                onEarthquakeClick={handleEarthquakeClick}
                isLoading={isLoading}
            />

            {lastUpdated && (
                <div className="last-updated">
                    Datos actualizados: {lastUpdated.toLocaleString()}
                </div>
            )}
        </>
    );
}

export default MapComponent;
