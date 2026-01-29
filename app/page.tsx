"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Leaf, Loader2, Calendar, MapPin } from "lucide-react";
import { wasteApi, scheduleApi, locationApi } from "@/services/api";
import { Waste } from "@/types/waste";
import { ScheduleResponse } from "@/types/schedule";
import { Location } from "@/types/location";
import ScheduleCard from "@/components/ScheduleCard";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MapWithNoSSR = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
      Đang tải bản đồ...
    </div>
  ),
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loadingWaste, setLoadingWaste] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 500);

  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingWaste(true);
      const data = await wasteApi.getAll(debouncedKeyword);
      setWastes(data);
      setLoadingWaste(false);
    };

    fetchData();
  }, [debouncedKeyword]);

  useEffect(() => {
    const initData = async () => {
      const scheduleData = await scheduleApi.getTodaySchedule("Thôn Đông");
      setSchedule(scheduleData);
      setLoadingSchedule(false);

      const locationData = await locationApi.getLocations();
      setLocations(locationData);
    };

    initData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-center gap-2 mb-8 mt-4">
        <div className="bg-green-600 p-2 rounded-full">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-green-800">EcoGom</h1>
      </div>

      {/* PHẦN 1: LỊCH THU GOM */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
          <Calendar size={14} />
          <span>Lịch thu gom hôm nay (Thôn Đông):</span>
        </div>
        <ScheduleCard data={schedule} loading={loadingSchedule} />
      </div>

      {/* PHẦN 2: TÌM KIẾM RÁC */}
      <div className="max-w-md mx-auto mb-8 sticky top-4 z-10">
        <div className="relative shadow-lg">
          <input
            type="text"
            placeholder="Bạn muốn vứt gì? (VD: vỏ lon, giấy...)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />

          {loadingWaste && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
          )}
        </div>
      </div>

      {/* KẾT QUẢ TÌM KIẾM */}
      <div className="max-w-md mx-auto grid gap-4">
        {wastes.length === 0 && !loadingWaste ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Không tìm thấy loại rác nào phù hợp.</p>
            <p className="text-sm mt-2">Hãy thử từ khóa khác như "nhựa", "giấy"...</p>
          </div>
        ) : (
          wastes.map((waste) => (
            <div
              key={waste._id}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{waste.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Gọi là: {waste.local_names.join(", ")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${waste.category === "Tái chế"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {waste.category}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-sm text-slate-400">Giá tham khảo:</span>
                <span className="font-bold text-green-600">{waste.estimated_price}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PHẦN 3: BẢN ĐỒ */}
      <div className="max-w-md mx-auto mt-8">
        <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
          <MapPin className="text-red-500" size={20} />
          <h2>Điểm thu gom gần bạn</h2>
        </div>

        <div className="shadow-lg rounded-xl overflow-hidden border border-slate-200">
          <MapWithNoSSR
            locations={locations}
            center={[21.028511, 105.854444]}
          />
        </div>
      </div>
    </main>
  );
}