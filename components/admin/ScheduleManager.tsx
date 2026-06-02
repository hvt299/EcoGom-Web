"use client";

import { useState, useEffect } from "react";
import { scheduleApi } from "@/services/api";
import { Trash2, Pencil, Calendar, Save, X, Plus, Clock, AlertTriangle, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [village, setVillage] = useState("");
    const [ward, setWard] = useState("");
    const [scheduleList, setScheduleList] = useState<any[]>([]);
    const [specialList, setSpecialList] = useState<any[]>([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const data = await scheduleApi.getAll();
        setSchedules(data);
        setLoading(false);
    };

    const handleEdit = (sch: any) => {
        setEditingId(sch._id);
        setVillage(sch.village_name);
        setWard(sch.ward);
        setScheduleList(sch.standard_schedule || []);

        const formattedSpecial = (sch.special_events || []).map((e: any) => ({
            ...e,
            start_date: e.start_date ? e.start_date.split('T')[0] : '',
            end_date: e.end_date ? e.end_date.split('T')[0] : ''
        }));
        setSpecialList(formattedSpecial);

        document.getElementById('sch-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setVillage(""); setWard("");
        setScheduleList([]); setSpecialList([]);
    };

    const updateRow = (index: number, field: string, value: any) => {
        const newList = [...scheduleList];
        newList[index] = { ...newList[index], [field]: value };
        setScheduleList(newList);
    };
    const addRow = () => setScheduleList([...scheduleList, { day_of_week: 2, time_slot: "07:00", waste_type: "" }]);
    const removeRow = (index: number) => {
        const newList = [...scheduleList];
        newList.splice(index, 1);
        setScheduleList(newList);
    };

    const updateSpecialRow = (index: number, field: string, value: any) => {
        const newList = [...specialList];
        newList[index] = { ...newList[index], [field]: value };
        setSpecialList(newList);
    };
    const addSpecialRow = () => setSpecialList([...specialList, {
        name: "", start_date: "", end_date: "", is_cancelled: true, note: ""
    }]);
    const removeSpecialRow = (index: number) => {
        const newList = [...specialList];
        newList.splice(index, 1);
        setSpecialList(newList);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!village || !ward) return toast.error("Vui lòng nhập đủ Tên thôn và Xã/Phường!");

        const payload = {
            village_name: village,
            ward: ward,
            standard_schedule: scheduleList.map(s => ({ ...s, day_of_week: Number(s.day_of_week) })),
            special_events: specialList
        };

        let res;
        if (editingId) res = await scheduleApi.update(editingId, payload);
        else res = await scheduleApi.create(payload);

        if (res) {
            toast.success(editingId ? "Đã cập nhật!" : "Đã tạo lịch mới!");
            handleCancel();
            fetchData();
        } else {
            toast.error("Lỗi lưu lịch");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa toàn bộ lịch của thôn này?")) {
            await scheduleApi.delete(id);
            fetchData();
            toast.success("Đã xóa thành công");
        }
    };

    const getDayName = (day: number) => ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 space-y-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Đang tải dữ liệu lịch...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CỘT TRÁI: FORM (Chiếm 5 cột trên Desktop) */}
            <div className="lg:col-span-5" id="sch-form">
                <div className={`p-6 rounded-2xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"}`}>
                            {editingId ? <Pencil size={20} /> : <Calendar size={20} />}
                            {editingId ? "Sửa lịch thôn" : "Tạo lịch mới"}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancel} className="text-xs font-bold flex items-center gap-1 text-slate-500 hover:text-red-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 transition-colors">
                                <X size={14} /> Hủy sửa
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* THÔNG TIN CHUNG */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Thôn/Tổ *</label>
                                <input className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="VD: Thôn 1" value={village} onChange={e => setVillage(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Xã/Phường *</label>
                                <input className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="VD: Phường A" value={ward} onChange={e => setWard(e.target.value)} required />
                            </div>
                        </div>

                        {/* LỊCH ĐỊNH KỲ */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Clock size={16} className="text-green-600" /> Lịch gom hàng tuần
                                </label>
                                <button type="button" onClick={addRow} className="text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition">
                                    <Plus size={14} /> Thêm lịch
                                </button>
                            </div>

                            <div className="space-y-3">
                                {scheduleList.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">Chưa có lịch gom định kỳ nào.</p>}
                                {scheduleList.map((item, index) => (
                                    <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 relative group">
                                        <select
                                            className="p-2 border-none bg-slate-50 rounded-lg text-sm font-medium w-full sm:w-28 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                            value={item.day_of_week}
                                            onChange={(e) => updateRow(index, 'day_of_week', e.target.value)}
                                        >
                                            {[0, 1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
                                        </select>
                                        <input
                                            type="time"
                                            className="p-2 border border-slate-200 bg-white rounded-lg text-sm font-mono w-full sm:w-28 focus:ring-2 focus:ring-green-500 outline-none"
                                            value={item.time_slot}
                                            onChange={(e) => updateRow(index, 'time_slot', e.target.value)}
                                        />
                                        <input
                                            className="p-2 border border-slate-200 rounded-lg text-sm flex-1 w-full focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="Loại rác (VD: Hữu cơ)"
                                            value={item.waste_type}
                                            onChange={(e) => updateRow(index, 'waste_type', e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeRow(index)} className="absolute -right-2 -top-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 p-1 rounded-full shadow-sm sm:static sm:bg-transparent sm:border-none sm:shadow-none sm:opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SỰ KIỆN ĐẶC BIỆT */}
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-orange-800 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-orange-600" /> Ngày lễ / Đặc biệt
                                </label>
                                <button type="button" onClick={addSpecialRow} className="text-xs font-bold text-orange-700 bg-orange-200 hover:bg-orange-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition">
                                    <Plus size={14} /> Thêm sự kiện
                                </button>
                            </div>

                            <div className="space-y-3">
                                {specialList.length === 0 && <p className="text-xs text-orange-600/70 italic text-center py-2">Không có sự kiện ngoại lệ.</p>}
                                {specialList.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-3 bg-white p-3 rounded-lg border border-orange-200 relative group">
                                        <button type="button" onClick={() => removeSpecialRow(index)} className="absolute right-2 top-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <X size={16} />
                                        </button>

                                        <input
                                            className="p-2 border border-slate-200 rounded-lg text-sm w-[90%] focus:ring-2 focus:ring-orange-400 outline-none font-bold"
                                            placeholder="Tên sự kiện (VD: Tết Nguyên Đán)"
                                            value={item.name}
                                            onChange={(e) => updateSpecialRow(index, 'name', e.target.value)}
                                        />

                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Từ ngày</span>
                                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                                    value={item.start_date} onChange={(e) => updateSpecialRow(index, 'start_date', e.target.value)} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Đến ngày</span>
                                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                                    value={item.end_date} onChange={(e) => updateSpecialRow(index, 'end_date', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                            <label className="flex items-center gap-1.5 text-sm cursor-pointer font-medium text-red-600">
                                                <input type="checkbox" checked={item.is_cancelled} className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                                                    onChange={(e) => updateSpecialRow(index, 'is_cancelled', e.target.checked)}
                                                />
                                                Ngưng gom rác
                                            </label>
                                            <input className="p-1.5 px-3 border border-slate-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-orange-400 outline-none bg-slate-50"
                                                placeholder="Ghi chú (VD: Lịch bù vào mùng 4...)"
                                                value={item.note}
                                                onChange={(e) => updateSpecialRow(index, 'note', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg ${editingId ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"}`}>
                            <Save size={18} /> {editingId ? "Cập nhật Lịch" : "Lưu Lịch Mới"}
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: LIST (Chiếm 7 cột) */}
            <div className="lg:col-span-7">
                {schedules.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                        <h4 className="text-lg font-bold text-slate-700">Chưa có lịch thu gom nào</h4>
                        <p className="text-slate-500 text-sm mt-1">Sử dụng form bên trái để tạo lịch mới.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {schedules.map(sch => (
                            <div key={sch._id} className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md flex flex-col ${editingId === sch._id ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200"}`}>
                                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-green-100 rounded-md text-green-600"><MapPin size={16} /></div>
                                            <h4 className="font-bold text-lg text-slate-800">{sch.village_name}</h4>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 ml-9">{sch.ward}</p>
                                    </div>
                                    <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                        <button onClick={() => handleEdit(sch)} className="p-1.5 text-blue-600 hover:bg-white rounded-md transition"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(sch._id)} className="p-1.5 text-red-500 hover:bg-white rounded-md transition"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="p-5 flex-1">
                                    {/* Lịch thường */}
                                    <div className="space-y-2">
                                        {sch.standard_schedule?.length === 0 && <p className="text-xs text-slate-400">Chưa có lịch.</p>}
                                        {sch.standard_schedule.map((s: any, idx: number) => (
                                            <div key={idx} className="flex items-center text-sm gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                                <span className="font-extrabold w-10 text-slate-700 text-center">{getDayName(s.day_of_week)}</span>
                                                <div className="flex items-center gap-1.5 font-mono text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100 text-xs">
                                                    <Clock size={12} /> {s.time_slot}
                                                </div>
                                                <span className="text-slate-600 font-medium truncate flex-1">{s.waste_type}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sự kiện đặc biệt */}
                                    {sch.special_events && sch.special_events.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Sự kiện ngoại lệ:</p>
                                            <div className="space-y-2">
                                                {sch.special_events.map((ev: any, idx: number) => (
                                                    <div key={idx} className="text-xs text-orange-800 bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-bold">{ev.name}</span>
                                                            {ev.is_cancelled && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Ngưng gom</span>}
                                                        </div>
                                                        <div className="opacity-70 font-mono">
                                                            {ev.start_date && new Date(ev.start_date).toLocaleDateString('vi-VN')}
                                                            {ev.end_date && ` ➔ ${new Date(ev.end_date).toLocaleDateString('vi-VN')}`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}