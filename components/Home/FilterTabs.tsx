"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Layers, Recycle, Leaf, Trash2 } from "lucide-react";

const FILTER_TABS = [
    { id: "ALL", label: "Tất cả", icon: Layers, color: "bg-slate-800", border: "border-slate-800" },
    { id: "Chất thải rắn có khả năng tái sử dụng, tái chế", label: "Tái chế", icon: Recycle, color: "bg-green-600", border: "border-green-600" },
    { id: "Chất thải thực phẩm", label: "Thực phẩm", icon: Leaf, color: "bg-orange-600", border: "border-orange-600" },
    { id: "Chất thải rắn sinh hoạt khác", label: "Rác khác", icon: Trash2, color: "bg-red-600", border: "border-red-600" },
];

interface FilterTabsProps {
    activeFilter: string;
    setActiveFilter: (val: string) => void;
}

export default function FilterTabs({ activeFilter, setActiveFilter }: FilterTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative mb-6 group">
            {/* Nút lùi (Trái) */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 flex items-center">
                    <button
                        onClick={() => scroll("left")}
                        className="bg-white shadow-md border border-slate-100 p-1.5 rounded-full text-slate-600 hover:text-green-600 hover:border-green-200 transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>
            )}

            {/* CONTAINER TABS */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto pb-2 px-1 scroll-smooth select-none 
        /* --- ẨN THANH CUỘN (Magic CSS) --- */
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {FILTER_TABS.map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border shrink-0
                ${isActive
                                    ? `${tab.color} text-white ${tab.border} shadow-lg shadow-slate-200 scale-105`
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                }
              `}
                        >
                            <tab.icon size={16} strokeWidth={2.5} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Nút tiến (Phải) */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end">
                    <button
                        onClick={() => scroll("right")}
                        className="bg-white shadow-md border border-slate-100 p-1.5 rounded-full text-slate-600 hover:text-green-600 hover:border-green-200 transition-all active:scale-95"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}