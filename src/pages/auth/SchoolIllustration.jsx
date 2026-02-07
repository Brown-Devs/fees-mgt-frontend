export default function SchoolIllustration({ className }) {
    return (
        <svg
            viewBox="0 0 900 500"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="none"
        >

            {/* Soft background shapes */}
            <ellipse cx="700" cy="220" rx="140" ry="90" fill="#e9f2ff" />
            <ellipse cx="180" cy="250" rx="160" ry="110" fill="#e6efff" />

            {/* Desk */}
            <rect x="160" y="300" width="360" height="22" rx="8" fill="#c9d9f5" />
            <rect x="180" y="320" width="320" height="16" rx="8" fill="#b7c9ec" />

            {/* Laptop */}
            <rect x="260" y="240" width="120" height="70" rx="6" fill="#ffffff" stroke="#b6c8eb" />
            <rect x="260" y="240" width="120" height="12" fill="#e8f1ff" />

            {/* Screen charts */}
            <rect x="275" y="260" width="14" height="32" rx="2" fill="#4f8cff" />
            <rect x="295" y="270" width="14" height="22" rx="2" fill="#7aa8ff" />
            <rect x="315" y="255" width="14" height="37" rx="2" fill="#4f8cff" />

            {/* Person sitting */}
            <circle cx="320" cy="215" r="18" fill="#f4c7a5" />
            <rect x="300" y="235" width="40" height="48" rx="14" fill="#5b8cff" />

            {/* Standing person */}
            <circle cx="520" cy="210" r="18" fill="#f2c4a4" />
            <rect x="500" y="230" width="40" height="60" rx="14" fill="#f3a95f" />
            <rect x="510" y="260" width="20" height="40" rx="8" fill="#d48845" />

            {/* Tablet */}
            <rect x="535" y="255" width="20" height="26" rx="3" fill="#ffffff" stroke="#c7d6f2" />

            {/* Foreground fade */}
            <rect
                x="0"
                y="0"
                width="900"
                height="500"
                fill="url(#fade)"
            />

            <defs>
                <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="#eef5ff" stopOpacity="0.6" />
                </linearGradient>
            </defs>
        </svg>
    );
}
