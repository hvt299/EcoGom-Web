"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { userIcon, wasteIcon } from "./icons";
import ZoomAwareIslands from "./ZoomAwareIslands";

interface Location {
    _id: string;
    name: string;
    location: { coordinates: [number, number] };
    address_hint: string;
    type: string;
}

interface MapProps {
    locations: Location[];
    center: [number, number];
}

function MapZoomTracker() {
    const map = useMap();

    useEffect(() => {
        map.getContainer().style.setProperty('--map-zoom', map.getZoom().toString());
    }, [map]);

    useMapEvents({
        zoom: () => {
            map.getContainer().style.setProperty('--map-zoom', map.getZoom().toString());
        }
    });

    return null;
}

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 14, {
            duration: 1.2,
            easeLinearity: 0.25
        });
    }, [lat, lng, map]);
    return null;
}

export default function Map({ locations, center }: MapProps) {
    return (
        <div className="rounded-3xl overflow-hidden border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40 isolate">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "400px", width: "100%", zIndex: 1 }}
                minZoom={3}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap &copy; CARTO'
                />

                <MapZoomTracker />
                <RecenterAutomatically lat={center[0]} lng={center[1]} />
                <ZoomAwareIslands />

                {/* 1. TẦNG GIỮA: USER MARKER (zIndex: 500) */}
                {/* Giảm zIndex xuống 500 để nó nằm dưới các điểm thu gom rác */}
                <Marker position={center} icon={userIcon} zIndexOffset={500}>
                    <Popup className="modern-popup">
                        <div className="p-1 min-w-30 text-center">
                            <h3 className="font-bold text-blue-600 text-[14px]">Vị trí của bạn</h3>
                        </div>
                    </Popup>
                </Marker>

                {/* 2. TẦNG TRÊN CÙNG: WASTE MARKER (zIndex: 1000) */}
                {locations.map((loc) => (
                    <Marker
                        key={loc._id}
                        position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                        icon={wasteIcon}
                        zIndexOffset={1000} /* LUÔN NỔI LÊN TRÊN USER */
                        riseOnHover={true}  /* Tự động nảy lên lớp cao nhất khi trỏ chuột vào */
                    >
                        <Popup className="modern-popup">
                            <div className="w-55">
                                <div className="border-b border-slate-100 pb-2 mb-2">
                                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight mb-1">
                                        {loc.name}
                                    </h3>
                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded">
                                        {loc.type}
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-snug text-[12px]">{loc.address_hint}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}