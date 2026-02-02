"use client";

import { Search, Loader2, X } from "lucide-react";

interface SearchInputProps {
    keyword: string;
    setKeyword: (val: string) => void;
    loading: boolean;
}

export default function SearchInput({ keyword, setKeyword, loading }: SearchInputProps) {
    return (
        <div className="relative shadow-xl shadow-slate-200/50 rounded-2xl bg-white mb-6 z-20 group focus-within:ring-2 ring-green-500/20 transition-all">
            <input
                type="text"
                placeholder="Tìm rác (VD: pin, vỏ lon...)"
                className="w-full pl-12 pr-10 py-4 rounded-2xl border-none text-slate-700 font-medium placeholder:font-normal placeholder:text-slate-400 outline-none bg-transparent"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 group-focus-within:scale-110 transition-transform" />

            {/* Logic hiển thị: Nếu đang loading -> Hiện Spinner. Nếu không loading và có text -> Hiện nút X */}
            {loading ? (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
            ) : keyword ? (
                <button
                    onClick={() => setKeyword("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition"
                >
                    <X size={14} />
                </button>
            ) : null}
        </div>
    );
}