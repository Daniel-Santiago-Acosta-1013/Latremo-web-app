import React, { useState, useCallback, useRef, useEffect } from 'react';
import './EarthquakeFilter.css';

interface EarthquakeFilterProps {
    minMagnitude: number;
    setMinMagnitude: (magnitude: number) => void;
    maxDepth: number;
    setMaxDepth: (depth: number) => void;
    timeframe: string;
    setTimeframe: (timeframe: string) => void;
    onRefresh: () => void;
}

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({
    minMagnitude,
    setMinMagnitude,
    maxDepth,
    setMaxDepth,
    timeframe,
    setTimeframe,
    onRefresh
}) => {
    const [magnitudeTooltip, setMagnitudeTooltip] = useState(false);
    const [depthTooltip, setDepthTooltip] = useState(false);
    const [timeframeTooltip, setTimeframeTooltip] = useState(false);
    
    // Referencias para los sliders
    const magnitudeSliderRef = useRef<HTMLInputElement>(null);
    const depthSliderRef = useRef<HTMLInputElement>(null);
    
    // Actualizar variable CSS personalizada para el progreso del slider
    const updateSliderTrackStyle = useCallback((inputEl: HTMLInputElement, value: number, max: number) => {
        const percent = (value / max) * 100;
        inputEl.style.setProperty('--percent', `${percent}%`);
    }, []);
    
    // Efecto para actualizar los estilos de los sliders cuando cambien los valores
    useEffect(() => {
        if (magnitudeSliderRef.current) {
            updateSliderTrackStyle(magnitudeSliderRef.current, minMagnitude, 10);
        }
        if (depthSliderRef.current) {
            updateSliderTrackStyle(depthSliderRef.current, maxDepth, 700);
        }
    }, [minMagnitude, maxDepth, updateSliderTrackStyle]);
    
    const handleMagnitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setMinMagnitude(value);
        if (magnitudeSliderRef.current) {
            updateSliderTrackStyle(magnitudeSliderRef.current, value, 10);
        }
    };
    
    const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setMaxDepth(value);
        if (depthSliderRef.current) {
            updateSliderTrackStyle(depthSliderRef.current, value, 700);
        }
    };

    return (
        <div className="earthquake-filter">
            <div className="filter-control">
                <label className="magnitude-label">
                    <div className="label-header">
                        <span>Magnitud Mínima</span>
                        <button 
                            type="button"
                            className="help-icon"
                            aria-label="Ayuda sobre magnitud"
                            onClick={() => setMagnitudeTooltip(!magnitudeTooltip)}
                        >
                            ?
                        </button>
                        {magnitudeTooltip && (
                            <div className="help-tooltip">
                                Define la magnitud mínima de los sismos a mostrar. La escala va de 0 a 10 (Ritcher).
                            </div>
                        )}
                    </div>
                    <div className="slider-container">
                        <input
                            ref={magnitudeSliderRef}
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={minMagnitude}
                            onChange={handleMagnitudeChange}
                            className="slider"
                            style={{ "--percent": `${(minMagnitude / 10) * 100}%` } as React.CSSProperties}
                        />
                        <div className="slider-value">{minMagnitude}</div>
                    </div>
                </label>
            </div>

            <div className="filter-control">
                <label className="depth-label">
                    <div className="label-header">
                        <span>Profundidad Máx</span>
                        <button 
                            type="button"
                            className="help-icon"
                            aria-label="Ayuda sobre profundidad"
                            onClick={() => setDepthTooltip(!depthTooltip)}
                        >
                            ?
                        </button>
                        {depthTooltip && (
                            <div className="help-tooltip">
                                Define la profundidad máxima de los sismos a mostrar. Medida en kilómetros desde la superficie.
                            </div>
                        )}
                    </div>
                    <div className="slider-container">
                        <input
                            ref={depthSliderRef}
                            type="range"
                            min="0"
                            max="700"
                            step="10"
                            value={maxDepth}
                            onChange={handleDepthChange}
                            className="slider"
                            style={{ "--percent": `${(maxDepth / 700) * 100}%` } as React.CSSProperties}
                        />
                        <div className="slider-value">{maxDepth}<span className="unit">km</span></div>
                    </div>
                </label>
            </div>

            <div className="filter-control">
                <label className="timeframe-label">
                    <div className="label-header">
                        <span>Período</span>
                        <button 
                            type="button"
                            className="help-icon"
                            aria-label="Ayuda sobre marco temporal"
                            onClick={() => setTimeframeTooltip(!timeframeTooltip)}
                        >
                            ?
                        </button>
                        {timeframeTooltip && (
                            <div className="help-tooltip">
                                Selecciona el periodo de tiempo para los datos de sismos que deseas visualizar.
                            </div>
                        )}
                    </div>
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="select-timeframe"
                    >
                        <option value="all_hour">Última Hora</option>
                        <option value="all_day">Últimas 24 Horas</option>
                        <option value="all_week">Últimos 7 Días</option>
                        <option value="all_month">Últimos 30 Días</option>
                    </select>
                </label>
            </div>

            <button 
                className="refresh-button" 
                onClick={onRefresh}
                aria-label="Actualizar datos"
            >
                <span className="refresh-icon"></span>
                Actualizar
            </button>
        </div>
    );
};

export default EarthquakeFilter;
