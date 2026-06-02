"use client";

import { useState, useEffect } from "react";

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    label?: string;
}

export default function CurrencyInput({ value, onChange, placeholder = "0", label }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        if (value === 0 && !displayValue) return;
        setDisplayValue(new Intl.NumberFormat("vi-VN").format(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");

        if (!rawValue) {
            setDisplayValue("");
            onChange(0);
            return;
        }

        const numValue = parseInt(rawValue, 10);
        setDisplayValue(new Intl.NumberFormat("vi-VN").format(numValue));
        onChange(numValue);
    };

    return (
        <div className="w-full">
            {label && <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    className="w-full p-2.5 pr-12 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-slate-800"
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={handleChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    VNĐ
                </span>
            </div>
        </div>
    );
}