"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Leaf, Loader2, Calendar, MapPin, ChevronDown, Info, Phone, Mail, Facebook, Bell } from "lucide-react";
import { wasteApi, scheduleApi, locationApi } from "@/services/api";
import { Waste } from "@/types/waste";
import { ScheduleResponse, Schedule, SpecialEvent } from "@/types/schedule";
import { Location } from "@/types/location";
import ScheduleCard from "@/components/ScheduleCard";
import ScheduleDetailModal from "@/components/ScheduleDetailModal";

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

  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loadingWaste, setLoadingWaste] = useState(false);

  const [villages, setVillages] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<string>("");

  const [todaySchedule, setTodaySchedule] = useState<ScheduleResponse | null>(null);
  const [fullSchedule, setFullSchedule] = useState<Schedule | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const initData = async () => {
      // 1. Lấy tất cả lịch để lọc ra danh sách Thôn
      const allSchedules = await scheduleApi.getAll();
      if (allSchedules && allSchedules.length > 0) {
        const villageNames = allSchedules.map((s: Schedule) => s.village_name);
        setVillages(villageNames);
        // Nếu thôn mặc định không có trong list, chọn cái đầu tiên
        if (!villageNames.includes(selectedVillage)) {
          setSelectedVillage(villageNames[0]);
        }
      }

      // 2. Lấy điểm thu gom map
      const locationData = await locationApi.getAll(); // Đã sửa tên hàm cho chuẩn refactor
      setLocations(locationData);
    };
    initData();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoadingSchedule(true);

      // 1. Lấy lịch hôm nay (API getToday)
      const todayData = await scheduleApi.getTodaySchedule(selectedVillage);
      setTodaySchedule(todayData);

      // 2. Lấy full lịch (để hiện modal chi tiết)
      // Vì backend chưa có API getFullByVillage, ta dùng getAll rồi find
      // (Cách này tạm ổn vì dữ liệu lịch rất nhẹ)
      const allSchedules = await scheduleApi.getAll();
      const currentFull = allSchedules.find((s: Schedule) => s.village_name === selectedVillage);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoadingWaste(true);
  //     const data = await wasteApi.getAll(debouncedKeyword);
  //     setWastes(data);
  //     setLoadingWaste(false);
  //   };

  //   fetchData();
  // }, [debouncedKeyword]);

  // useEffect(() => {
  //   const initData = async () => {
  //     const scheduleData = await scheduleApi.getTodaySchedule("Thôn Đông");
  //     setSchedule(scheduleData);
  //     setLoadingSchedule(false);

  //     const locationData = await locationApi.getLocations();
  //     setLocations(locationData);
  //   };

  //   initData();
  // }, []);

  // return (
  //   <main className="min-h-screen bg-slate-50 p-4 pb-20">
  //     {/* HEADER */}
  //     <div className="flex items-center justify-center gap-2 mb-8 mt-4">
  //       <div className="bg-green-600 p-2 rounded-full">
  //         <Leaf className="text-white w-6 h-6" />
  //       </div>
  //       <h1 className="text-2xl font-bold text-green-800">EcoGom</h1>
  //     </div>

  //     {/* PHẦN 1: LỊCH THU GOM */}
  //     <div className="max-w-md mx-auto">
  //       <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
  //         <Calendar size={14} />
  //         <span>Lịch thu gom hôm nay (Thôn Đông):</span>
  //       </div>
  //       <ScheduleCard data={schedule} loading={loadingSchedule} />
  //     </div>

  //     {/* PHẦN 2: TÌM KIẾM RÁC */}
  //     <div className="max-w-md mx-auto mb-8 sticky top-4 z-10">
  //       <div className="relative shadow-lg">
  //         <input
  //           type="text"
  //           placeholder="Bạn muốn vứt gì? (VD: vỏ lon, giấy...)"
  //           className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-green-500 text-lg"
  //           value={keyword}
  //           onChange={(e) => setKeyword(e.target.value)}
  //         />
  //         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />

  //         {loadingWaste && (
  //           <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
  //         )}
  //       </div>
  //     </div>

  //     {/* KẾT QUẢ TÌM KIẾM */}
  //     <div className="max-w-md mx-auto grid gap-4">
  //       {wastes.length === 0 && !loadingWaste ? (
  //         <div className="text-center text-gray-400 mt-10">
  //           <p>Không tìm thấy loại rác nào phù hợp.</p>
  //           <p className="text-sm mt-2">Hãy thử từ khóa khác như "nhựa", "giấy"...</p>
  //         </div>
  //       ) : (
  //         wastes.map((waste) => (
  //           <div
  //             key={waste._id}
  //             className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
  //           >
  //             <div className="flex justify-between items-start">
  //               <div>
  //                 <h3 className="font-bold text-lg text-slate-800">{waste.name}</h3>
  //                 <p className="text-sm text-slate-500 mt-1">
  //                   Gọi là: {waste.local_names.join(", ")}
  //                 </p>
  //               </div>
  //               <span
  //                 className={`px-3 py-1 rounded-full text-xs font-semibold ${waste.category === "Tái chế"
  //                   ? "bg-green-100 text-green-700"
  //                   : "bg-gray-100 text-gray-700"
  //                   }`}
  //               >
  //                 {waste.category}
  //               </span>
  //             </div>

  //             <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
  //               <span className="text-sm text-slate-400">Giá tham khảo:</span>
  //               <span className="font-bold text-green-600">{waste.estimated_price}</span>
  //             </div>
  //           </div>
  //         ))
  //       )}
  //     </div>

  //     {/* PHẦN 3: BẢN ĐỒ */}
  //     <div className="max-w-md mx-auto mt-8">
  //       <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
  //         <MapPin className="text-red-500" size={20} />
  //         <h2>Điểm thu gom gần bạn</h2>
  //       </div>

  //       <div className="shadow-lg rounded-xl overflow-hidden border border-slate-200">
  //         <MapWithNoSSR
  //           locations={locations}
  //           center={[21.028511, 105.854444]}
  //         />
  //       </div>
  //     </div>
  //   </main>
  // );

  // return (
  //   <main className="min-h-screen bg-slate-50 pb-20">

  //     {/* 1. HEADER & LOCATION SELECTOR */}
  //     <div className="bg-white pt-12 pb-6 px-4 rounded-b-3xl shadow-sm border-b border-slate-100">
  //       <div className="max-w-md mx-auto">
  //         <div className="flex justify-between items-center mb-4">
  //           <div className="flex items-center gap-2">
  //             <div className="bg-green-600 p-2 rounded-xl shadow-green-200 shadow-lg">
  //               <Leaf className="text-white w-6 h-6" />
  //             </div>
  //             <span className="text-2xl font-bold text-slate-800 tracking-tight">EcoGom</span>
  //           </div>

  //           {/* Dropdown chọn thôn */}
  //           <div className="relative group">
  //             <select
  //               className="appearance-none bg-slate-100 text-slate-700 font-bold py-2 pl-4 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
  //               value={selectedVillage}
  //               onChange={(e) => setSelectedVillage(e.target.value)}
  //             >
  //               {villages.map(v => <option key={v} value={v}>{v}</option>)}
  //             </select>
  //             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
  //           </div>
  //         </div>

  //         <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-2">
  //           <div className="flex items-center gap-1.5">
  //             <Calendar size={16} className="text-green-600" />
  //             <span>Hôm nay:</span>
  //           </div>
  //           {/* Nút xem chi tiết */}
  //           <button
  //             onClick={() => setShowDetailModal(true)}
  //             className="text-green-600 flex items-center gap-1 hover:underline text-xs bg-green-50 px-2 py-1 rounded-full"
  //           >
  //             <Info size={12} /> Chi tiết tuần
  //           </button>
  //         </div>

  //         <ScheduleCard data={todaySchedule} loading={loadingSchedule} />
  //       </div>
  //     </div>

  //     <div className="max-w-md mx-auto px-4 mt-6">

  //       {/* 2. THANH TÌM KIẾM (STICKY CHUẨN) */}
  //       <div className="sticky top-0 z-30 -mx-4 px-4 pb-2 pt-2 bg-slate-50/95 backdrop-blur-md transition-all">
  //         <div className="relative shadow-sm rounded-2xl group focus-within:shadow-md transition-shadow bg-white">
  //           <input
  //             type="text"
  //             placeholder="Bạn muốn vứt gì? (VD: vỏ lon...)"
  //             className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-0 text-base outline-none transition-colors"
  //             value={keyword}
  //             onChange={(e) => setKeyword(e.target.value)}
  //           />
  //           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-500 transition-colors" />

  //           {loadingWaste && (
  //             <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
  //           )}
  //         </div>
  //       </div>

  //       {/* 3. KẾT QUẢ TÌM KIẾM */}
  //       <div className="grid gap-3 mt-2 min-h-[100px]">
  //         {wastes.length === 0 && !loadingWaste && keyword && (
  //           <div className="text-center py-8">
  //             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
  //               <Search className="text-slate-400" size={24} />
  //             </div>
  //             <p className="text-slate-500 font-medium">Không tìm thấy rác này</p>
  //             <p className="text-xs text-slate-400 mt-1">Thử từ khóa: "nhựa", "giấy", "pin"...</p>
  //           </div>
  //         )}

  //         {wastes.map((waste) => (
  //           <div
  //             key={waste._id}
  //             className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
  //           >
  //             <div className="flex justify-between items-start mb-2">
  //               <h3 className="font-bold text-slate-800 text-lg leading-tight">{waste.name}</h3>
  //               <span
  //                 className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${waste.category === "Tái chế"
  //                   ? "bg-green-100 text-green-700"
  //                   : "bg-slate-100 text-slate-600"
  //                   }`}
  //               >
  //                 {waste.category}
  //               </span>
  //             </div>

  //             {waste.local_names.length > 0 && (
  //               <p className="text-xs text-slate-500 mb-3">
  //                 Còn gọi là: {waste.local_names.join(", ")}
  //               </p>
  //             )}

  //             <div className="flex items-center justify-between pt-3 border-t border-slate-50">
  //               <span className="text-xs font-medium text-slate-400">Giá tham khảo</span>
  //               <span className="font-bold text-green-600 text-sm bg-green-50 px-2 py-1 rounded-md">
  //                 {waste.estimated_price}
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* 4. BẢN ĐỒ */}
  //       <div className="mt-8 mb-6">
  //         <div className="flex items-center gap-2 mb-4">
  //           <div className="bg-red-100 p-1.5 rounded-lg">
  //             <MapPin className="text-red-500" size={18} />
  //           </div>
  //           <h2 className="font-bold text-slate-800 text-lg">Điểm thu gom gần bạn</h2>
  //         </div>

  //         <div className="shadow-lg rounded-2xl overflow-hidden border border-slate-200 ring-4 ring-white">
  //           <MapWithNoSSR
  //             locations={locations}
  //             // Tạm thời hardcode center Hà Nội. Sau này dùng Geolocation API của trình duyệt
  //             center={[21.028511, 105.854444]}
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* MODAL CHI TIẾT */}
  //     <ScheduleDetailModal
  //       isOpen={showDetailModal}
  //       onClose={() => setShowDetailModal(false)}
  //       schedule={fullSchedule}
  //     />

  //   </main>
  // );

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

            {/* Village Selector (Glassmorphism) */}
            <div className="relative group">
              <select
                className="appearance-none bg-black/20 backdrop-blur-md text-white font-semibold text-sm py-2 pl-4 pr-9 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer hover:bg-black/30 transition border border-white/10"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
              >
                {villages.map(v => <option key={v} value={v} className="text-slate-800">{v}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-green-100 text-sm">Chào bạn,</p>
            <h2 className="text-2xl font-bold">Hôm nay bạn muốn vứt gì?</h2>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER (Kéo lên đè vào Header) */}
      <div className="max-w-md mx-auto px-4 -mt-10 w-full flex-1">

        {/* THANH TÌM KIẾM (Nổi bật) */}
        <div className="relative shadow-xl shadow-slate-200/50 rounded-2xl bg-white mb-6 z-20">
          <input
            type="text"
            placeholder="Tìm rác (VD: pin, vỏ lon...)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-green-500 text-slate-700 font-medium placeholder:font-normal placeholder:text-slate-400 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
          {loadingWaste && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
          )}
        </div>

        {/* SECTION: LỊCH THU GOM */}
        {!keyword && (
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
                Xem cả tuần <Info size={12} />
              </button>
            </div>

            <ScheduleCard data={todaySchedule} loading={loadingSchedule} />

            {/* --- MỚI: SỰ KIỆN SẮP TỚI --- */}
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
                          {new Date(ev.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {new Date(ev.end_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
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
          </div>
        )}

        {/* SECTION: KẾT QUẢ TÌM KIẾM */}
        {keyword && (
          <div className="grid gap-3 mb-8">
            {wastes.length === 0 && !loadingWaste ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300 w-10 h-10" />
                </div>
                <p className="text-slate-500 font-medium">Không tìm thấy rác này</p>
              </div>
            ) : (
              wastes.map((waste) => (
                <div key={waste._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{waste.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${waste.category === "Tái chế" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                      {waste.category}
                    </span>
                  </div>
                  {waste.local_names.length > 0 && (
                    <p className="text-xs text-slate-500 mb-3">Gọi là: {waste.local_names.join(", ")}</p>
                  )}
                  <div className="flex justify-between border-t border-slate-50 pt-2 text-sm">
                    <span className="text-slate-400">Giá:</span>
                    <span className="font-bold text-green-600">{waste.estimated_price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SECTION: BẢN ĐỒ */}
        {!keyword && (
          <div className="mt-8 mb-8">
            <div className="flex items-center gap-2 mb-3 text-slate-600 text-sm font-bold px-1">
              <MapPin className="text-blue-500" size={16} />
              <h2>Điểm thu gom gần đây</h2>
            </div>
            <div className="shadow-lg rounded-2xl overflow-hidden border border-slate-200 ring-4 ring-white">
              <MapWithNoSSR locations={locations} center={[21.028511, 105.854444]} />
            </div>
          </div>
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
              © 2026 EcoGom Project. Designed by You.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <ScheduleDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        schedule={fullSchedule}
      />

    </main>
  );
}