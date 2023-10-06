import React, { useEffect, useState } from 'react';
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
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [minMagnitude, setMinMagnitude] = useState<number>(0);
    const [maxDepth, setMaxDepth] = useState<number>(700);
    const [timeframe, setTimeframe] = useState<string>("all_day");
    const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

    console.table(selectedEarthquake);
    
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
                        url: feature.properties.url,
                        type: feature.properties.type,
                        alert: feature.properties.alert,
                        tsunami: feature.properties.tsunami
                    }));
                setEarthquakes(earthquakesData);                
            });
    }, [minMagnitude, maxDepth, timeframe]);

    const handleEarthquakeClick = (quake: Earthquake) => {
        setSelectedEarthquake(quake);
    }
    
    return (
        <>
            <EarthquakeFilter
                minMagnitude={minMagnitude}
                setMinMagnitude={setMinMagnitude}
                maxDepth={maxDepth}
                setMaxDepth={setMaxDepth}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
            />

            <EarthquakeMap
                earthquakes={earthquakes}
                onEarthquakeClick={handleEarthquakeClick}
            />

        </>
    );
}

export default MapComponent;
