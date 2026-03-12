import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Crosshair, MapPin } from 'lucide-react';

// Fix for default marker icon in Leaflet
try {
    if (typeof window !== 'undefined' && L.Icon && L.Icon.Default) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }
} catch (e) {
    console.error("Leaflet icon initialization error:", e);
}

const LocationPicker = ({ value, onChange }) => {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstance.current) {
            const initialLat = parseFloat(value?.lat) || 20.5937;
            const initialLng = parseFloat(value?.lng) || 78.9629;

            mapInstance.current = L.map(mapContainerRef.current, {
                center: [initialLat, initialLng],
                zoom: 13,
                scrollWheelZoom: true
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapInstance.current);

            mapInstance.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                onChange({ lat, lng, address: value?.address || '' });
            });
        }

        // Cleanup on unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerInstance.current = null;
            }
        };
    }, []); // Only once on mount

    // Sync Marker and Position
    useEffect(() => {
        if (!mapInstance.current) return;

        const lat = parseFloat(value?.lat);
        const lng = parseFloat(value?.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            const pos = [lat, lng];

            if (!markerInstance.current) {
                markerInstance.current = L.marker(pos).addTo(mapInstance.current);
            } else {
                markerInstance.current.setLatLng(pos);
            }

            // Pan to position if it changes significantly or first time
            mapInstance.current.panTo(pos);
        } else if (markerInstance.current) {
            markerInstance.current.remove();
            markerInstance.current = null;
        }
    }, [value?.lat, value?.lng]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
                if (!isNaN(newPos.lat) && !isNaN(newPos.lng)) {
                    onChange({ ...newPos, address: display_name });
                    if (mapInstance.current) {
                        mapInstance.current.flyTo([newPos.lat, newPos.lng], 15);
                    }
                }
            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onChange({ lat: latitude, lng: longitude, address: value?.address || '' });
                    if (mapInstance.current) {
                        mapInstance.current.flyTo([latitude, longitude], 15);
                    }
                    setLoading(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLoading(false);
                }
            );
        }
    };

    return (
        <div className="lp-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="lp-search-wrap" style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 40px',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '13.5px',
                            outline: 'none',
                            background: '#f8fafc'
                        }}
                    />
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    style={{
                        padding: '0 16px',
                        borderRadius: '10px',
                        background: '#a855f7',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '13.5px'
                    }}
                >
                    {loading ? '...' : 'Search'}
                </button>
                <button
                    type="button"
                    onClick={useCurrentLocation}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 44, borderRadius: '10px', border: '1.5px solid #e2e8f0',
                        background: '#fff', color: '#64748b', cursor: 'pointer'
                    }}
                >
                    <Crosshair size={18} />
                </button>
            </div>

            <div
                ref={mapContainerRef}
                style={{ height: 350, borderRadius: 12, overflow: 'hidden', border: '1.5px solid #f1f5f9', background: '#f1f5f9', zIndex: 1 }}
            />

            {value?.lat && value?.lng ? (
                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <MapPin size={14} style={{ color: '#ec4899' }} />
                    <span>Pinned: {Number(value.lat).toFixed(6)}, {Number(value.lng).toFixed(6)}</span>
                    {value.address && <span style={{ marginLeft: 'auto', maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.address}</span>}
                </div>
            ) : (
                <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', margin: 0 }}>Click on the map to set shop location</p>
            )}
        </div>
    );
};

export default LocationPicker;
