"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Leaf, Calendar, MapPin, ChevronDown, Info, Phone, Mail, Facebook, Bell, Check, X } from "lucide-react";
import { wasteApi, scheduleApi, locationApi } from "@/services/api";
import { Waste } from "@/types/waste";
import { ScheduleResponse, Schedule, SpecialEvent } from "@/types/schedule";
import { Location } from "@/types/location";

import SearchInput from "@/components/Home/SearchInput";
import FilterTabs from "@/components/Home/FilterTabs";
import WasteList from "@/components/Home/WasteList";
import VillageModal from "@/components/Home/VillageModal";

import ScheduleCard from "@/components/Home/ScheduleCard";
import ScheduleDetailModal from "@/components/Home/ScheduleDetailModal";
import WasteDetailModal from "@/components/Home/WasteDetailModal";
import { processScheduleData } from "@/utils/dataProcessor";

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
  const debouncedKeyword = useDebounce(keyword, 500);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loadingWaste, setLoadingWaste] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<Waste | null>(null);

  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [groupedVillages, setGroupedVillages] = useState<Record<string, string[]>>({});
  const [showVillageModal, setShowVillageModal] = useState(false);

  const [todaySchedule, setTodaySchedule] = useState<ScheduleResponse | null>(null);
  const [fullSchedule, setFullSchedule] = useState<Schedule | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const initData = async () => {
      const allSchedules = await scheduleApi.getAll();
      if (allSchedules && allSchedules.length > 0) {
        const { groupedVillages, wards, defaultVillage } = processScheduleData(allSchedules);

        setGroupedVillages(groupedVillages);

        if (!selectedVillage) {
          setSelectedVillage(defaultVillage);
        }
      }

      const locationData = await locationApi.getAll();
      setLocations(locationData);
    };
    initData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Không lấy được vị trí, dùng mặc định Hà Nội");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoadingSchedule(true);

      const todayData = await scheduleApi.getTodaySchedule(selectedVillage);
      setTodaySchedule(todayData);

      const currentFull = await scheduleApi.getFullByVillage(selectedVillage);
      setFullSchedule(currentFull || null);

      if (currentFull && currentFull.special_events) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const future = currentFull.special_events.filter((e: SpecialEvent) => new Date(e.end_date) >= now);
        setUpcomingEvents(future);
      } else {
        setUpcomingEvents([]);
      }

      setLoadingSchedule(false);
    };

    if (selectedVillage) fetchSchedule();
  }, [selectedVillage]);

  useEffect(() => {
    const fetchWastes = async () => {
      setLoadingWaste(true);
      const data = await wasteApi.getAll(debouncedKeyword);
      setWastes(data);
      setLoadingWaste(false);
    };
    fetchWastes();
  }, [debouncedKeyword]);

  const filteredWastes = wastes.filter(waste => {
    if (activeFilter === "ALL") return true;
    return waste.category?.trim() === activeFilter;
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">

      {/* 1. HEADER GRADIENT & INFO */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 pt-12 pb-16 px-4 rounded-b-[40px] shadow-lg shadow-green-200/50">
        <div className="max-w-md mx-auto text-white">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight">EcoGom</h1>
                <p className="text-xs text-green-100 opacity-90 mt-0.5">Xanh - Sạch - Đẹp</p>
              </div>
            </div>

            {/* Village Selector (Modal) */}
            <button
              onClick={() => setShowVillageModal(true)}
              className="bg-black/20 backdrop-blur-md text-white font-semibold text-sm py-2 px-4 rounded-full hover:bg-black/30 transition border border-white/10 flex items-center gap-2"
            >
              {selectedVillage || "Chọn khu vực"}
              <ChevronDown size={14} className="opacity-80" />
            </button>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-green-100 text-sm">Chào bạn,</p>
            <h2 className="text-2xl font-bold">Hôm nay bạn muốn vứt bỏ gì nào?</h2>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="max-w-md mx-auto px-4 -mt-10 w-full flex-1">
        {/* Component: SEARCH INPUT */}
        <SearchInput keyword={keyword} setKeyword={setKeyword} loading={loadingWaste} />

        {/* Component: FILTER TABS */}
        <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* SECTION: LỊCH THU GOM & BẢN ĐỒ */}
        {!keyword && activeFilter === "ALL" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between text-slate-600 text-sm font-bold mb-3 px-1">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-green-600" />
                <span>Lịch hôm nay</span>
              </div>
              <button
                onClick={() => setShowDetailModal(true)}
                className="text-green-600 flex items-center gap-1 hover:bg-green-50 px-2 py-1 rounded-lg transition text-xs font-semibold"
              >
                <Info size={12} /> Chi tiết tuần
              </button>
            </div>

            <ScheduleCard data={todaySchedule} loading={loadingSchedule} />

            {/* SỰ KIỆN SẮP TỚI */}
            {upcomingEvents.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-1 text-slate-600 text-sm font-bold">
                  <Bell size={16} className="text-orange-500" />
                  <span>Sắp tới</span>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((ev: any, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border-l-4 border-orange-400 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{ev.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(ev.start_date).toLocaleDateString('vi-VN')} - {new Date(ev.end_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {ev.is_cancelled && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase tracking-wide">Nghỉ</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 mb-8">
              <div className="flex items-center gap-2 mb-3 text-slate-600 text-sm font-bold px-1">
                <MapPin className="text-blue-500" size={16} />
                <h2>Điểm thu gom gần bạn</h2>
              </div>
              <div className="shadow-lg rounded-2xl overflow-hidden border border-slate-200 ring-4 ring-white">
                <MapWithNoSSR locations={locations} center={userLocation || [21.028511, 105.854444]} />
              </div>
            </div>
          </div>
        )}

        {/* Component: WASTE LIST */}
        {(keyword || activeFilter !== "ALL") && (
          <WasteList
            wastes={filteredWastes}
            loading={loadingWaste}
            onSelect={setSelectedWaste}
            onClearFilter={() => setActiveFilter("ALL")}
            isFiltered={activeFilter !== "ALL"}
          />
        )}
      </div>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition">
            <Leaf className="text-green-600 w-5 h-5" />
            <span className="font-bold text-slate-800 text-lg">EcoGom</span>
          </div>
          <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto leading-relaxed">
            Ứng dụng hỗ trợ phân loại rác và tra cứu lịch thu gom rác tại địa phương. Chung tay vì một môi trường xanh.
          </p>

          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-green-50 hover:text-green-600 transition"><Phone size={18} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition"><Mail size={18} /></a>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] text-slate-400">
              © 2026 EcoGom Project. Designed by Mr.T.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <VillageModal 
        isOpen={showVillageModal}
        onClose={() => setShowVillageModal(false)}
        groupedVillages={groupedVillages}
        selectedVillage={selectedVillage}
        onSelect={setSelectedVillage}
      />
      <ScheduleDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        schedule={fullSchedule}
      />
      <WasteDetailModal
        isOpen={!!selectedWaste}
        onClose={() => setSelectedWaste(null)}
        waste={selectedWaste}
      />

    </main>
  );
}