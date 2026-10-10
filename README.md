# VKU Room Booking

Ứng dụng đặt phòng học/lab theo thời gian thực dành cho Mini-Project 2 môn Cross-Platform Mobile App Development. Dự án dùng React Native, Expo SDK 57 và TypeScript.

## Chức năng

- Khám phá 12 phòng bằng `FlatList`, hiển thị ảnh, tòa/tầng, sức chứa, thiết bị và trạng thái hiện tại.
- Tìm kiếm tức thời; lọc theo trạng thái, tòa A/B/C/V, sức chứa 2–20 và thiết bị.
- Chọn một ngày trong 7 ngày tới và một trong bốn khung giờ 2 tiếng.
- Chặn slot đã đặt bằng kiểm tra giao nhau tại UI và tại Zustand store.
- Tạo booking pass duy nhất và QR check-in có thể quét thật.
- Xác nhận check-in, hủy lịch bằng nút hoặc thao tác vuốt.
- Lưu phiên người dùng và lịch đặt bằng Zustand + AsyncStorage.
- Lên lịch thông báo cục bộ trước giờ bắt đầu 15 phút bằng `expo-notifications`.
- Điều hướng file-based với Expo Router; hỗ trợ Android, iOS và web.

## Sinh viên

- Tran Ka Bun
- 23IT.B015
- buntk.23itb@vku.udn.vn

## Chạy dự án

Yêu cầu Node.js LTS và Expo Go tương thích với SDK 57.

```bash
npm ci
npx expo start
```

Các lệnh khác:

```bash
npm run android
npm run web
npm run lint
npm run typecheck
npm run doctor
npx expo export --platform web
```

Trên thiết bị thật, chọn một slot bắt đầu sau ít nhất 15 phút và cấp quyền notification để kiểm tra lời nhắc. Local notifications không cần dịch vụ push hoặc tài khoản Expo.

## Luồng sử dụng

```text
Tìm/lọc phòng
  -> Xem chi tiết
  -> Chọn ngày và slot còn trống
  -> Xác nhận đặt phòng
  -> Nhận booking pass + QR
  -> Check-in hoặc hủy lịch
```

Trạng thái phòng và slot được cập nhật ngay từ booking store. Một booking xung đột khi cùng phòng, cùng ngày và hai khoảng thời gian giao nhau:

```text
newStart < existingEnd && newEnd > existingStart
```

## Kiến trúc

```text
src/
  app/          Expo Router routes và tabs
  components/   RoomCard, BookingPassModal
  data/         Dữ liệu phòng demo
  hooks/        React Query hooks
  query/        QueryClient
  screens/      Các màn hình chức năng
  services/     Nguồn dữ liệu, xung đột, notifications
  store/        Zustand persisted store
  types/        Domain types
```

## Deliverables

- GitHub: https://github.com/bunwg29/room-booking
- APK cài trực tiếp: [`builds/VKU-Room-Booking-v1.0.0.apk`](builds/VKU-Room-Booking-v1.0.0.apk)
- Trang cài đặt EAS: https://expo.dev/accounts/kabun/projects/vku-room-booking/builds/eabbb550-9ce3-4218-9722-62859921829a
- Báo cáo Markdown: [`docs/REPORT.md`](docs/REPORT.md)
- Báo cáo PDF: [`docs/VKU-Room-Booking-Report-Tran-Ka-Bun-23IT.B015.pdf`](docs/VKU-Room-Booking-Report-Tran-Ka-Bun-23IT.B015.pdf)
- Ảnh minh chứng: [`docs/screenshots`](docs/screenshots)

## Giới hạn

Dữ liệu phòng là mock và trạng thái realtime hiện nằm trong phạm vi thiết bị. Repository chưa có backend, xác thực trường học hoặc video demo; vì vậy chưa có đồng bộ đa thiết bị.
