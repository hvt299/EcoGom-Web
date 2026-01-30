"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { adminApi } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLogin() {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await adminApi.login(code);

        if (response && response.success) {
            localStorage.setItem("isAdmin", "true");
            // localStorage.setItem("token", response.token);
            toast.success("Đăng nhập thành công!");
            router.push("/admin/dashboard");
        } else {
            toast.error("Sai mã bí mật rồi!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <Toaster />
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Lock className="text-green-600 w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    EcoGom Admin
                </h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Nhập mã bí mật..."
                        className="w-full p-3 rounded-lg border border-slate-300 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        Đăng nhập
                    </button>
                </form>
                <p className="text-center text-slate-400 text-sm mt-4">
                    *Mã mặc định là Admin
                </p>
            </div>
        </div>
    );
}