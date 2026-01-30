"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Trash2, MapPin, Calendar, Eye } from "lucide-react";

export default function Overview() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await adminApi.getStats();
            if (data) setStats(data);
        };
        loadStats();
    }, []);

    if (!stats) return <div className="p-10 text-center text-slate-400">Đang tải số liệu...</div>;

    const chartData = [
        { name: "Loại rác", value: stats.wasteCount, color: "#16a34a" },
        { name: "Địa điểm", value: stats.locationCount, color: "#2563eb" },
        { name: "Lịch trình", value: stats.scheduleCount, color: "#f97316" },
    ];

    const StatCard = ({ icon: Icon, label, value, color }: any) => (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Trash2} label="Tổng loại rác" value={stats.wasteCount} color="#16a34a" />
                <StatCard icon={MapPin} label="Điểm thu gom" value={stats.locationCount} color="#2563eb" />
                <StatCard icon={Calendar} label="Lịch trình" value={stats.scheduleCount} color="#f97316" />
                <StatCard icon={Eye} label="Lượt truy cập" value={stats.views} color="#9333ea" />
            </div>

            {/* 2. Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Biểu đồ tăng trưởng dữ liệu</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
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