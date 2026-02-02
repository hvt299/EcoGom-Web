"use client";

import { X, Check } from "lucide-react";

interface VillageModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupedVillages: Record<string, string[]>;
    selectedVillage: string;
    onSelect: (village: string) => void;
}

export default function VillageModal({
    isOpen,
    onClose,
    groupedVillages,
    selectedVillage,
    onSelect
}: VillageModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-green-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Chọn khu vực của bạn</h3>
                        <p className="text-xs text-slate-500">Vui lòng chọn đúng thôn để xem lịch chính xác nhất</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body: Grid Layout */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.keys(groupedVillages).map((ward) => (
                            <div key={ward} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="font-bold text-green-700 mb-3 uppercase text-xs tracking-wider border-b border-slate-200 pb-2">{ward}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {groupedVillages[ward].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => { onSelect(v); onClose(); }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${selectedVillage === v
                                                ? "bg-green-600 text-white shadow-md shadow-green-200"
                                                : "bg-white text-slate-600 border border-slate-200 hover:border-green-400 hover:text-green-600"
                                                }`}
                                        >
                                            {v}
                                            {selectedVillage === v && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}