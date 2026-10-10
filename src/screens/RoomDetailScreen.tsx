import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createBookingPass,
  createBookingId,
  formatCompactDate,
  formatDate,
  getCurrentSlot,
  isSlotOccupied,
  timeSlots,
} from '../services/bookingService';
import { roomService } from '../services/roomDataSource';
import { useBookingStore } from '../store/useBookingStore';
import type { Booking } from '../types/booking';

const getDates = () => Array.from({ length: 7 }, (_, offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
});

export default function RoomDetailScreen({ roomId }: { roomId: string }) {
  const room = roomService.getRoomById(roomId);
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const dates = React.useMemo(() => getDates(), []);
  const [date, setDate] = React.useState(dates[0]);
  const [slotId, setSlotId] = React.useState<string>();
  const [message, setMessage] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [openedAt] = React.useState(() => new Date());

  if (!room) {
    return <SafeAreaView style={styles.safeArea}><Text style={styles.emptyState}>Không tìm thấy phòng</Text></SafeAreaView>;
  }

  const selectedSlot = timeSlots.find((slot) => slot.id === slotId);
  const currentSlot = getCurrentSlot(openedAt);
  const isBooked = (slot: (typeof timeSlots)[number]) =>
    isSlotOccupied(room.id, date, slot, bookings) ||
    (room.status === 'Occupied' && date === formatDate(openedAt) && slot.id === currentSlot?.id);
  const selectedBooked = selectedSlot ? isBooked(selectedSlot) : false;

  const bookRoom = async () => {
    if (!selectedSlot || selectedBooked || submitting) return;
    setSubmitting(true);
    const id = createBookingId();
    const booking: Booking = {
      id,
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'CONFIRMED',
      passCode: createBookingPass(room.id),
      createdAt: new Date().toISOString(),
    };
    const result = await addBooking(booking);
    if (!result.success) {
      setMessage(result.message);
      setSlotId(undefined);
      setSubmitting(false);
      return;
    }
    router.replace({ pathname: '/booking/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={room.image} style={styles.image} resizeMode="cover" />
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>{room.building} · Tầng {room.floor} · {room.capacity} chỗ</Text>
        <View style={styles.equipmentRow}>
          {room.equipment.map((item) => <Text key={item} style={styles.equipment}>{item}</Text>)}
        </View>

        <Text style={styles.sectionTitle}>Chọn ngày trong 7 ngày tới</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((item, index) => {
            const label = formatCompactDate(item);
            const selected = date === item;
            return (
              <Pressable
                key={item}
                onPress={() => { setDate(item); setSlotId(undefined); setMessage(undefined); }}
                style={[styles.dateButton, selected && styles.selectedDateButton]}
              >
                <Text style={[styles.weekday, selected && styles.selectedDateText]}>{index === 0 ? 'HÔM NAY' : label.weekday}</Text>
                <Text style={[styles.day, selected && styles.selectedDateText]}>{label.day}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Khung giờ 2 tiếng</Text>
        <View style={styles.slotGrid}>
          {timeSlots.map((slot) => {
            const booked = isBooked(slot);
            const selected = slotId === slot.id;
            return (
              <Pressable
                key={slot.id}
                disabled={booked}
                onPress={() => { setSlotId(slot.id); setMessage(undefined); }}
                style={[styles.slot, booked && styles.bookedSlot, selected && styles.selectedSlot]}
              >
                <Text style={[styles.slotText, booked && styles.bookedText, selected && styles.selectedText]}>{slot.startTime} – {slot.endTime}</Text>
                <Text style={[styles.slotState, selected && styles.selectedText]}>{booked ? 'ĐÃ ĐƯỢC ĐẶT' : selected ? 'ĐANG CHỌN' : 'CÒN TRỐNG'}</Text>
              </Pressable>
            );
          })}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable
          onPress={() => void bookRoom()}
          disabled={!selectedSlot || selectedBooked || submitting}
          style={({ pressed }) => [styles.bookButton, (!selectedSlot || selectedBooked || submitting || pressed) && styles.bookButtonMuted]}
        >
          <Text style={styles.bookButtonText}>{submitting ? 'Đang đặt phòng...' : 'Đặt phòng và tạo QR pass'}</Text>
        </Pressable>
        <Text style={styles.reminderHint}>Ứng dụng sẽ xin quyền và nhắc bạn check-in trước 15 phút.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fb' },
  content: { padding: 16, paddingBottom: 32 },
  image: { borderRadius: 18, height: 205, width: '100%' },
  title: { color: '#172554', fontSize: 25, fontWeight: '800', marginTop: 16 },
  subtitle: { color: '#64748b', fontSize: 14, marginTop: 4 },
  equipmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  equipment: { backgroundColor: '#eef2ff', borderRadius: 8, color: '#4338ca', fontSize: 11, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 5 },
  sectionTitle: { color: '#172554', fontSize: 17, fontWeight: '800', marginBottom: 10, marginTop: 24 },
  dateRow: { gap: 9 },
  dateButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: 12, borderWidth: 1, minWidth: 70, paddingHorizontal: 9, paddingVertical: 11 },
  selectedDateButton: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  weekday: { color: '#64748b', fontSize: 10, fontWeight: '800' },
  day: { color: '#172554', fontSize: 22, fontWeight: '800', marginTop: 4 },
  selectedDateText: { color: '#fff' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, minWidth: '47%', padding: 13 },
  bookedSlot: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  selectedSlot: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  slotText: { color: '#172554', fontSize: 14, fontWeight: '800' },
  bookedText: { color: '#94a3b8' },
  selectedText: { color: '#fff' },
  slotState: { color: '#16a34a', fontSize: 9, fontWeight: '800', marginTop: 5 },
  message: { color: '#dc2626', fontWeight: '700', marginTop: 14 },
  bookButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, marginTop: 24, padding: 16 },
  bookButtonMuted: { opacity: 0.45 },
  bookButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  reminderHint: { color: '#64748b', fontSize: 12, lineHeight: 18, marginTop: 9, textAlign: 'center' },
  emptyState: { color: '#64748b', marginTop: 40, textAlign: 'center' },
});
