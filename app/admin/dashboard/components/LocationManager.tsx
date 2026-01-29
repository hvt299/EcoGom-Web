"use client";

import { useState, useEffect } from "react";
import { locationApi } from "@/services/api";
import { Trash2, Pencil, MapPin, Save, X, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function LocationManager() {
    const [locations, setLocations] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [items, setItems] = useState("");

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
        setItems(loc.accepted_items.join(", "));
        document.getElementById('loc-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setName(""); setAddress(""); setLat(""); setLong(""); setItems("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name,
            address_hint: address,
            type: "SCRAP_DEALER",
            location: {
                type: "Point",
                coordinates: [parseFloat(long), parseFloat(lat)]
            },
            accepted_items: items.split(",").map(i => i.trim()).filter(Boolean)
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
                <div className={`p-6 rounded-xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
                    }`}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"}`}>
                            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            {editingId ? "Sửa địa điểm" : "Thêm địa điểm"}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancel} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500">
                                <X size={14} /> Hủy
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên địa điểm *</label>
                            <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="VD: Vựa Cô Ba" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ hiển thị *</label>
                            <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="VD: Số 10 ngõ 5..." value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vĩ độ (Lat)</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="21.xxxx" value={lat} onChange={e => setLat(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kinh độ (Long)</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="105.xxxx" value={long} onChange={e => setLong(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thu mua (cách dấu phẩy)</label>
                            <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Giấy, Nhựa, Sắt..." value={items} onChange={e => setItems(e.target.value)} />
                        </div>

                        <button type="submit" className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg ${editingId
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                            }`}>
                            <Save size={18} /> {editingId ? "Cập nhật" : "Lưu dữ liệu"}
                        </button>
                    </form>
                    <p className="text-xs text-slate-400 mt-3 italic text-center">*Mẹo: Chuột phải trên Google Maps để lấy tọa độ</p>
                </div>
            </div>

            {/* CỘT PHẢI: LIST (Dạng Bảng) */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="p-4">Địa điểm & Địa chỉ</th>
                                    <th className="p-4">Tọa độ</th>
                                    <th className="p-4">Thu mua</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {locations.map((loc) => (
                                    <tr key={loc._id} className={`transition ${editingId === loc._id ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin size={14} className="text-green-600" />
                                                <span className="font-bold text-slate-800">{loc.name}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 pl-6">{loc.address_hint}</p>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-xs font-mono text-slate-600 bg-slate-100 p-1 rounded inline-block">
                                                {loc.location.coordinates[1].toFixed(4)}, {loc.location.coordinates[0].toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex flex-wrap gap-1">
                                                {loc.accepted_items.map((i: string, idx: number) => (
                                                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full">
                                                        {i}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(loc)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(loc._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}