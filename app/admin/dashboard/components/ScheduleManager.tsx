"use client";

import { useState, useEffect } from "react";
import { scheduleApi } from "@/services/api";
import { Trash2, Pencil, Calendar, Save, X, Plus, Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [village, setVillage] = useState("");
    const [ward, setWard] = useState("");

    const [scheduleList, setScheduleList] = useState([
        { day_of_week: 3, time_slot: "16:00", waste_type: "Hữu cơ" },
        { day_of_week: 5, time_slot: "16:00", waste_type: "Vô cơ" }
    ]);

    const [specialList, setSpecialList] = useState<any[]>([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const data = await scheduleApi.getAll();
        setSchedules(data);
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
        setScheduleList([
            { day_of_week: 3, time_slot: "16:00", waste_type: "Hữu cơ" },
            { day_of_week: 5, time_slot: "16:00", waste_type: "Vô cơ" }
        ]);
        setSpecialList([]);
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
        name: "Nghỉ Lễ", start_date: "", end_date: "", is_cancelled: true, note: ""
    }]);
    const removeSpecialRow = (index: number) => {
        const newList = [...specialList];
        newList.splice(index, 1);
        setSpecialList(newList);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        if (confirm("Xóa lịch của thôn này?")) {
            await scheduleApi.delete(id);
            fetchData();
            toast.success("Đã xóa");
        }
    };

    const getDayName = (day: number) => ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CỘT TRÁI: FORM */}
            <div id="sch-form">
                <div className={`p-6 rounded-xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
                    }`}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"}`}>
                            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            {editingId ? "Sửa lịch thôn" : "Tạo lịch thôn mới"}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancel} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500">
                                <X size={14} /> Hủy
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Thôn *</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="VD: Thôn Đông" value={village} onChange={e => setVillage(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Xã/Phường *</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Tên Xã" value={ward} onChange={e => setWard(e.target.value)} required />
                            </div>
                        </div>

                        {/* PHẦN 1: LỊCH ĐỊNH KỲ */}
                        <div className="border-t border-slate-200 pt-3">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                <Clock size={14} /> Lịch định kỳ hàng tuần
                            </label>
                            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {scheduleList.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <select
                                            className="p-2 border border-slate-300 rounded-lg text-sm w-20 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                            value={item.day_of_week}
                                            onChange={(e) => updateRow(index, 'day_of_week', e.target.value)}
                                        >
                                            {[0, 1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
                                        </select>
                                        <input
                                            className="p-2 border border-slate-300 rounded-lg text-sm w-20 focus:ring-2 focus:ring-green-500 outline-none"
                                            value={item.time_slot}
                                            placeholder="16:00"
                                            onChange={(e) => updateRow(index, 'time_slot', e.target.value)}
                                        />
                                        <input
                                            className="p-2 border border-slate-300 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="Loại rác..."
                                            value={item.waste_type}
                                            onChange={(e) => updateRow(index, 'waste_type', e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeRow(index)} className="text-slate-400 hover:text-red-500">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addRow} className="text-sm font-bold text-blue-600 mt-2 hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Thêm khung giờ
                                </button>
                            </div>
                        </div>

                        {/* PHẦN 2: SỰ KIỆN ĐẶC BIỆT (MỚI) */}
                        <div className="border-t border-slate-200 pt-3">
                            <label className="text-xs font-bold text-orange-600 uppercase mb-2 flex items-center gap-1">
                                <AlertTriangle size={14} /> Sự kiện / Nghỉ lễ (Ghi đè lịch thường)
                            </label>
                            <div className="space-y-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                {specialList.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-2 border-b border-orange-200 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                                        <div className="flex gap-2">
                                            <input
                                                className="p-2 border border-orange-200 rounded text-sm flex-1"
                                                placeholder="Tên sự kiện (VD: Tết Nguyên Đán)"
                                                value={item.name}
                                                onChange={(e) => updateSpecialRow(index, 'name', e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeSpecialRow(index)} className="text-orange-400 hover:text-red-500">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="date" className="p-2 border border-orange-200 rounded text-sm w-1/2"
                                                value={item.start_date} onChange={(e) => updateSpecialRow(index, 'start_date', e.target.value)} />
                                            <input type="date" className="p-2 border border-orange-200 rounded text-sm w-1/2"
                                                value={item.end_date} onChange={(e) => updateSpecialRow(index, 'end_date', e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={item.is_cancelled}
                                                onChange={(e) => updateSpecialRow(index, 'is_cancelled', e.target.checked)}
                                                id={`cancel-${index}`}
                                            />
                                            <label htmlFor={`cancel-${index}`} className="text-sm text-slate-700">Ngưng thu gom?</label>

                                            <input className="p-2 border border-orange-200 rounded text-sm flex-1 ml-2"
                                                placeholder="Ghi chú (VD: Nghỉ bù...)"
                                                value={item.note}
                                                onChange={(e) => updateSpecialRow(index, 'note', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addSpecialRow} className="text-sm font-bold text-orange-600 mt-2 hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Thêm kỳ nghỉ / Sự kiện
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg ${editingId
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                            }`}>
                            <Save size={18} /> {editingId ? "Cập nhật Lịch" : "Lưu Lịch Mới"}
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: LIST */}
            <div className="space-y-4">
                {schedules.map(sch => (
                    <div key={sch._id} className={`bg-white p-5 rounded-xl border shadow-sm transition ${editingId === sch._id ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}`}>
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <Calendar size={18} className="text-green-600" />
                                    {sch.village_name}
                                </h4>
                                <p className="text-sm text-slate-500 ml-6">{sch.ward}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(sch)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(sch._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Lịch thường */}
                        <div className="space-y-2 mb-3">
                            {sch.standard_schedule.map((s: any, idx: number) => (
                                <div key={idx} className="flex items-center text-sm gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <span className="font-bold w-12 text-slate-700">{getDayName(s.day_of_week)}</span>
                                    <div className="flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                                        <Clock size={12} /> {s.time_slot}
                                    </div>
                                    <span className="text-slate-600 flex-1">{s.waste_type}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sự kiện đặc biệt (Hiển thị preview) */}
                        {sch.special_events && sch.special_events.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-100">
                                <p className="text-xs font-bold text-orange-600 mb-1">Sự kiện sắp tới:</p>
                                {sch.special_events.map((ev: any, idx: number) => (
                                    <div key={idx} className="text-xs text-orange-800 bg-orange-50 p-1.5 rounded mb-1 last:mb-0 border border-orange-100">
                                        <span className="font-bold">{ev.name}</span>
                                        {ev.is_cancelled && <span className="text-red-600 ml-1">(Nghỉ)</span>}
                                        <br />
                                        <span className="opacity-80">
                                            {new Date(ev.start_date).toLocaleDateString('vi-VN')} - {new Date(ev.end_date).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}