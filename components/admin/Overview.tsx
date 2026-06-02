"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Trash2, MapPin, Calendar, Eye, Sparkles } from "lucide-react";

export default function Overview() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await adminApi.getStats();
            if (data) setStats(data);
        };
        loadStats();
    }, []);

    if (!stats) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 space-y-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Đang tổng hợp số liệu...</p>
        </div>
    );

    const chartData = [
        { name: "Loại rác", value: stats.wasteCount, color: "#10b981" },
        { name: "Điểm gom", value: stats.locationCount, color: "#3b82f6" },
        { name: "Lịch trình", value: stats.scheduleCount, color: "#f59e0b" },
    ];

    const StatCard = ({ icon: Icon, label, value, gradient, shadow }: any) => (
        <div className={`relative overflow-hidden bg-linear-to-br ${gradient} p-6 rounded-2xl text-white shadow-lg ${shadow} transition-transform hover:-translate-y-1`}>
            {/* Background Icon (Phóng to, làm mờ) */}
            <Icon size={120} className="absolute -right-6 -bottom-6 opacity-20 text-white transform -rotate-12" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="p-3 bg-white/20 w-fit rounded-xl backdrop-blur-md mb-4 border border-white/20">
                    <Icon size={24} className="text-white" />
                </div>
                <h4 className="text-4xl font-extrabold mb-1">{value}</h4>
                <p className="text-white/80 font-medium">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Welcome Message */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        Xin chào, Quản trị viên! <Sparkles className="text-amber-500" size={24} />
                    </h2>
                    <p className="text-slate-500 mt-1">Dưới đây là tổng quan tình hình hoạt động của hệ thống EcoGom hôm nay.</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold text-sm border border-green-100 flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Hệ thống hoạt động ổn định
                </div>
            </div>

            {/* 1. Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Trash2} label="Loại Rác Đã Phân Loại" value={stats.wasteCount}
                    gradient="from-emerald-500 to-teal-600" shadow="shadow-emerald-500/30"
                />
                <StatCard
                    icon={MapPin} label="Điểm Thu Gom" value={stats.locationCount}
                    gradient="from-blue-500 to-indigo-600" shadow="shadow-blue-500/30"
                />
                <StatCard
                    icon={Calendar} label="Lịch Trình Quản Lý" value={stats.scheduleCount}
                    gradient="from-amber-500 to-orange-600" shadow="shadow-amber-500/30"
                />
                <StatCard
                    icon={Eye} label="Lượt Truy Cập (Giả lập)" value={stats.views}
                    gradient="from-purple-500 to-pink-600" shadow="shadow-purple-500/30"
                />
            </div>

            {/* 2. Chart */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-extrabold text-xl text-slate-800">Cơ cấu dữ liệu hệ thống</h3>
                    <p className="text-sm text-slate-500">Thống kê số lượng bản ghi đang hoạt động</p>
                </div>

                <div className="h-87.5 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontWeight: 600, fontSize: 14 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8' }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[8, 8, 0, 0]}
                                barSize={80}
                                animationDuration={1500}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}