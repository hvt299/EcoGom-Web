"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { adminApi } from "@/services/api";

export default function LoginPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            toast.error("Vui lòng nhập mã bảo mật!");
            return;
        }

        setLoading(true);
        try {
            const response = await adminApi.login(code);

            if (response && response.access_token) {
                localStorage.setItem("isAdmin", "true");
                localStorage.setItem("token", response.access_token);

                toast.success("Đăng nhập thành công!");
                router.push("/admin");
            } else {
                toast.error("Mật khẩu sai rồi!");
            }
        } catch (error) {
            toast.error("Lỗi kết nối đến máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Toaster position="top-center" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
                        <Package className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Quản trị EcoGom</h1>
                    <p className="text-slate-500 text-sm mt-1">Vui lòng nhập mật khẩu để tiếp tục</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Mật khẩu (Passcode)</label>
                        <div className="relative group">
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Nhập mật khẩu..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono tracking-widest"
                                disabled={loading}
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-200/50 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Đang kiểm tra...
                            </>
                        ) : (
                            <>
                                Đăng nhập <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => router.push("/")} className="text-sm font-medium text-slate-400 hover:text-green-600 transition-colors">
                        &larr; Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}