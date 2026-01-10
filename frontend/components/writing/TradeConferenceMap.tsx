import React from 'react';

interface MapProps {
    className?: string;
}

/**
 * IELTS Writing Task 1 Map Component
 * Renders two side-by-side floor plans comparing a trade conference in 2009 and 2010
 * Dark-mode optimized with white strokes and subtle grey fills
 */
const TradeConferenceMap: React.FC<MapProps> = ({ className = '' }) => {
    // Shared styles for consistency
    const styles = {
        room: {
            fill: 'rgba(55, 65, 81, 0.3)',
            stroke: '#E5E7EB',
            strokeWidth: 1.5,
        },
        text: {
            fill: '#E5E7EB',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '10px',
            textAnchor: 'middle' as const,
        },
        smallText: {
            fill: '#9CA3AF',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '8px',
            textAnchor: 'middle' as const,
        },
        yearLabel: {
            fill: '#F87171',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
        },
    };

    // SVG for 2009 floor plan
    const Map2009 = () => (
        <svg viewBox="0 0 280 220" className="w-full h-full">
            {/* Title */}
            <text x="40" y="20" style={styles.yearLabel}>2009</text>

            {/* Top Row: Main Entrance, Registration, Side Entrance */}
            {/* Main Entrance */}
            <rect x="20" y="35" width="80" height="30" rx="2" style={styles.room} />
            <text x="60" y="53" style={styles.text}>main entrance</text>

            {/* Registration */}
            <rect x="105" y="35" width="80" height="30" rx="2" style={styles.room} />
            <text x="145" y="53" style={styles.text}>registration</text>

            {/* Side Entrance */}
            <rect x="190" y="35" width="70" height="30" rx="2" style={styles.room} />
            <text x="225" y="53" style={styles.text}>side entrance</text>

            {/* Middle Row: Concert Hall with Seats, Display Area, Balcony */}
            {/* Concert Hall (L-shaped) */}
            <path
                d="M20 75 L20 175 L60 175 L60 120 L80 120 L80 75 Z"
                style={styles.room}
            />
            <text x="40" y="115" style={styles.text}>concert</text>
            <text x="40" y="127" style={styles.text}>hall</text>

            {/* Seats (ellipses) */}
            <ellipse cx="65" cy="95" rx="10" ry="5" style={{ ...styles.room, fill: 'none' }} />
            <text x="75" y="88" style={styles.smallText}>seat</text>

            {/* Display Area */}
            <rect x="90" y="75" width="70" height="55" rx="2" style={styles.room} />
            <text x="125" y="105" style={styles.text}>display area</text>

            {/* Balcony */}
            <rect x="170" y="75" width="90" height="75" rx="2" style={styles.room} />
            <text x="215" y="117" style={styles.text}>balcony</text>

            {/* Bottom Row: Stage, Meeting Room, Exhibition Area */}
            {/* Stage */}
            <rect x="20" y="185" width="40" height="25" rx="2" style={styles.room} />
            <text x="40" y="201" style={styles.text}>stage</text>

            {/* Meeting Room */}
            <rect x="90" y="140" width="50" height="50" rx="2" style={styles.room} />
            <text x="115" y="163" style={styles.text}>meeting</text>
            <text x="115" y="175" style={styles.text}>room</text>

            {/* Exhibition Area */}
            <rect x="150" y="160" width="60" height="50" rx="2" style={styles.room} />
            <text x="180" y="183" style={styles.text}>exhibition</text>
            <text x="180" y="195" style={styles.text}>area</text>
        </svg>
    );

    // SVG for 2010 floor plan
    const Map2010 = () => (
        <svg viewBox="0 0 280 220" className="w-full h-full">
            {/* Title */}
            <text x="40" y="20" style={styles.yearLabel}>2010</text>

            {/* Top Row: Main Entrance, Registration, Side Entrance */}
            {/* Main Entrance */}
            <rect x="20" y="35" width="80" height="30" rx="2" style={styles.room} />
            <text x="60" y="53" style={styles.text}>main entrance</text>

            {/* Registration */}
            <rect x="105" y="35" width="80" height="30" rx="2" style={styles.room} />
            <text x="145" y="53" style={styles.text}>registration</text>

            {/* Side Entrance */}
            <rect x="190" y="35" width="70" height="30" rx="2" style={styles.room} />
            <text x="225" y="53" style={styles.text}>side entrance</text>

            {/* Middle Row: Exhibition Area (large), Registration (vertical), Balcony with Lounge */}
            {/* Exhibition Area (expanded) */}
            <rect x="20" y="75" width="140" height="90" rx="2" style={styles.room} />
            <text x="90" y="125" style={styles.text}>exhibition</text>
            <text x="90" y="137" style={styles.text}>area</text>

            {/* Right side vertical section */}
            {/* Registration (vertical) */}
            <rect x="170" y="75" width="25" height="60" rx="2" style={styles.room} />
            <text
                x="182"
                y="110"
                style={{ ...styles.text, fontSize: '9px' }}
                transform="rotate(-90 182 110)"
            >
                registration
            </text>

            {/* Balcony with Lounge Area */}
            <rect x="200" y="75" width="60" height="90" rx="2" style={styles.room} />
            <text x="230" y="110" style={styles.text}>balcony</text>
            <text x="230" y="122" style={styles.text}>with</text>
            <text x="230" y="134" style={styles.text}>lounge</text>
            <text x="230" y="146" style={styles.text}>area</text>

            {/* Bottom Row: Concert Hall (moved), Stage, Seat */}
            {/* Concert Hall (repositioned) */}
            <rect x="70" y="175" width="60" height="35" rx="2" style={styles.room} />
            <text x="100" y="193" style={styles.text}>concert</text>
            <text x="100" y="205" style={styles.text}>hall</text>

            {/* Seat */}
            <ellipse cx="145" cy="192" rx="10" ry="5" style={{ ...styles.room, fill: 'none' }} />
            <text x="145" y="207" style={styles.smallText}>seat</text>

            {/* Stage (repositioned) */}
            <rect x="165" y="175" width="30" height="35" rx="2" style={styles.room} />
            <text x="180" y="196" style={styles.text}>stage</text>
        </svg>
    );

    return (
        <div className={`flex flex-col gap-4 p-4 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <p className="text-gray-300 text-sm">
                    The maps below compare 2 floor plans of one trade conference held in 2009 and 2010
                </p>
            </div>

            {/* Maps Container */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                {/* 2009 Map */}
                <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <Map2009 />
                </div>

                {/* 2010 Map */}
                <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <Map2010 />
                </div>
            </div>
        </div>
    );
};

export default TradeConferenceMap;
