import { X, Calendar, Clock } from "lucide-react";
import { Schedule } from "@/types/schedule";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    schedule: Schedule | null; // Dữ liệu lịch đầy đủ (bao gồm cả tuần)
}

export default function ScheduleDetailModal({ isOpen, onClose, schedule }: Props) {
    if (!isOpen || !schedule) return null;

    const getDayName = (day: number) => ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];

    // Sắp xếp lịch từ Thứ 2 đến CN
    const sortedSchedule = [...schedule.standard_schedule].sort((a, b) => {
        // Chuyển CN (0) thành 7 để sắp xếp cuối cùng
        const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
        const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
        return dayA - dayB;
    });

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-green-600 p-4 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Calendar size={20} /> Lịch thu gom định kỳ
                        </h3>
                        <p className="text-sm opacity-90">{schedule.village_name} - {schedule.ward}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {sortedSchedule.length === 0 ? (
                        <p className="text-center text-slate-500 py-4">Chưa có lịch định kỳ.</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedSchedule.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 text-green-700 font-bold w-12 h-12 flex items-center justify-center rounded-lg text-xs uppercase text-center">
                                            {getDayName(item.day_of_week).replace(' ', '\n')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">{item.waste_type}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                <Clock size={12} /> {item.time_slot}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100 text-xs text-orange-700">
                        *Lưu ý: Lịch có thể thay đổi vào các dịp Lễ/Tết. Vui lòng theo dõi thông báo tại trang chủ.
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-slate-50 text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}