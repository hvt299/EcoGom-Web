"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Package, MapPin, Calendar, Trash2, LayoutDashboard } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        const token = localStorage.getItem("token");

        if (!isAdmin || !token) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        router.push("/login");
    };

    const isActive = (path: string) => pathname === path;

    if (!isAuthorized) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
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
                <div className="flex gap-2 border-b border-slate-200 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <Link
                        href="/admin"
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${isActive('/admin')
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-t-lg'
                            }`}
                    >
                        <LayoutDashboard size={18} /> Tổng quan
                    </Link>
                    <Link
                        href="/admin/wastes"
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${isActive('/admin/wastes')
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-t-lg'
                            }`}
                    >
                        <Trash2 size={18} /> Quản lý Rác
                    </Link>
                    <Link
                        href="/admin/schedules"
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${isActive('/admin/schedules')
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-t-lg'
                            }`}
                    >
                        <Calendar size={18} /> Lịch thu gom
                    </Link>
                    <Link
                        href="/admin/locations"
                        className={`px-4 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${isActive('/admin/locations')
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-t-lg'
                            }`}
                    >
                        <MapPin size={18} /> Điểm thu gom
                    </Link>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto p-6">
                {children}
            </div>
        </div>
    );
}