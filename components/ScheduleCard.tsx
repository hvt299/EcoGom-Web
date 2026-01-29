import { Calendar, Clock, AlertTriangle, Truck } from "lucide-react";
import { ScheduleResponse } from "@/types/schedule";

interface Props {
    data: ScheduleResponse | null;
    loading: boolean;
}

export default function ScheduleCard({ data, loading }: Props) {
    if (loading) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-pulse h-24 mb-6">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (!data) return null;

    const isHoliday = data.type === 'SPECIAL';
    const hasTruck = !data.is_cancelled && data.type !== 'NONE';

    return (
        <div className={`p-5 rounded-xl mb-6 shadow-sm border ${isHoliday
            ? "bg-orange-50 border-orange-100 text-orange-800"
            : hasTruck
                ? "bg-blue-50 border-blue-100 text-blue-800"
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}>
            <div className="flex items-start gap-3">
                {/* Icon thay đổi theo trạng thái */}
                <div className={`p-2 rounded-full ${isHoliday ? "bg-orange-100" : hasTruck ? "bg-blue-100" : "bg-slate-200"
                    }`}>
                    {isHoliday ? <AlertTriangle size={20} /> : <Truck size={20} />}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{data.message}</h3>

                    {/* Chỉ hiện giờ nếu có xe chạy */}
                    {hasTruck && (
                        <div className="flex items-center gap-4 text-sm mt-2 font-medium">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{data.time}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/50 rounded-md">
                                <span>Thu gom: {data.waste_type}</span>
                            </div>
                        </div>
                    )}

                    {/* Hiện ghi chú nếu có (ví dụ: Nghỉ Tết) */}
                    {data.note && (
                        <p className="text-sm mt-2 opacity-80 italic">
                            *Lưu ý: {data.note}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}