export const ARCHIPELAGOS = [
    { id: "label-hs", name: "QUẦN ĐẢO HOÀNG SA (VN)", lat: 16.5000, lng: 111.6000 },
    { id: "label-ts", name: "QUẦN ĐẢO TRƯỜNG SA (VN)", lat: 10.0000, lng: 114.0000 },
];

export type VNIsland = {
    id: string;
    region: string;
    region_en: string;
    name_vi: string;
    name_en: string;
    lat: number;
    lng: number;
    occupied: boolean;
    claimants: string;
    desc: string;
    isMain?: boolean;
};

export const VN_ISLANDS: VNIsland[] = [
    { id: "hs-phu-lam", region: "Hoàng Sa", region_en: "Paracels", name_vi: "Đảo Phú Lâm", name_en: "Woody Island", lat: 16.8333, lng: 112.3333, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng), Đài Loan", desc: "Đảo lớn nhất quần đảo Hoàng Sa. Bị Trung Quốc chiếm đóng trái phép và quân sự hóa mạnh mẽ.", isMain: true },
    { id: "hs-tri-ton", region: "Hoàng Sa", region_en: "Paracels", name_vi: "Đảo Tri Tôn", name_en: "Triton Island", lat: 15.7833, lng: 111.2000, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng), Đài Loan", desc: "Đảo nằm ở cực tây nam của quần đảo Hoàng Sa." },
    { id: "hs-hoang-sa", region: "Hoàng Sa", region_en: "Paracels", name_vi: "Đảo Hoàng Sa", name_en: "Pattle Island", lat: 16.5333, lng: 111.6000, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng), Đài Loan", desc: "Nơi từng đặt bia chủ quyền và trạm khí tượng của Việt Nam trước khi bị chiếm đóng.", isMain: true },

    { id: "ts-truong-sa-lon", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Trường Sa Lớn", name_en: "Spratly Island", lat: 8.644, lng: 111.919, occupied: false, claimants: "Việt Nam (kiểm soát), Trung Quốc, Đài Loan", desc: "Trung tâm hành chính huyện đảo Trường Sa, tỉnh Khánh Hòa.", isMain: true },
    { id: "ts-nam-yet", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Nam Yết", name_en: "Namyit Island", lat: 10.183, lng: 114.366, occupied: false, claimants: "Việt Nam (kiểm soát), Trung Quốc, Đài Loan, Philippines", desc: "Đảo san hô có hình dáng dài, nằm trong cụm Nam Yết.", isMain: true },
    { id: "ts-sinh-ton", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Sinh Tồn", name_en: "Sin Cowe Island", lat: 9.883, lng: 114.316, occupied: false, claimants: "Việt Nam (kiểm soát), Trung Quốc, Đài Loan, Philippines", desc: "Đảo có ý nghĩa chiến lược, nằm gần trung tâm quần đảo Trường Sa." },
    { id: "ts-son-ca", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Sơn Ca", name_en: "Sand Cay", lat: 10.383, lng: 114.466, occupied: false, claimants: "Việt Nam (kiểm soát)...", desc: "Thuộc cụm Nam Yết, có nhiều cây xanh và chim chóc." },
    { id: "ts-phan-vinh", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Phan Vinh", name_en: "Pearson Reef", lat: 8.966, lng: 113.683, occupied: false, claimants: "Việt Nam (kiểm soát)...", desc: "Đảo được đặt theo tên của Anh hùng lực lượng vũ trang nhân dân Nguyễn Phan Vinh." },
    { id: "ts-song-tu-tay", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đảo Song Tử Tây", name_en: "Southwest Cay", lat: 11.433, lng: 114.333, occupied: false, claimants: "Việt Nam (kiểm soát)...", desc: "Đảo lớn thứ hai do Việt Nam kiểm soát tại Trường Sa." },
    { id: "ts-chu-thap", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đá Chữ Thập", name_en: "Fiery Cross Reef", lat: 9.550, lng: 112.883, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng)...", desc: "Bị Trung Quốc bồi đắp trái phép thành đảo nhân tạo khổng lồ.", isMain: true },
    { id: "ts-vanh-khan", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đá Vành Khăn", name_en: "Mischief Reef", lat: 9.916, lng: 115.533, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng)...", desc: "Rạn san hô vòng bị Trung Quốc chiếm đóng trái phép và quân sự hóa." },
    { id: "ts-xu-bi", region: "Trường Sa", region_en: "Spratlys", name_vi: "Đá Xu Bi", name_en: "Subi Reef", lat: 10.916, lng: 114.083, occupied: true, claimants: "Việt Nam, Trung Quốc (chiếm đóng)...", desc: "Bị biến thành tiền đồn quân sự lớn của Trung Quốc trên Biển Đông." },
];