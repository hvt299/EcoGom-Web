"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
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

export default function Map({ locations, center }: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={14}
            style={{ height: "300px", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {locations.map((loc) => (
                <Marker
                    key={loc._id}
                    // Lưu ý: Leaflet dùng [Lat, Long], MongoDB trả về [Long, Lat] -> Phải đảo ngược
                    position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                    icon={icon}
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
    );
}