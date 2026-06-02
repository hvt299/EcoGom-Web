"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Maximize2, Minimize2 } from "lucide-react";
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

function MapResizer() {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => map.invalidateSize());
        resizeObserver.observe(map.getContainer());
        return () => resizeObserver.disconnect();
    }, [map]);
    return null;
}

function MapZoomTracker() {
    const map = useMap();
    useEffect(() => { map.getContainer().style.setProperty('--map-zoom', map.getZoom().toString()); }, [map]);
    useMapEvents({ zoom: () => { map.getContainer().style.setProperty('--map-zoom', map.getZoom().toString()); } });
    return null;
}

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => { map.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.25 }); }, [lat, lng, map]);
    return null;
}

export default function Map({ locations, center }: MapProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stickyParent = mapWrapperRef.current?.closest('.sticky') as HTMLElement;

        if (isFullscreen) {
            document.body.style.overflow = "hidden";
            if (stickyParent) stickyParent.style.zIndex = "999999";
        } else {
            document.body.style.overflow = "auto";
            if (stickyParent) stickyParent.style.zIndex = "";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isFullscreen]);

    return (
        <div
            ref={mapWrapperRef}
            className={`transition-all duration-300 isolate bg-white ${isFullscreen
                    ? "fixed inset-0 z-999999 w-screen h-screen rounded-none m-0 p-0"
                    : "relative h-100 rounded-3xl overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-200/40 z-0"
                }`}>
            {/* NÚT PHÓNG TO / THU NHỎ */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsFullscreen(!isFullscreen);
                }}
                className={`z-9999999 bg-white p-2.5 rounded-xl shadow-md hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 ${isFullscreen ? "fixed top-6 right-6" : "absolute top-4 right-4"
                    }`}
                title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
            >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            {/* Bản đồ luôn ép 100% kích thước của Div cha */}
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                minZoom={3}
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />

                <MapResizer />
                <MapZoomTracker />
                <RecenterAutomatically lat={center[0]} lng={center[1]} />
                <ZoomAwareIslands />

                <Marker position={center} icon={userIcon} zIndexOffset={500}>
                    <Popup className="modern-popup">
                        <div className="p-1 min-w-30 text-center">
                            <h3 className="font-bold text-blue-600 text-[14px]">Vị trí của bạn</h3>
                        </div>
                    </Popup>
                </Marker>

                {locations.map((loc) => (
                    <Marker key={loc._id} position={[loc.location.coordinates[1], loc.location.coordinates[0]]} icon={wasteIcon} zIndexOffset={1000} riseOnHover={true}>
                        <Popup className="modern-popup">
                            <div className="w-55">
                                <div className="border-b border-slate-100 pb-2 mb-2">
                                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight mb-1">{loc.name}</h3>
                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded">{loc.type}</span>
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