<div align="center">

  <img src="./public/leaf-logo-light.png" width="110" height="110" alt="EcoGom Logo" style="border-radius: 24px; margin-bottom: 12px;" />

  <h1>EcoGom Web - Smart Waste Portal & Admin Management Dashboard</h1>
  <h3>Cổng Thông Tin Tra Cứu Lịch Thu Gom, Bản Đồ Điểm Gom Rác & Bảng Điều Khiển Quản Trị Trung Tâm</h3>

  <p>
    Nền tảng giao diện người dùng thế hệ mới xây dựng trên Next.js 16 App Router và React 19, 
    cung cấp giải pháp tra cứu phân loại rác thông minh, theo dõi lịch thu gom theo từng thôn xóm 
    và trực quan hóa mạng lưới điểm gom rác trên bản đồ số tương tác Leaflet.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.2.7-61DAFB?logo=react&logoColor=black" alt="React 19">
    <img src="https://img.shields.io/badge/TailwindCSS-v4.3.0-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white" alt="Leaflet">
    <img src="https://img.shields.io/badge/Recharts-v3.8.1-22c55e?logo=chartdotjs&logoColor=white" alt="Recharts">
    <img src="https://img.shields.io/badge/status-Active_Development-success" alt="Status">
  </p>

</div>

<br />

# FRONTEND WEB PORTAL & ADMIN MANAGEMENT DASHBOARD

Đây là kho lưu trữ chứa mã nguồn **Frontend Web** của hệ thống **EcoGom**. Ứng dụng được xây dựng theo kiến trúc **Next.js 16 App Router** hiện đại nhất, kết hợp cùng **React 19** và **Tailwind CSS v4**, mang lại trải nghiệm tương tác mượt mà, phản hồi tức thời và hỗ trợ hiển thị tối ưu trên mọi độ phân giải màn hình.

Dự án đã được rà soát và cập nhật lên phiên bản **Next.js 16.4.3** và **Axios 1.20.0** nhằm khắc phục hoàn toàn các lỗ hổng bảo mật nghiêm trọng (RCE, SSRF, Cache Poisoning và DoS).

---

## Mục lục

- [1. Công nghệ & Thư viện Cốt lõi](#1-công-nghệ--thư-viện-cốt-lõi)
  - [Khung Giao diện & Nền tảng Ứng dụng](#khung-giao-diện--nền-tảng-ứng-dụng)
  - [Bản đồ Tương tác & Trực quan hóa Dữ liệu](#bản-đồ-tương-tác--trực-quan-hóa-dữ-liệu)
  - [Thiết kế Giao diện, Kiểu dáng & Biểu tượng](#thiết-kế-giao-diện-kiểu-dáng--biểu-tượng)
  - [Giao tiếp Mạng & Xử lý Yêu cầu HTTP](#giao-tiếp-mạng--xử-lý-yêu-cầu-http)
- [2. Tính năng Giao diện & Kiến trúc Trải nghiệm Người dùng](#2-tính-năng-giao-diện--kiến-trúc-trải-nghiệm-người-dùng)
  - [2.1. Cổng Thông tin Tra cứu Công cộng (`/`)](#21-cổng-thông-tin-tra-cứu-công-cộng-)
  - [2.2. Bản đồ Điểm Thu gom Tương tác Leaflet](#22-bản-đồ-điểm-thu-gom-tương-tác-leaflet)
  - [2.3. Bảng Quản trị Hệ thống Trung tâm (`/admin`)](#23-bảng-quản-trị-hệ-thống-trung-tâm-admin)
  - [2.4. Phân hệ Quản trị Chuyên biệt (Rác, Lịch trình, Điểm gom)](#24-phân-hệ-quản-trị-chuyên-biệt-rác-lịch-trình-điểm-gom)
- [3. Demo Giao diện Người dùng](#3-demo-giao-diện-người-dùng)
- [4. Hướng dẫn Cài đặt & Khởi chạy](#4-hướng-dẫn-cài-đặt--khởi-chạy)
- [5. Cấu trúc Thư mục Dự án](#5-cấu-trúc-thư-mục-dự-án)
- [6. Kết nối Backend API Service](#6-kết-nối-backend-api-service)
- [7. Tác giả](#7-tác-giả)

---

## 1. Công nghệ & Thư viện Cốt lõi

Hệ thống Frontend được xây dựng trên nền tảng công nghệ web tiên tiến:

### Khung Giao diện & Nền tảng Ứng dụng

| Công nghệ / Thư viện | Phiên bản | Vai trò Kỹ thuật |
| :--- | :--- | :--- |
| **[Next.js](https://nextjs.org/)** | `16.4.3` | Khung ứng dụng React App Router, Server Components và Turbopack (Bản vá an toàn lỗ hổng RCE/SSRF) |
| **[React](https://react.dev/)** | `19.2.7` | Thư viện UI cốt lõi phiên bản React 19 tối ưu render với React DOM 19 |
| **[TypeScript](https://www.typescriptlang.org/)** | `^5.0.0` | Đảm bảo tính an toàn kiểu dữ liệu (Type Safety) trên toàn bộ dự án |

---

### Bản đồ Tương tác & Trực quan hóa Dữ liệu

| Công nghệ / Thư viện | Phiên bản | Vai trò Kỹ thuật |
| :--- | :--- | :--- |
| **[Leaflet](https://leafletjs.com/)** | `^1.9.4` | Thư viện bản đồ số mã nguồn mở mạnh mẽ, hỗ trợ hiển thị tọa độ và tương tác đa điểm |
| **[React Leaflet](https://react-leaflet.js.org/)** | `^5.0.0` | Cầu nối tích hợp các thành phần bản đồ Leaflet vào hệ sinh thái React |
| **[Recharts](https://recharts.org/)** | `^3.8.1` | Vẽ biểu đồ thống kê trực quan số lượng rác thải, lịch trình và điểm gom tại trang Admin |

---

### Thiết kế Giao diện, Kiểu dáng & Biểu tượng

| Công nghệ / Thư viện | Phiên bản | Vai trò Kỹ thuật |
| :--- | :--- | :--- |
| **[Tailwind CSS](https://tailwindcss.com/)** | `^4.3.0` | Framework CSS Utility-first thế hệ v4 với kiến trúc CSS-first qua `@tailwindcss/postcss` |
| **[Lucide React](https://lucide.dev/)** | `^0.563.0` | Bộ biểu tượng SVG đồng bộ, sắc nét, thay thế hoàn toàn chat emoji |
| **[React Hot Toast](https://react-hot-toast.com/)** | `^2.6.0` | Hiển thị thông báo phản hồi thao tác nhẹ nhàng, bắt mắt |

---

### Giao tiếp Mạng & Xử lý Yêu cầu HTTP

| Công nghệ / Thư viện | Phiên bản | Vai trò Kỹ thuật |
| :--- | :--- | :--- |
| **[Axios](https://axios-http.com/)** | `^1.20.0` | HTTP Client xử lý các yêu cầu REST API, tự động đính kèm JWT Bearer Token |

---

## 2. Tính năng Giao diện & Kiến trúc Trải nghiệm Người dùng

Ứng dụng phân chia kiến trúc giao diện theo mô hình Route Groups độc lập:

### 2.1. Cổng Thông tin Tra cứu Công cộng (`/`)
* **Thanh Tìm Kiếm Nhanh (Search Input):**
  Hỗ trợ tra cứu tức thời tên các loại rác thải sinh hoạt, rác tái chế và rác độc hại.
* **Thanh Bộ Lọc Danh Mục (Filter Tabs):**
  Lọc nhanh theo các phân loại chuẩn (*Tất cả, Rác tái chế, Rác hữu cơ, Rác nguy hại, Rác khác*).
* **Thẻ Lịch Thu Gom Hôm Nay (Schedule Card):**
  Hiển thị trực quan giờ xe đến gom, địa bàn phục vụ và loại rác được thu gom trong ngày.
* **Modal Chọn Thôn / Xóm (Village Modal):**
  Cho phép người dân lựa chọn địa bàn sinh sống theo danh sách nhóm cấp Xã/Phường.
* **Chi Tiết Rác Thải (Waste Detail Modal):**
  Mở hộp thoại cung cấp hướng dẫn thu gom, phân loại và tái chế rác đúng chuẩn môi trường.

---

### 2.2. Bản đồ Điểm Thu gom Tương tác Leaflet
* **Hiển Thị Tọa Độ Điểm Gom:**
  Render các điểm tập kết rác trên nền bản đồ số vệ tinh và đường phố.
* **Tự Động Định Vị Người Dùng:**
  Sử dụng Geolocation API để định vị vị trí hiện tại của người dùng, hỗ trợ tìm kiếm điểm gom rác gần nhất.
* **Tùy Biến Marker & Tooltip:**
  Marker sinh động kèm popup hiển thị thông tin địa chỉ, loại điểm gom và ghi chú tiếp nhận.

---

### 2.3. Bảng Quản trị Hệ thống Trung tâm (`/admin`)
* **Thống Kê Số Liệu Hoạt Động (Overview Dashboard):**
  Biểu đồ Recharts tổng hợp số lượng danh mục rác đang quản lý, số điểm thu gom và tổng số lịch trình đang vận hành.
* **Huy Hiệu Trạng Thái Hệ Thống:**
  Theo dõi tình trạng kết nối máy chủ và tính sẵn sàng của cơ sở dữ liệu.

---

### 2.4. Phân hệ Quản trị Chuyên biệt (Rác, Lịch trình, Điểm gom)
* **Quản Lý Danh Mục Rác (`/admin/wastes`):**
  Thêm mới, chỉnh sửa thông tin, cập nhật hình ảnh và cấu hình hướng dẫn phân loại rác thải.
* **Quản Lý Lịch Trình Thu Gom (`/admin/schedules`):**
  Lập kế hoạch thu gom rác theo thứ trong tuần, thiết lập khung giờ và tuyến đường xe gom.
* **Quản Lý Điểm Thu Gom (`/admin/locations`):**
  Thêm mới vị trí điểm tập kết, cập nhật tọa độ địa lý (Latitude / Longitude) trực tiếp.
* **Bảo Vệ Đăng Nhập (`/login`):**
  Trang xác thực quản trị viên bảo mật với JWT Token, tự động lưu phiên và kiểm soát quyền truy cập.

---

## 3. Demo Giao diện Người dùng

<div align="center">
  <img src="./public/leaf-logo-light.png" width="280" alt="EcoGom Web Preview" style="border-radius: 16px; margin: 16px 0;" />
  <p><em>Giao diện Cổng Thông tin EcoGom Web Portal</em></p>
</div>

---

## 4. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu Hệ thống
* **Node.js:** Phiên bản `>= 20.0.0` (Khuyến nghị **Node.js 20.x** hoặc **22.x LTS**).
* **Trình quản lý gói:** `npm` (>= 9), `yarn` hoặc `pnpm`.
* **Backend Service:** Máy chủ **EcoGom Backend API** đang hoạt động tại cổng `3001`.

### Quy trình Cài đặt

```bash
# 1. Tải mã nguồn Frontend về máy cục bộ
git clone https://github.com/hvt299/EcoGom-Web.git
cd EcoGom-Web

# 2. Cài đặt toàn bộ thư viện phụ thuộc
npm install
```

### Cấu hình Biến Môi trường (.env.local)

Tạo tệp `.env.local` tại thư mục gốc của dự án:

```env
# Địa chỉ máy chủ Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Các Lệnh Thực thi

```bash
# 1. Khởi chạy môi trường phát triển (Dev Server tại port 3000 với Turbopack)
npm run dev

# 2. Biên dịch bản phát hành sản phẩm (Production Build)
npm run build

# 3. Khởi chạy bản production đã biên dịch
npm run start

# 4. Kiểm tra lỗi cú pháp và quy chuẩn mã nguồn (ESLint)
npm run lint
```

Sau khi khởi chạy thành công, truy cập ứng dụng trên trình duyệt tại địa chỉ:
```text
http://localhost:3000
```

---

## 5. Cấu trúc Thư mục Dự án

```text
EcoGom-Web/
├── app/                           # Cấu trúc Next.js App Router phân theo Route Groups
│   ├── (auth)/                    # Luồng xác thực tài khoản quản trị
│   │   └── login/                 # Trang đăng nhập quản trị viên
│   ├── (public)/                  # Cổng tra cứu công cộng dành cho người dân
│   │   └── page.tsx               # Trang chủ tra cứu rác, lịch gom và bản đồ
│   ├── admin/                     # Phân hệ Quản trị Trung tâm
│   │   ├── locations/             # Quản lý tọa độ và điểm thu gom rác
│   │   ├── schedules/             # Quản lý lịch trình xe gom theo địa bàn
│   │   ├── wastes/                # Quản lý danh mục rác thải và hướng dẫn phân loại
│   │   └── page.tsx               # Bảng điều khiển thống kê tổng quan (Recharts)
│   ├── globals.css                # CSS Variables và thiết lập màu sắc Tailwind v4
│   └── layout.tsx                 # Root Layout cấu hình Font Geist và Metadata
├── components/                    # Tầng các thành phần giao diện tái sử dụng
│   ├── admin/                     # Các components quản trị (Overview, Forms, Tables)
│   ├── Home/                      # Các components trang chủ (Search, Filters, Modals)
│   └── Map/                       # Bản đồ Leaflet tương tác động (Dynamic Client Component)
├── services/                      # Tầng giao tiếp HTTP API
│   └── api.ts                     # Cấu hình Axios Client gọi REST Endpoints
├── types/                         # Định nghĩa kiểu dữ liệu tĩnh TypeScript
│   ├── location.ts                # Kiểu dữ liệu điểm thu gom rác
│   ├── schedule.ts                # Kiểu dữ liệu lịch trình thu gom
│   └── waste.ts                   # Kiểu dữ liệu danh mục rác thải
├── utils/                         # Các hàm tiện ích bổ trợ
├── public/                        # Tài nguyên tệp tĩnh (Logo, Icons, SVGs)
│   ├── leaf-logo-light.png        # Logo nhận diện thương hiệu EcoGom
│   └── favicon.ico                # Biểu tượng tab trình duyệt
├── package.json                   # Danh mục thư viện và scripts dự án
└── tsconfig.json                  # Cấu hình kiểm tra kiểu dữ liệu TypeScript
```

---

## 6. Kết nối Backend API Service

Ứng dụng Frontend được thiết kế để kết nối trực tiếp với **EcoGom Backend API** (chạy tại cổng mặc định `3001`):
* Cấu hình chia sẻ tài nguyên (CORS) đã được mở và kiểm soát an toàn từ phía máy chủ.
* Các yêu cầu HTTP bảo mật của Quản trị viên tự động được đóng gói kèm `Authorization: Bearer <token>` thông qua Axios Interceptors.
* Đảm bảo cập nhật chính xác địa chỉ API trong tệp cấu hình: `NEXT_PUBLIC_API_URL=http://localhost:3001`.

---

## 7. Tác giả

Được phát triển bởi **Mr.T (hvt299)**  
GitHub: [https://github.com/hvt299](https://github.com/hvt299)
