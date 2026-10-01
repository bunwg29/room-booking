# BÁO CÁO MINI-PROJECT

## 1. Thông tin đề tài

**Tên đề tài:** RN - Đặt Phòng Học/Lab Realtime - React Native (Robin/LibCal)

**Tên ứng dụng:** VKU Room Booking

**Nền tảng:** Expo, React Native, TypeScript

**Phạm vi hiện tại:** Ứng dụng mô phỏng quy trình tìm kiếm và đặt phòng học/phòng lab trong môi trường VKU.

> Lưu ý: Repository chưa cung cấp mẫu báo cáo chính thức của giảng viên. Tài liệu này là bản báo cáo kỹ thuật tạm thời và cần đối chiếu lại khi có template chính thức.

## 2. Mục tiêu

- Hiển thị danh sách phòng học và phòng lab.
- Hỗ trợ tìm kiếm theo tên phòng hoặc tòa nhà.
- Lọc phòng theo trạng thái còn trống hoặc đang được sử dụng.
- Xem thông tin chi tiết của phòng.
- Chọn ngày và khung giờ cần đặt.
- Ngăn đặt các khung giờ đã có lịch hoặc bị trùng thời gian.
- Hiển thị và hủy các lượt đặt phòng trong phiên hiện tại.
- Chuẩn bị ranh giới dữ liệu để có thể tích hợp Robin/LibCal sau này.

## 3. Chức năng đã thực hiện

### 3.1. Danh sách phòng

- Có 22 phòng mock.
- Hiển thị bằng `FlatList`.
- Có `SafeAreaView` và layout responsive.
- Room card dạng ngang, gọn, gồm ảnh, tên phòng, tòa nhà, sức chứa và trạng thái.

### 3.2. Tìm kiếm và bộ lọc

- Tìm kiếm không phân biệt hoa thường.
- Tìm theo `room.name` và `room.building`.
- Có ba bộ lọc:
  - Tất cả
  - Còn trống
  - Đang sử dụng
- Bộ lọc kết hợp được với tìm kiếm.
- Số lượng phòng thay đổi theo kết quả lọc.
- Có trạng thái rỗng: “Không tìm thấy phòng”.

### 3.3. Điều hướng

Ứng dụng sử dụng React Navigation với cấu trúc:

- Duyệt phòng
- Lịch đặt phòng
- Hồ sơ

Màn hình duyệt phòng có stack điều hướng đến màn hình chi tiết phòng.

### 3.4. Chi tiết phòng và chọn khung giờ

Màn hình chi tiết hiển thị:

- Ảnh phòng
- Tên phòng
- Tòa nhà
- Sức chứa
- Các ngày có thể chọn
- Các khung giờ:
  - Còn trống
  - Đã được đặt
  - Đang chọn

Khung giờ đã được đặt bị vô hiệu hóa và không thể chọn.

### 3.5. Đặt và hủy phòng

- Nút đặt phòng chỉ hoạt động khi đã chọn khung giờ hợp lệ.
- Đặt phòng thành công được thêm vào danh sách “Lịch đặt phòng”.
- Có thể hủy lượt đặt đang ở trạng thái đã xác nhận.
- Trạng thái khung giờ được cập nhật lại sau khi đặt hoặc hủy.

### 3.6. Kiểm tra xung đột

Một lượt đặt bị xem là xung đột khi thỏa cả ba điều kiện:

- Cùng phòng.
- Cùng ngày.
- Khoảng thời gian bị giao nhau.

Công thức kiểm tra:

```text
newStart < existingEnd AND newEnd > existingStart
```

Việc kiểm tra được thực hiện trong service booking, không chỉ dựa vào trạng thái hiển thị trên giao diện.

## 4. Công nghệ sử dụng

- Expo SDK 57
- React Native
- TypeScript với strict mode
- React Navigation
- React Native Safe Area Context
- FlatList
- StyleSheet
- React Context cho trạng thái booking trong phiên

## 5. Kiến trúc thư mục chính

```text
App.tsx
src/
  components/
    RoomCard.tsx
  context/
    BookingContext.tsx
  data/
    rooms.ts
  navigation/
    AppNavigator.tsx
    types.ts
  screens/
    BrowseRoomsScreen.tsx
    RoomDetailScreen.tsx
    RoomListScreen.tsx
    MyBookingsScreen.tsx
    ProfileScreen.tsx
  services/
    bookingDataSource.ts
    bookingService.ts
    roomDataSource.ts
  types/
    booking.ts
    room.ts
```

## 6. Ranh giới dữ liệu Robin/LibCal

Hiện tại ứng dụng chỉ sử dụng mock data.

Đã chuẩn bị các abstraction:

- `RoomDataSource`
- `BookingDataSource`
- Mock room data source
- Mock booking data source

Repository chưa có:

- Endpoint chính thức.
- API key hoặc thông tin xác thực.
- Response schema của Robin/LibCal.
- Tài liệu tích hợp do giảng viên cung cấp.

Vì vậy chưa triển khai API thật và không tự tạo endpoint giả. Robin/LibCal integration requires official API/configuration information.

## 7. Kiểm thử và xác nhận

| Hạng mục | Kết quả |
|---|---|
| TypeScript `npx tsc --noEmit` | PASS |
| Có ít nhất 20 phòng mock | PASS - 22 phòng |
| FlatList danh sách phòng | PASS |
| Tìm kiếm phòng | PASS |
| Lọc trạng thái | PASS |
| Tìm kiếm kết hợp bộ lọc | PASS |
| Trạng thái không có kết quả | PASS |
| Điều hướng đến chi tiết phòng | PASS |
| Chọn khung giờ còn trống | PASS |
| Chặn khung giờ đã đặt | PASS |
| Kiểm tra xung đột booking | PASS |
| Hiển thị lịch đặt phòng | PASS |
| Hủy booking mock | PASS |
| Expo runtime/device | Chưa xác nhận trong môi trường hiện tại |

## 8. Giới hạn hiện tại

- Dữ liệu booking chỉ lưu trong bộ nhớ và mất khi khởi động lại ứng dụng.
- Chưa có đăng nhập và xác thực người dùng.
- Chưa đồng bộ realtime với server.
- Chưa tích hợp API Robin/LibCal.
- Chưa có ảnh chụp màn hình hoặc live demo được triển khai.
- Báo cáo chính thức cần cập nhật theo template của giảng viên khi được cung cấp.

## 9. Hướng phát triển

1. Nhận tài liệu API chính thức của Robin/LibCal.
2. Viết adapter triển khai các interface data source hiện tại.
3. Thay mock booking bằng dữ liệu từ server.
4. Bổ sung đồng bộ availability realtime.
5. Bổ sung kiểm thử tự động cho booking và conflict prevention.
6. Hoàn thiện báo cáo theo template chính thức.

## 10. Kết luận

VKU Room Booking đã hoàn thiện các chức năng cốt lõi của mini-project: duyệt phòng, tìm kiếm, lọc, xem chi tiết, chọn khung giờ, đặt phòng, kiểm tra xung đột và quản lý lịch đặt trong phiên. Kiến trúc hiện tại giữ được phạm vi mock an toàn và sẵn sàng mở rộng sang Robin/LibCal khi có tài liệu tích hợp chính thức.
