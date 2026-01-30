"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon Rác (Xanh lá)
const wasteIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0 3px 2px rgba(0,0,0,0.3));">
    <path fill="#16a34a" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5" fill="white"/>
  </svg>`;

const wasteIcon = L.divIcon({
    className: "custom-waste-pin",
    html: wasteIconSvg,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
});

// Icon User (Xanh dương - Vị trí của bạn)
const userIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0 3px 2px rgba(0,0,0,0.3));">
    <path fill="#2563eb" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="3" fill="white"/>
    <circle cx="12" cy="9" r="1.5" fill="#2563eb"/>
  </svg>`;

const userIcon = L.divIcon({
    className: "custom-user-pin",
    html: userIconSvg,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
});

interface Location {
    _id: string;
    name: string;
    location: { coordinates: [number, number] }; // [Long, Lat]
    address_hint: string;
    type: string;
}

interface MapProps {
    locations: Location[];
    center: [number, number]; // [Lat, Long]
}

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 14, { duration: 2 });
    }, [lat, lng, map]);
    return null;
}

export default function Map({ locations, center }: MapProps) {
    return (
        <>
            {/* CSS inline để reset style cho divIcon */}
            <style jsx global>{`
                .custom-waste-pin, .custom-user-pin {
                    background: none !important;
                    border: none !important;
                }
            `}</style>

            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "300px", width: "100%", borderRadius: "12px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />

                <RecenterAutomatically lat={center[0]} lng={center[1]} />

                {/* Marker Của Bạn (Màu xanh dương) */}
                <Marker position={center} icon={userIcon}>
                    <Popup>
                        <b className="text-blue-600">Vị trí của bạn</b>
                    </Popup>
                </Marker>

                {/* Marker Điểm Thu Gom (Màu xanh lá) */}
                {locations.map((loc) => (
                    <Marker
                        key={loc._id}
                        position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                        icon={wasteIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block text-green-700">{loc.name}</strong>
                                <span className="text-xs text-gray-500">{loc.type}</span>
                                <p className="mt-1">{loc.address_hint}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
}