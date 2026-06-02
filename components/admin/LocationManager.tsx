"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { locationApi } from "@/services/api";
import { Trash2, Pencil, MapPin, Save, X, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import TagInput from "./ui/TagInput";

const MapPicker = dynamic(() => import("./ui/MapPicker"), {
    ssr: false,
    loading: () => (
        <div className="h-62.5 w-full bg-slate-100 rounded-lg animate-pulse flex items-center justify-center border border-slate-200">
            <span className="text-slate-400 text-sm font-bold">Đang tải bản đồ...</span>
        </div>
    )
});

export default function LocationManager() {
    const [locations, setLocations] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const data = await locationApi.getAll();
        setLocations(data);
    };

    const handleEdit = (loc: any) => {
        setEditingId(loc._id);
        setName(loc.name);
        setAddress(loc.address_hint);
        setLong(loc.location.coordinates[0]);
        setLat(loc.location.coordinates[1]);
        setItems(loc.accepted_items || []);
        document.getElementById('loc-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setName(""); setAddress(""); setLat(""); setLong(""); setItems([]);
    };

    const handleGetGPS = () => {
        if ("geolocation" in navigator) {
            toast.loading("Đang lấy tọa độ...", { id: "gps" });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude.toFixed(6));
                    setLong(position.coords.longitude.toFixed(6));
                    toast.success("Đã lấy vị trí thành công!", { id: "gps" });
                },
                (error) => {
                    toast.error("Vui lòng cho phép quyền truy cập vị trí!", { id: "gps" });
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!lat || !long) {
            toast.error("Vui lòng chọn tọa độ trên bản đồ!");
            return;
        }

        const payload = {
            name,
            address_hint: address,
            type: "SCRAP_DEALER",
            location: {
                type: "Point",
                coordinates: [parseFloat(long), parseFloat(lat)]
            },
            accepted_items: items
        };

        let res;
        if (editingId) res = await locationApi.update(editingId, payload);
        else res = await locationApi.create(payload);

        if (res) {
            toast.success(editingId ? "Đã cập nhật!" : "Đã thêm mới!");
            handleCancel();
            fetchData();
        } else {
            toast.error("Lỗi lưu dữ liệu");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa địa điểm này?")) {
            await locationApi.delete(id);
            fetchData();
            toast.success("Đã xóa");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI: FORM */}
            <div className="lg:col-span-1" id="loc-form">
                <div className={`p-6 rounded-xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"}`}>
                            {editingId ? <Pencil size={20} /> : <MapPin size={20} />}
                            {editingId ? "Sửa địa điểm" : "Thêm điểm thu gom"}
                        </h3>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">
                                <X size={14} /> Hủy
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên địa điểm *</label>
                            <input className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="VD: Vựa ve chai Cô Ba" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ hiển thị *</label>
                            <input className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="VD: 123 Nguyễn Văn Linh..." value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>

                        {/* KHU VỰC BẢN ĐỒ & TỌA ĐỘ */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Tọa độ Bản đồ *</label>
                                <button type="button" onClick={handleGetGPS} className="text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold flex items-center gap-1 hover:bg-green-200 transition shadow-sm">
                                    <Navigation size={12} /> Lấy vị trí tôi
                                </button>
                            </div>

                            {/* Gọi Bản đồ vào đây */}
                            <MapPicker
                                lat={lat}
                                lng={long}
                                onChange={(newLat, newLng) => {
                                    setLat(newLat);
                                    setLong(newLng);
                                }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">Vĩ độ (Lat)</span>
                                    <input className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Trống" value={lat} onChange={e => setLat(e.target.value)} required />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">Kinh độ (Long)</span>
                                    <input className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Trống" value={long} onChange={e => setLong(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <TagInput
                            label="Vật liệu thu mua"
                            tags={items}
                            onChange={setItems}
                            placeholder="VD: Sắt, Nhựa..."
                        />

                        <button type="submit" className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg ${editingId ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"}`}>
                            <Save size={18} /> {editingId ? "Cập nhật dữ liệu" : "Lưu điểm thu gom"}
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: LIST */}
            <div className="lg:col-span-2">
                {/* GIAO DIỆN BẢNG (DESKTOP) */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                            <tr>
                                <th className="p-4">Địa điểm & Địa chỉ</th>
                                <th className="p-4">Tọa độ</th>
                                <th className="p-4">Thu mua</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {locations.map((loc) => (
                                <tr key={loc._id} className={`transition group ${editingId === loc._id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-2 bg-green-100 rounded-full text-green-600 shrink-0"><MapPin size={16} /></div>
                                            <span className="font-bold text-slate-800 text-base">{loc.name}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 pl-10 leading-snug">{loc.address_hint}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block border border-slate-200 mt-1">
                                            {loc.location.coordinates[1].toFixed(4)},<br />{loc.location.coordinates[0].toFixed(4)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {loc.accepted_items.map((i: string, idx: number) => (
                                                <span key={idx} className="text-[10px] px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md font-semibold">
                                                    {i}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right align-top">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                            <button onClick={() => handleEdit(loc)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(loc._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* GIAO DIỆN CARD (MOBILE) */}
                <div className="md:hidden space-y-4">
                    {locations.map((loc) => (
                        <div key={loc._id} className={`bg-white p-4 rounded-2xl shadow-sm border ${editingId === loc._id ? "border-blue-300" : "border-slate-200"}`}>
                            <div className="flex items-start gap-3 mb-3 border-b border-slate-100 pb-3">
                                <div className="p-2.5 bg-green-100 rounded-full text-green-600 shrink-0"><MapPin size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{loc.name}</h4>
                                    <p className="text-sm text-slate-500 leading-snug mt-0.5">{loc.address_hint}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Thu mua:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {loc.accepted_items.map((i: string, idx: number) => (
                                        <span key={idx} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md font-semibold">
                                            {i}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    {loc.location.coordinates[1].toFixed(4)}, {loc.location.coordinates[0].toFixed(4)}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(loc)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                    <button onClick={() => handleDelete(loc._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}