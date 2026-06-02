"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save, Pencil, X, ImageIcon, ListOrdered } from "lucide-react";
import { Waste } from "@/types/waste";
import { wasteApi } from "@/services/api";
import toast from "react-hot-toast";
import { formatCurrency, getWasteCategoryStyle } from "@/utils/wasteHelper";

import CurrencyInput from "./ui/CurrencyInput";
import TagInput from "./ui/TagInput";

export default function WasteManager() {
    const [wastes, setWastes] = useState<Waste[]>([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [newUnit, setNewUnit] = useState("kg");
    const [newPrice, setNewPrice] = useState<number>(0);
    const [newCategory, setNewCategory] = useState("Chất thải rắn có khả năng tái sử dụng, tái chế");

    const [localNames, setLocalNames] = useState<string[]>([]);

    const [processingSteps, setProcessingSteps] = useState<string[]>([""]);
    const [images, setImages] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const data = await wasteApi.getAll();
        setWastes(data);
        setLoading(false);
    };

    const handleAddStep = () => setProcessingSteps([...processingSteps, ""]);
    const handleRemoveStep = (index: number) => setProcessingSteps(processingSteps.filter((_, i) => i !== index));
    const handleChangeStep = (index: number, value: string) => {
        const newSteps = [...processingSteps];
        newSteps[index] = value;
        setProcessingSteps(newSteps);
    };

    const handleAddImage = () => setImages([...images, ""]);
    const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
    const handleChangeImage = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return toast.error("Vui lòng nhập Tên rác");

        const stepsFormatted = processingSteps
            .filter(step => step.trim() !== "")
            .map((content, index) => ({ step_order: index + 1, content: content }));

        const imagesFormatted = images.filter(img => img.trim() !== "");

        const wasteData = {
            name: newName,
            unit: newUnit,
            estimated_price: newPrice,
            category: newCategory,
            local_names: localNames,
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
        setLocalNames(item.local_names || []);

        setProcessingSteps(item.processing_steps?.length ? item.processing_steps.map(s => s.content) : [""]);
        setImages(item.images?.length ? item.images : []);

        document.getElementById('waste-form-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewName(""); setNewUnit("kg"); setNewPrice(0);
        setLocalNames([]); setProcessingSteps([""]); setImages([]);
        setNewCategory("Chất thải rắn có khả năng tái sử dụng, tái chế");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            const success = await wasteApi.delete(id);
            if (success) {
                toast.success("Đã xóa thành công");
                fetchData();
                if (editingId === id) handleCancelEdit();
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 space-y-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Đang tải dữ liệu rác...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI: FORM (Sử dụng UI mới) */}
            <div className="lg:col-span-1" id="waste-form-container">
                <div className={`p-6 rounded-xl shadow-sm border sticky top-6 transition-colors ${editingId ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${editingId ? "text-blue-700" : "text-slate-800"}`}>
                            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            {editingId ? "Cập nhật rác" : "Thêm rác mới"}
                        </h3>
                        {editingId && (
                            <button onClick={handleCancelEdit} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">
                                <X size={14} /> Hủy
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên rác *</label>
                                <input className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    value={newName} onChange={e => setNewName(e.target.value)} placeholder="VD: Sắt vụn" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn vị tính</label>
                                <input className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="kg, cái, chiếc..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                            <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                <option value="Chất thải rắn có khả năng tái sử dụng, tái chế">Tái chế & Tái sử dụng</option>
                                <option value="Chất thải thực phẩm">Rác thực phẩm</option>
                                <option value="Chất thải rắn sinh hoạt khác">Rác sinh hoạt khác</option>
                            </select>
                        </div>

                        {/* TÍCH HỢP CURRENCY INPUT XỊN SÒ */}
                        <CurrencyInput
                            label="Giá tham khảo"
                            value={newPrice}
                            onChange={setNewPrice}
                            placeholder="Nhập giá (VD: 100.000)"
                        />

                        {/* TÍCH HỢP TAG INPUT NHẬP TÊN GỌI KHÁC */}
                        <TagInput
                            label="Tên gọi khác"
                            tags={localNames}
                            onChange={setLocalNames}
                            placeholder="VD: sắt gỉ, vỏ lon..."
                        />

                        {/* Hình ảnh */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                                    <ImageIcon size={14} /> Ảnh minh họa
                                </label>
                                <button type="button" onClick={handleAddImage} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                                    <Plus size={12} /> Thêm ảnh
                                </button>
                            </div>
                            <div className="space-y-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-white p-1 rounded-lg border border-slate-200">
                                        <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                                            {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-slate-300" />}
                                        </div>
                                        <input
                                            className="flex-1 text-xs border-none outline-none focus:ring-0 px-2 bg-transparent"
                                            value={img} onChange={e => handleChangeImage(idx, e.target.value)} placeholder="Dán link ảnh (https://...)"
                                        />
                                        <button type="button" onClick={() => handleRemoveImage(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Xử lý */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                                    <ListOrdered size={14} /> Hướng dẫn xử lý
                                </label>
                                <button type="button" onClick={handleAddStep} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    <Plus size={12} /> Thêm bước
                                </button>
                            </div>
                            <div className="space-y-2">
                                {processingSteps.map((step, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 mt-2.5 w-4">{idx + 1}.</span>
                                        <textarea
                                            className="flex-1 p-2 border-none bg-transparent text-sm focus:ring-0 outline-none resize-none h-16"
                                            value={step} onChange={e => handleChangeStep(idx, e.target.value)} placeholder={`Mô tả bước ${idx + 1}...`}
                                        />
                                        <button type="button" onClick={() => handleRemoveStep(idx)} className="text-slate-300 hover:text-red-500 mt-2 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg ${editingId ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"}`}>
                            <Save size={18} /> {editingId ? "Cập nhật dữ liệu" : "Lưu rác mới"}
                        </button>
                    </form>
                </div>
            </div>

            {/* CỘT PHẢI: LIST */}
            <div className="lg:col-span-2">
                {wastes.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
                        <h4 className="text-lg font-bold text-slate-700">Chưa có dữ liệu rác</h4>
                        <p className="text-slate-500 text-sm mt-1">Hãy sử dụng form bên trái để thêm loại rác đầu tiên nhé.</p>
                    </div>
                ) : (
                    <>
                        {/* GIAO DIỆN BẢNG (CHỈ HIỆN TRÊN DESKTOP) */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="p-4">Tên & Ảnh</th>
                                        <th className="p-4">Giá & Đơn vị</th>
                                        <th className="p-4">Phân loại</th>
                                        <th className="p-4 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {wastes.map((item) => (
                                        <tr key={item._id} className={`transition group ${editingId === item._id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}>
                                            <td className="p-4 align-middle">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                                        {item.images && item.images.length > 0 ? (
                                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={18} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-base">{item.name}</p>
                                                        {item.local_names?.length > 0 && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.local_names.join(", ")}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <p className="text-green-600 font-bold">
                                                    {item.estimated_price > 0 ? `${formatCurrency(item.estimated_price)}/${item.unit}` : "---"}
                                                </p>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {(() => {
                                                    const style = getWasteCategoryStyle(item.category);
                                                    return (
                                                        <span style={{ backgroundColor: style.bgColor, color: style.color, borderColor: style.borderColor, borderWidth: 1 }} className="whitespace-nowrap px-3 py-1 text-xs rounded-full font-bold">
                                                            {style.label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Pencil size={18} /></button>
                                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* GIAO DIỆN CARD (CHỈ HIỆN TRÊN MOBILE) */}
                        <div className="md:hidden space-y-4">
                            {wastes.map((item) => {
                                const style = getWasteCategoryStyle(item.category);
                                return (
                                    <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border ${editingId === item._id ? "border-blue-300" : "border-slate-200"}`}>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h4>
                                                <span style={{ backgroundColor: style.bgColor, color: style.color, borderColor: style.borderColor, borderWidth: 1 }} className="inline-block mt-1.5 px-2 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider">
                                                    {style.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-md">
                                                {item.estimated_price > 0 ? `${formatCurrency(item.estimated_price)}/${item.unit}` : "---"}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}