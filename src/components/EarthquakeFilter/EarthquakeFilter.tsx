import React from 'react';
import './EarthquakeFilter.css';

interface EarthquakeFilterProps {
    minMagnitude: number;
    setMinMagnitude: (value: number) => void;
    maxDepth: number;
    setMaxDepth: (value: number) => void;
    timeframe: string;
    setTimeframe: (value: string) => void;
}

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({ minMagnitude, setMinMagnitude, maxDepth, setMaxDepth, timeframe, setTimeframe }) => {
    return (
        <div className="earthquake-filter">
            <label>
                Min Magnitude:
                <input type="number" value={minMagnitude} onChange={(e) => setMinMagnitude(Number(e.target.value))} />
            </label>
            <label>
                Max Depth:
                <input type="number" value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} />
            </label>
            <label>
                Timeframe:
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="all_day">Last 24 hours</option>
                    <option value="all_week">Last week</option>
                </select>
            </label>
        </div>
    );
}

export default EarthquakeFilter;
