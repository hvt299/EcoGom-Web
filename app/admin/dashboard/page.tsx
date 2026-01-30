"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, MapPin, Calendar, Trash2, LayoutDashboard } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Overview from "./components/Overview";
import WasteManager from "./components/WasteManager";
import LocationManager from "./components/LocationManager";
import ScheduleManager from "./components/ScheduleManager";

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'wastes' | 'schedules' | 'locations'>('overview');

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        if (!isAdmin) {
            router.push("/admin");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Toaster đặt ở đây để dùng chung cho mọi tab */}
            <Toaster position="top-right" />

            {/* Navbar chung */}
            <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Package className="text-green-400" />
                    <span>EcoGom Admin</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-2 rounded hover:bg-slate-700 transition">
                    <LogOut size={16} /> <span className="hidden md:inline">Đăng xuất</span>
                </button>
            </nav>

            {/* Tabs Menu Navigation */}
            <div className="max-w-6xl mx-auto mt-6 px-6">
                <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
                            activeTab === 'overview' 
                            ? 'text-green-600 border-b-2 border-green-600' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <LayoutDashboard size={18} /> Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('wastes')}
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'wastes'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <Trash2 size={18} /> Quản lý Rác
                    </button>
                    <button
                        onClick={() => setActiveTab('schedules')}
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'schedules'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <Calendar size={18} /> Lịch thu gom
                    </button>
                    <button
                        onClick={() => setActiveTab('locations')}
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'locations'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <MapPin size={18} /> Điểm thu gom
                    </button>
                </div>
            </div>

            {/* Nội dung chính (Thay đổi theo Tab) */}
            <div className="max-w-6xl mx-auto p-6">
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'wastes' && <WasteManager />}
                {activeTab === 'schedules' && <ScheduleManager />}
                {activeTab === 'locations' && <LocationManager />}
            </div>
        </div>
    );
}