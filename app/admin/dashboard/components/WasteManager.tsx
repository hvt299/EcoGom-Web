"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save, Pencil, X, ImageIcon, ListOrdered } from "lucide-react";
import { Waste } from "@/types/waste";
import { wasteApi } from "@/services/api";
import toast from "react-hot-toast";
import { formatCurrency, getWasteCategoryStyle } from "@/utils/wasteHelper";

export default function WasteManager() {
    const [wastes, setWastes] = useState<Waste[]>([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [newUnit, setNewUnit] = useState("kg");
    const [newPrice, setNewPrice] = useState<number>(0);
    const [newCategory, setNewCategory] = useState("Chất thải rắn có khả năng tái sử dụng, tái chế");
    const [localNames, setLocalNames] = useState("");
    const [processingSteps, setProcessingSteps] = useState<string[]>([""]);
    const [images, setImages] = useState<string[]>([]);

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await wasteApi.getAll();
        setWastes(data);
        setLoading(false);
    };

    const handleAddStep = () => {
        setProcessingSteps([...processingSteps, ""]);
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = processingSteps.filter((_, i) => i !== index);
        setProcessingSteps(newSteps);
    };

    const handleChangeStep = (index: number, value: string) => {
        const newSteps = [...processingSteps];
        newSteps[index] = value;
        setProcessingSteps(newSteps);
    };

    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleChangeImage = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return toast.error("Vui lòng nhập Tên rác");

        const localNamesArray = localNames
            ? localNames.split(",").map(name => name.trim()).filter(Boolean)
            : [];

        const stepsFormatted = processingSteps
            .filter(step => step.trim() !== "")
            .map((content, index) => ({
                step_order: index + 1,
                content: content
            }));

        const imagesFormatted = images.filter(img => img.trim() !== "");

        const wasteData = {
            name: newName,
            unit: newUnit,
            estimated_price: Number(newPrice),
            category: newCategory,
            local_names: localNamesArray,
            processing_steps: stepsFormatted,
            images: imagesFormatted,
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
        setNewUnit(item.unit || "kg");
        setNewPrice(item.estimated_price || 0);
        setNewCategory(item.category);
        setLocalNames(item.local_names ? item.local_names.join(", ") : "");

        if (item.processing_steps && item.processing_steps.length > 0) {
            setProcessingSteps(item.processing_steps.map(s => s.content));
        } else {
            setProcessingSteps([""]);
        }

        if (item.images && item.images.length > 0) {
            setImages(item.images);
        } else {
            setImages([]);
        }

        const formElement = document.getElementById('waste-form-container');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewName(""); setNewUnit("kg"); setNewPrice(0);
        setLocalNames(""); setProcessingSteps([""]); setImages([]);
        setNewCategory("Chất thải rắn có khả năng tái sử dụng, tái chế");
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
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                                <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                    <option value="Chất thải rắn có khả năng tái sử dụng, tái chế">Tái chế & Tái sử dụng</option>
                                    <option value="Chất thải thực phẩm">Rác thực phẩm</option>
                                    <option value="Chất thải rắn sinh hoạt khác">Rác sinh hoạt khác</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giá tiền (VNĐ)</label>
                                <input type="number" className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={newPrice} onChange={e => setNewPrice(Number(e.target.value))} placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn vị tính</label>
                                <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="kg, cái, chiếc..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên gọi khác</label>
                            <input className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                value={localNames} onChange={e => setLocalNames(e.target.value)} placeholder="VD: sắt gỉ, thép..." />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                                    <ImageIcon size={14} /> Ảnh minh họa (URL)
                                </label>
                                <button type="button" onClick={handleAddImage} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    <Plus size={12} /> Thêm ảnh
                                </button>
                            </div>
                            <div className="space-y-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                            {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={14} /></div>}
                                        </div>
                                        <input
                                            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            value={img}
                                            onChange={e => handleChangeImage(idx, e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {images.length === 0 && <p className="text-xs text-slate-400 italic">Chưa có ảnh nào.</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                                    <ListOrdered size={14} /> Hướng dẫn xử lý
                                </label>
                                <button type="button" onClick={handleAddStep} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    <Plus size={12} /> Thêm bước
                                </button>
                            </div>
                            <div className="space-y-2">
                                {processingSteps.map((step, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <span className="text-xs font-bold text-slate-400 mt-2.5 w-4">{idx + 1}.</span>
                                        <textarea
                                            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none h-16"
                                            value={step}
                                            onChange={e => handleChangeStep(idx, e.target.value)}
                                            placeholder={`Bước ${idx + 1}...`}
                                        />
                                        <button type="button" onClick={() => handleRemoveStep(idx)} className="text-slate-400 hover:text-red-500 mt-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                    <th className="p-4">Tên & Ảnh</th>
                                    <th className="p-4">Giá & Đơn vị</th>
                                    <th className="p-4">Phân loại</th>
                                    <th className="p-4">Quy trình</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {wastes.map((item) => (
                                    <tr key={item._id} className={`transition ${editingId === item._id ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                                        <td className="p-4 align-top">
                                            <div className="flex gap-3">
                                                {/* Hiển thị ảnh đại diện (ảnh đầu tiên) */}
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                    {item.images && item.images.length > 0 ? (
                                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.name}</p>
                                                    {item.local_names?.length > 0 && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.local_names.join(", ")}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <p className="text-green-600 font-bold text-sm">
                                                {item.estimated_price > 0 ? `${formatCurrency(item.estimated_price)}/${item.unit}` : "---"}
                                            </p>
                                        </td>
                                        <td className="p-4 align-top">
                                            {(() => {
                                                const style = getWasteCategoryStyle(item.category);
                                                return (
                                                    <span style={{
                                                        backgroundColor: style.bgColor,
                                                        color: style.color,
                                                        borderColor: style.borderColor,
                                                        borderWidth: 1
                                                    }} className="whitespace-nowrap px-2 py-1 text-xs rounded-full font-semibold border">
                                                        {style.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="whitespace-nowrap text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                {item.processing_steps?.length || 0} bước
                                            </span>
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