"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Package, MapPin, Calendar, Trash2, LayoutDashboard, Menu, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        const token = localStorage.getItem("token");

        if (!isAdmin || !token) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        router.push("/login");
    };

    const isActive = (path: string) => pathname === path;

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const NavLinks = () => (
        <>
            <Link
                href="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin')
                        ? 'bg-green-500/10 text-green-400 border-r-4 border-green-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <LayoutDashboard size={20} /> Tổng quan
            </Link>
            <Link
                href="/admin/wastes"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin/wastes')
                        ? 'bg-green-500/10 text-green-400 border-r-4 border-green-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <Trash2 size={20} /> Quản lý Rác
            </Link>
            <Link
                href="/admin/schedules"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin/schedules')
                        ? 'bg-green-500/10 text-green-400 border-r-4 border-green-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <Calendar size={20} /> Lịch thu gom
            </Link>
            <Link
                href="/admin/locations"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin/locations')
                        ? 'bg-green-500/10 text-green-400 border-r-4 border-green-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <MapPin size={20} /> Điểm thu gom
            </Link>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden">
            <Toaster position="top-right" />

            {/* HEADER CHO MOBILE (Chỉ hiện trên màn hình nhỏ) */}
            <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Package className="text-green-400" size={24} />
                    <span>EcoGom Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* OVERLAY CHO MOBILE MENU (Làm tối nền khi mở menu) */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR BÊN TRÁI (Nền tối, chuẩn SaaS) */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-50 
                    w-72 md:w-64 bg-slate-900 text-white flex flex-col 
                    transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Logo & Đóng Menu Mobile */}
                <div className="p-6 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Package className="text-white" size={18} />
                        </div>
                        <span>EcoGom</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Các nút điều hướng */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Quản lý hệ thống</p>
                    <NavLinks />
                </nav>

                {/* Nút Đăng xuất ở đáy Sidebar */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* KHU VỰC NỘI DUNG CHÍNH (Bên phải Sidebar) */}
            <main className="flex-1 h-[calc(100vh-72px)] md:h-screen overflow-y-auto bg-slate-50/50">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}