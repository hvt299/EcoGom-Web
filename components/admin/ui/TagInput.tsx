"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function TagInput({ tags, onChange, placeholder = "Nhập và ấn Enter...", label }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputValue.trim();

            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
            }
            setInputValue("");
        }

        if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full">
            {label && <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>}

            <div className="min-h-10.5 p-1.5 border border-slate-300 rounded-lg bg-white flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                {/* Hiển thị các Tags */}
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-xs font-semibold animate-in zoom-in duration-200"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:bg-green-200 p-0.5 rounded-full transition-colors text-green-600"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* Ô nhập liệu */}
                <input
                    type="text"
                    className="flex-1 min-w-30 bg-transparent outline-none text-sm text-slate-700 px-2 py-1 placeholder:text-slate-400"
                    placeholder={tags.length === 0 ? placeholder : ""}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">Nhấn Enter hoặc dấu phẩy (,) để thêm từ khóa.</p>
        </div>
    );
}