"use client";
import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { ARCHIPELAGOS, VN_ISLANDS } from "@/data/islands";
import { createDotIcon, createLabelIcon } from "./icons";

export default function ZoomAwareIslands() {
    const [zoom, setZoom] = useState(5);

    useMapEvents({
        zoomend: (e) => setZoom(e.target.getZoom()),
    });

    const showLabels = zoom >= 3;
    const showMainIslands = zoom >= 5;
    const showAllIslands = zoom >= 7;

    return (
        <>
            {showLabels && ARCHIPELAGOS.map(arch => (
                <Marker key={arch.id} position={[arch.lat, arch.lng]} icon={createLabelIcon(arch.name)} interactive={false} />
            ))}

            {VN_ISLANDS.map((island) => {
                const isVisible = showAllIslands || (showMainIslands && island.isMain);
                if (!isVisible) return null;

                return (
                    <Marker key={island.id} position={[island.lat, island.lng]} icon={createDotIcon()}>
                        <Popup className="modern-popup">
                            <div className="w-75">
                                {/* Header */}
                                <div className="border-b border-slate-100 pb-3">
                                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight">
                                        {island.name_vi}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {island.name_en} — {island.region_en}
                                    </p>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-3">
                                    {island.occupied ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                            Đang bị chiếm đóng
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Việt Nam quản lý
                                        </span>
                                    )}
                                </div>

                                {/* Claimants */}
                                <div className="mt-3 text-[12px] leading-snug">
                                    <span className="block text-slate-500 mb-0.5">Các bên tranh chấp:</span>
                                    <span className="block text-slate-700 font-medium">{island.claimants}</span>
                                </div>

                                <p className="text-[12px] text-slate-600 leading-relaxed mt-3">
                                    {island.desc}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}