"use client";

import { Search } from "lucide-react";
import { Waste } from "@/types/waste";
import { getWasteCategoryStyle, formatCurrency } from "@/utils/wasteHelper";

interface WasteListProps {
    wastes: Waste[];
    loading: boolean;
    onSelect: (waste: Waste) => void;
    onClearFilter: () => void;
    isFiltered: boolean;
}

export default function WasteList({ wastes, loading, onSelect, onClearFilter, isFiltered }: WasteListProps) {
    if (!loading && wastes.length === 0) {
        return (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-300 w-10 h-10" />
                </div>
                <p className="text-slate-500 font-medium text-lg">Không tìm thấy kết quả</p>
                <p className="text-slate-400 text-sm mb-4">Thử từ khóa khác hoặc thay đổi bộ lọc</p>

                {isFiltered && (
                    <button
                        onClick={onClearFilter}
                        className="bg-white border border-slate-200 px-6 py-2 rounded-full text-sm font-bold text-green-600 hover:bg-green-50 hover:border-green-200 transition"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {wastes.map((waste) => {
                const styleParams = getWasteCategoryStyle(waste.category);
                const Icon = styleParams.icon;

                return (
                    <div
                        key={waste._id}
                        onClick={() => onSelect(waste)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 group-hover:text-green-700 transition">{waste.name}</h3>
                            <span
                                style={{ backgroundColor: styleParams.bgColor, color: styleParams.color }}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shrink-0"
                            >
                                <Icon size={12} /> {styleParams.label}
                            </span>
                        </div>

                        {waste.local_names.length > 0 && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-1 italic">
                                Gọi là: {waste.local_names.join(", ")}
                            </p>
                        )}

                        <div className="flex justify-between border-t border-slate-50 pt-3 text-sm">
                            <span className="text-slate-400 font-medium">Giá tham khảo:</span>
                            <span className="font-bold text-green-600">
                                {waste.estimated_price > 0
                                    ? `${formatCurrency(waste.estimated_price)} / ${waste.unit}`
                                    : "---"}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}