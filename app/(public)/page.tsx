"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Package, MapPin, ChevronDown } from "lucide-react";

import SearchInput from "@/components/Home/SearchInput";
import FilterTabs from "@/components/Home/FilterTabs";
import WasteList from "@/components/Home/WasteList";
import ScheduleCard from "@/components/Home/ScheduleCard";
import VillageModal from "@/components/Home/VillageModal";
import WasteDetailModal from "@/components/Home/WasteDetailModal";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-100slate-100 rounded-3xl animate-pulse flex items-center justify-center border border-slate-200">
      <span className="text-slate-400 font-medium">Đang tải bản đồ...</span>
    </div>
  )
});

import { wasteApi, locationApi, scheduleApi } from "@/services/api";
import { Waste } from "@/types/waste";
import { Location } from "@/types/location";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loadingWastes, setLoadingWastes] = useState(true);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [groupedVillages, setGroupedVillages] = useState<Record<string, string[]>>({});
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([16.0544, 108.2022]);

  const [isVillageModalOpen, setIsVillageModalOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<Waste | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingWastes(true);
      try {
        const [wastesRes, locsRes, schedulesRes] = await Promise.all([
          wasteApi.getAll(),
          locationApi.getAll(),
          scheduleApi.getAll()
        ]);

        setWastes(wastesRes || []);
        setLocations(locsRes || []);

        if (schedulesRes && schedulesRes.length > 0) {
          const groups: Record<string, string[]> = {};
          schedulesRes.forEach((sch: any) => {
            if (!groups[sch.ward]) groups[sch.ward] = [];
            if (!groups[sch.ward].includes(sch.village_name)) {
              groups[sch.ward].push(sch.village_name);
            }
          });
          setGroupedVillages(groups);

          const firstWard = Object.keys(groups)[0];
          if (firstWard && groups[firstWard].length > 0) {
            setSelectedVillage(groups[firstWard][0]);
          }
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu", error);
      } finally {
        setLoadingWastes(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedVillage) return;

    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      try {
        const res = await scheduleApi.getTodaySchedule(selectedVillage);

        setScheduleData(res);
      } catch (error) {
        console.error("Lỗi lấy lịch", error);
        setScheduleData(null);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchSchedule();
  }, [selectedVillage]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => console.log("Lỗi lấy vị trí GPS", error),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const filteredWastes = useMemo(() => {
    return wastes.filter(w => {
      const matchKeyword = w.name.toLowerCase().includes(keyword.toLowerCase()) ||
        w.local_names?.some(n => n.toLowerCase().includes(keyword.toLowerCase()));
      const matchFilter = activeFilter === "ALL" || w.category === activeFilter;
      return matchKeyword && matchFilter;
    });
  }, [wastes, keyword, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-green-100 selection:text-green-900 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50">
              <Package className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">EcoGom</span>
          </div>

          <button
            onClick={() => setIsVillageModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-semibold transition active:scale-95 border border-slate-200/60 shadow-sm"
          >
            <MapPin size={18} className="text-green-600" />
            <span className="hidden sm:inline">{selectedVillage || "Đang tải..."}</span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT 2 CỘT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* CỘT TRÁI (65%) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Tra cứu phân loại rác
              </h1>
              <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
                Tìm kiếm nhanh cách phân loại, giá bán tham khảo và quy trình xử lý rác thải xung quanh bạn.
              </p>
            </div>

            <div className="pt-2 mb-4">
              <SearchInput
                keyword={keyword}
                setKeyword={setKeyword}
                loading={loadingWastes}
              />
              <FilterTabs
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>

            {/* Danh sách rác */}
            <div className="pb-10">
              <WasteList
                wastes={filteredWastes}
                loading={loadingWastes}
                onSelect={setSelectedWaste}
                onClearFilter={() => { setKeyword(""); setActiveFilter("ALL"); }}
                isFiltered={keyword !== "" || activeFilter !== "ALL"}
              />
            </div>
          </div>

          {/* CỘT PHẢI (35%) - Lịch & Bản đồ */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-26 space-y-8">

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Lịch thu gom hôm nay
                  </h2>
                </div>
                <ScheduleCard data={scheduleData} loading={loadingSchedule} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Điểm thu gom lân cận
                  </h2>
                </div>
                <Map
                  locations={locations}
                  center={userLocation}
                />
                <div className="mt-4 flex items-start gap-2 bg-slate-100/50 p-3 rounded-xl border border-slate-200/50">
                  <div className="text-slate-400 mt-0.5">ℹ️</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Bản đồ thể hiện các điểm thu gom rác tại địa phương. Các thực thể thuộc quần đảo Hoàng Sa và Trường Sa hiển thị trên bản đồ là chủ quyền không thể tranh cãi của Việt Nam.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <VillageModal
        isOpen={isVillageModalOpen}
        onClose={() => setIsVillageModalOpen(false)}
        groupedVillages={groupedVillages}
        selectedVillage={selectedVillage}
        onSelect={setSelectedVillage}
      />

      <WasteDetailModal
        isOpen={!!selectedWaste}
        onClose={() => setSelectedWaste(null)}
        waste={selectedWaste}
      />
    </div>
  );
}