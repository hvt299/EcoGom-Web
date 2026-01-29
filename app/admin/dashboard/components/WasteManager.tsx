"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save, Pencil, X } from "lucide-react";
import { Waste } from "@/types/waste";
import { wasteApi } from "@/services/api";
import toast from "react-hot-toast";

export default function WasteManager() {
    const [wastes, setWastes] = useState<Waste[]>([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCategory, setNewCategory] = useState("Tái chế");
    const [localNames, setLocalNames] = useState("");
    const [processStep, setProcessStep] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await wasteApi.getAll();
        setWastes(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newPrice) return toast.error("Vui lòng nhập Tên và Giá");

        const localNamesArray = localNames
            ? localNames.split(",").map(name => name.trim()).filter(Boolean)
            : [];

        const stepsArray = processStep
            ? [{ step_order: 1, content: processStep }]
            : [];

        const wasteData = {
            name: newName,
            estimated_price: newPrice,
            category: newCategory,
            local_names: localNamesArray,
            processing_steps: stepsArray,
            is_active: true
        };

        let result;
        if (editingId) {
            result = await wasteApi.update(editingId, wasteData);
            if (result) toast.success("Đã cập nhật thành công!");
        } else {
            result = await wasteApi.create(wasteData);
            if (result) toast.success("Đã thêm mới thành công!");
        }

        if (result) {
            handleCancelEdit();
            fetchData();
        } else {
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (item: Waste) => {
        setEditingId(item._id);
        setNewName(item.name);
        setNewPrice(item.estimated_price);
        setNewCategory(item.category);
        setLocalNames(item.local_names ? item.local_names.join(", ") : "");
        setProcessStep(item.processing_steps && item.processing_steps.length > 0
            ? item.processing_steps[0].content
            : "");

        const formElement = document.getElementById('waste-form-container');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewName(""); setNewPrice("");
        setLocalNames(""); setProcessStep("");
        setNewCategory("Tái chế");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            const success = await wasteApi.delete(id);
            if (success) {
                toast.success("Đã xóa thành công");
                fetchData();
                if (editingId === id) handleCancelEdit();
            } else {
                toast.error("Không xóa được.");
            }
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu rác...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI: FORM */}
            <div className="lg:col-span-1" id="waste-form-container">
                <div className={`p-6 rounded-xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
                    }`}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"
                            }`}>
                            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            {editingId ? "Cập nhật rác" : "Thêm rác mới"}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancelEdit} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500">
                                <X size={14} /> Hủy
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên rác *</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={newName} onChange={e => setNewName(e.target.value)} placeholder="VD: Sắt vụn" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giá (đ/kg) *</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="VD: 5.000" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên gọi khác</label>
                            <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                value={localNames} onChange={e => setLocalNames(e.target.value)} placeholder="VD: sắt gỉ, thép..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hướng dẫn xử lý</label>
                            <textarea className="w-full p-2 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-green-500 outline-none"
                                value={processStep} onChange={e => setProcessStep(e.target.value)} placeholder="VD: Gom gọn gàng..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                            <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                <option value="Tái chế">Tái chế</option>
                                <option value="Nguy hại">Nguy hại</option>
                                <option value="Khó phân hủy">Khó phân hủy</option>
                                <option value="Hữu cơ">Hữu cơ</option>
                            </select>
                        </div>

                        <button type="submit" className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg ${editingId
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                            }`}>
                            <Save size={18} /> {editingId ? "Cập nhật" : "Lưu dữ liệu"}
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: LIST */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="p-4">Tên & Bí danh</th>
                                    <th className="p-4">Giá & Xử lý</th>
                                    <th className="p-4">Loại</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {wastes.map((item) => (
                                    <tr key={item._id} className={`transition ${editingId === item._id ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                                        <td className="p-4 align-top">
                                            <p className="font-bold text-slate-800">{item.name}</p>
                                            {item.local_names?.length > 0 && <p className="text-xs text-slate-500 mt-1">{item.local_names.join(", ")}</p>}
                                        </td>
                                        <td className="p-4 align-top">
                                            <p className="text-green-600 font-bold text-sm">{item.estimated_price}</p>
                                            {item.processing_steps?.length > 0 && <p className="text-xs text-slate-400 mt-1 italic">HD: {item.processing_steps[0].content}</p>}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold border ${item.category === 'Tái chế' ? 'bg-green-50 text-green-700 border-green-100' :
                                                item.category === 'Nguy hại' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>{item.category}</span>
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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