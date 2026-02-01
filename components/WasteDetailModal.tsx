"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle2, ImageIcon } from "lucide-react";
import { Waste } from "@/types/waste";
import { getWasteCategoryStyle, formatCurrency } from "@/utils/wasteHelper";

interface WasteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    waste: Waste | null;
}

export default function WasteDetailModal({ isOpen, onClose, waste }: WasteDetailModalProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!isOpen || !waste) return null;

    const styleParams = getWasteCategoryStyle(waste.category);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">

                {/* 1. HEADER ẢNH (Image Gallery) */}
                <div className="relative h-64 bg-slate-100 group">
                    {waste.images && waste.images.length > 0 ? (
                        <img
                            src={waste.images[activeImage]}
                            alt={waste.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={48} className="opacity-20 mb-2" />
                            <span className="text-sm">Không có ảnh minh họa</span>
                        </div>
                    )}

                    {/* Nút đóng */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Selector (Nếu có nhiều ảnh) */}
                    {waste.images && waste.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-full">
                            {waste.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. BODY INFO */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Header Info */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 leading-tight">{waste.name}</h2>
                                {waste.local_names?.length > 0 && (
                                    <p className="text-slate-500 text-sm mt-1">
                                        Tên gọi khác: {waste.local_names.join(", ")}
                                    </p>
                                )}
                            </div>

                            {/* Badge Phân Loại */}
                            <div className="flex flex-col items-end shrink-0">
                                <span
                                    style={{ backgroundColor: styleParams.bgColor, color: styleParams.color }}
                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                                >
                                    <styleParams.icon size={14} />
                                    {styleParams.label}
                                </span>
                            </div>
                        </div>

                        {/* Giá tham khảo */}
                        <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <span className="text-slate-400 text-sm font-medium">Giá tham khảo:</span>
                            <span className="text-green-600 font-bold text-lg">
                                {waste.estimated_price > 0
                                    ? `${formatCurrency(waste.estimated_price)} / ${waste.unit}`
                                    : "---"}
                            </span>
                        </div>
                    </div>

                    {/* 3. QUY TRÌNH XỬ LÝ (Steps) */}
                    {waste.processing_steps && waste.processing_steps.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wide">
                                <CheckCircle2 className="text-green-600" size={18} /> Hướng dẫn xử lý
                            </h3>

                            <div className="space-y-4 relative pl-2">
                                {/* Đường kẻ dọc nối các bước */}
                                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-100" />

                                {waste.processing_steps.map((step, idx) => (
                                    <div key={idx} className="relative flex gap-4">
                                        {/* Số thứ tự */}
                                        <div className="w-10 h-10 rounded-full bg-white border-2 border-green-100 text-green-600 font-bold flex items-center justify-center shrink-0 z-10 shadow-sm text-sm">
                                            {idx + 1}
                                        </div>

                                        {/* Nội dung bước */}
                                        <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <p className="text-slate-700 leading-relaxed text-sm">{step.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                            <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-orange-700 text-sm">Chưa có hướng dẫn</h4>
                                <p className="text-orange-600/80 text-xs mt-1">
                                    Hiện tại chưa có quy trình xử lý cụ thể cho loại rác này. Vui lòng tham khảo hướng dẫn chung của địa phương.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition shadow-lg shadow-slate-200"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
}