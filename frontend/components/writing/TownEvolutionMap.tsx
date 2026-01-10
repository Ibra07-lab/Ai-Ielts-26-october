import React from 'react';

interface MapProps {
    className?: string;
}

/**
 * Town Evolution Map Component (1995 vs Present)
 * Renders two side-by-side maps showing the development of a town
 * Dark-mode optimized with white strokes and subtle grey fills
 */
const TownEvolutionMap: React.FC<MapProps> = ({ className = '' }) => {
    const styles = {
        boundary: {
            fill: 'none',
            stroke: '#E5E7EB',
            strokeWidth: 1.5,
        },
        areaFill: {
            fill: 'rgba(55, 65, 81, 0.3)',
            stroke: '#E5E7EB',
            strokeWidth: 1.2,
        },
        road: {
            fill: 'none',
            stroke: '#9CA3AF',
            strokeWidth: 2,
        },
        text: {
            fill: '#E5E7EB',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '8px',
            textAnchor: 'middle' as const,
        },
        yearLabel: {
            fill: '#F87171',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
        },
        sea: {
            fill: 'rgba(30, 58, 138, 0.2)', // Subtle blue for sea
            stroke: '#3B82F6',
            strokeWidth: 0.5,
        },
        tree: {
            fill: '#10B981',
            fontSize: '10px',
        },
        house: {
            fill: 'none',
            stroke: '#E5E7EB',
            strokeWidth: 0.8,
        }
    };

    const Compass = ({ x, y }: { x: number, y: number }) => (
        <g transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#9CA3AF" strokeWidth="0.5" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#9CA3AF" strokeWidth="0.5" />
            <text x="0" y="-12" style={{ ...styles.text, fontSize: '6px' }}>n</text>
            <text x="12" y="2" style={{ ...styles.text, fontSize: '6px' }}>e</text>
            <text x="0" y="18" style={{ ...styles.text, fontSize: '6px' }}>s</text>
            <text x="-12" y="2" style={{ ...styles.text, fontSize: '6px' }}>w</text>
        </g>
    );

    const HouseIcon = ({ x, y }: { x: number, y: number }) => (
        <g transform={`translate(${x}, ${y})`}>
            <path d="M-4 2 L0 -2 L4 2 L4 4 L-4 4 Z" style={styles.house} />
        </g>
    );

    const TreeIcon = ({ x, y }: { x: number, y: number }) => (
        <g transform={`translate(${x}, ${y}) scale(0.5)`}>
            <circle cx="0" cy="-5" r="5" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#10B981" />
        </g>
    );

    const Map1995 = () => (
        <svg viewBox="0 0 240 200" className="w-full h-full">
            <rect x="0" y="0" width="240" height="200" style={styles.boundary} opacity="0.2" />
            <text x="120" y="20" style={styles.yearLabel}>1995</text>
            <Compass x={180} y={40} />


            {/* Roads */}
            <path d="M20 20 L160 180" style={styles.road} />
            <path d="M120 140 L220 150" style={styles.road} />

            {/* Housing sections */}
            <HouseIcon x={40} y={30} /><HouseIcon x={60} y={50} /><HouseIcon x={80} y={70} />

            <text x="50" y="85" style={styles.text}>housing</text>

            <rect x="30" y="95" width="40" height="50" style={styles.areaFill} />
            <HouseIcon x={42} y={110} /><HouseIcon x={58} y={110} />
            <HouseIcon x={42} y={130} /><HouseIcon x={58} y={130} />


            {/* Farmland & Forest Park */}
            <path d="M180 20 Q220 20 220 80 L160 80 Q160 20 180 20" style={styles.areaFill} />
            <text x="195" y="50" style={styles.text}>farmland</text>

            <path d="M170 90 Q220 90 220 140 L160 140 Q160 90 170 90" style={styles.areaFill} />
            <TreeIcon x={175} y={105} /><TreeIcon x={190} y={105} /><TreeIcon x={205} y={110} />
            <TreeIcon x={180} y={125} /><TreeIcon x={195} y={125} /><TreeIcon x={210} y={120} />

            <text x="190" y="138" style={styles.text}>forest park</text>

            {/* Shops & Fish Market */}
            <rect x="25" y="155" width="15" height="10" style={styles.areaFill} />
            <rect x="45" y="157" width="15" height="10" style={styles.areaFill} />
            <rect x="65" y="159" width="15" height="10" style={styles.areaFill} />
            <text x="45" y="150" style={styles.text}>shop</text>

            <rect x="30" y="175" width="80" height="15" style={styles.areaFill} />
            <text x="70" y="186" style={styles.text}>fish market</text>

            {/* Hotel & Cafe */}
            <rect x="180" y="115" width="30" height="25" style={styles.areaFill} transform="rotate(10 180 115)" />
            <text x="195" y="108" style={styles.text} transform="rotate(10 195 108)">hotel</text>

            <rect x="210" y="165" width="15" height="12" style={styles.areaFill} />
            <text x="218" y="160" style={styles.text}>cafe</text>

            {/* Sea & Fishing Port */}
            <path d="M0 190 Q120 185 240 195 L240 200 L0 200 Z" style={styles.sea} />
            <text x="20" y="196" style={{ ...styles.text, fill: '#3B82F6' }}>sea</text>

            <rect x="100" y="185" width="40" height="10" style={styles.areaFill} />
            <text x="120" y="196" style={styles.text}>fishing port</text>
        </svg>
    );

    const MapPresent = () => (
        <svg viewBox="0 0 240 200" className="w-full h-full">
            <rect x="0" y="0" width="240" height="200" style={styles.boundary} opacity="0.2" />
            <text x="120" y="20" style={styles.yearLabel}>Present</text>
            <Compass x={180} y={40} />


            {/* Roads */}
            <path d="M20 20 L160 180" style={styles.road} />
            <path d="M120 140 L220 150" style={styles.road} />

            {/* Housing sections (same) */}
            <HouseIcon x={40} y={30} /><HouseIcon x={60} y={50} /><HouseIcon x={80} y={70} />

            <text x="50" y="85" style={styles.text}>housing</text>

            <rect x="30" y="95" width="40" height="50" style={styles.areaFill} />
            <HouseIcon x={42} y={110} /><HouseIcon x={58} y={110} />
            <HouseIcon x={42} y={130} /><HouseIcon x={58} y={130} />


            {/* Golf Course (replaced Farmland) */}
            <path d="M180 20 Q220 20 220 80 L160 80 Q160 20 180 20" style={{ ...styles.areaFill, fill: 'rgba(16, 185, 129, 0.1)' }} />
            <text x="195" y="50" style={styles.text}>golf</text>

            {/* Tennis Courts (replaced Forest Park) */}
            <path d="M170 90 Q220 90 220 140 L160 140 Q160 90 170 90" style={styles.areaFill} />
            <rect x="180" y="105" width="12" height="18" style={styles.areaFill} />
            <rect x="200" y="105" width="12" height="18" style={styles.areaFill} />
            <text x="195" y="128" style={styles.text}>tennis</text>

            {/* Restaurant (replaced Shop) */}
            <rect x="25" y="155" width="60" height="10" style={styles.areaFill} />
            <text x="55" y="150" style={styles.text}>restaurant</text>

            {/* Apartments (replaced Fish Market) */}
            <rect x={30} y={175} width={80} height={15} style={styles.areaFill} />
            <HouseIcon x={40} y={180} /><HouseIcon x={60} y={180} /><HouseIcon x={80} y={180} /><HouseIcon x={100} y={180} />
            <text x={60} y={172} style={styles.text}>apartments</text>


            {/* Hotel with Car Park */}
            <rect x="180" y="115" width="30" height="25" style={styles.areaFill} transform="rotate(10 180 115)" />
            <text x="195" y="108" style={styles.text} transform="rotate(10 195 108)">hotel</text>
            <path d="M210 120 L230 120 L230 140 L210 140 Z" style={styles.areaFill} />
            <text x="220" y="132" style={{ ...styles.text, fontSize: '6px' }}>car park</text>

            <rect x="210" y="165" width="15" height="12" style={styles.areaFill} />
            <text x="218" y="160" style={styles.text}>cafe</text>

            {/* Sea (Fishing Port Gone) */}
            <path d="M0 190 Q120 185 240 195 L240 200 L0 200 Z" style={styles.sea} />
            <text x="20" y="196" style={{ ...styles.text, fill: '#3B82F6' }}>sea</text>
        </svg>
    );

    return (
        <div className={`flex flex-col gap-4 p-4 ${className}`}>
            <div className="text-center">
                <p className="text-gray-300 text-sm">
                    The maps show changes in a town between 1995 and the present day.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <Map1995 />
                </div>
                <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <MapPresent />
                </div>
            </div>
        </div>
    );
};

export default TownEvolutionMap;
