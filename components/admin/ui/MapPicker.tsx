"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Maximize2, Minimize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

import "@/components/Map/map.css";
import { wasteIcon, userIcon } from "@/components/Map/icons";
import ZoomAwareIslands from "@/components/Map/ZoomAwareIslands";

interface MapPickerProps {
    lat: string;
    lng: string;
    onChange: (lat: string, lng: string) => void;
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

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
    const map = useMapEvents({
        click(e) { onChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)); },
    });

    useEffect(() => {
        if (lat && lng) {
            const numLat = parseFloat(lat);
            const numLng = parseFloat(lng);
            if (!isNaN(numLat) && !isNaN(numLng)) {
                map.flyTo([numLat, numLng], map.getZoom(), { duration: 1.2, easeLinearity: 0.25 });
            }
        }
    }, [lat, lng, map]);

    return lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) ? (
        <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={wasteIcon} zIndexOffset={1000} />
    ) : null;
}

function AutoCenterToUser({ loc, shouldCenter }: { loc: [number, number] | null, shouldCenter: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (loc && shouldCenter) {
            map.flyTo(loc, 14, { duration: 1.2, easeLinearity: 0.25 });
        }
    }, [loc, shouldCenter, map]);
    return null;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    const defaultCenter: [number, number] = [16.0544, 108.2022];
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [myLocation, setMyLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMyLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => console.log("Không thể lấy vị trí ngầm:", error),
                { enableHighAccuracy: true, timeout: 5000 }
            );
        }
    }, []);

    return (
        <div className={`transition-all duration-300 bg-white ${isFullscreen
            ? "fixed inset-0 z-99999-screen h-screen rounded-none"
            : "relative h-62.5 w-full rounded-xl overflow-hidden border border-slate-200/60 shadow-sm z-0"
            }`}>
            {/* NÚT PHÓNG TO / THU NHỎ */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsFullscreen(!isFullscreen);
                }}
                className={`z-999999 bg-white p-2 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95 ${isFullscreen ? "fixed top-6 right-6" : "absolute top-2 right-2"
                    }`}
                title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
            >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Hướng dẫn gọn gàng */}
            {!isFullscreen && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-400 bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full shadow-sm text-[10px] font-medium pointer-events-none whitespace-nowrap">
                    👆 Click bản đồ để chọn
                </div>
            )}
            {isFullscreen && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-999999 bg-slate-800/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold pointer-events-none whitespace-nowrap">
                    👆 Click bản đồ để chọn tọa độ
                </div>
            )}

            <MapContainer
                center={defaultCenter}
                zoom={14}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                minZoom={3}
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
                <MapResizer />
                <MapZoomTracker />
                <ZoomAwareIslands />
                <LocationMarker lat={lat} lng={lng} onChange={onChange} />

                {/* Tự động bay về chấm xanh nếu form chưa có dữ liệu lat/lng */}
                <AutoCenterToUser loc={myLocation} shouldCenter={!lat && !lng} />

                {/* VỊ TRÍ CỦA ADMIN (CHẤM XANH NHẤP NHÁY) */}
                {myLocation && (
                    <Marker position={myLocation} icon={userIcon} zIndexOffset={500}>
                        <Popup className="modern-popup">
                            <div className="p-1 min-w-30 text-center">
                                <h3 className="font-bold text-blue-600 text-[14px]">Vị trí của bạn</h3>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}