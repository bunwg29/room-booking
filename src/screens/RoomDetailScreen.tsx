import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { formatCompactDate, formatDate, isSlotOccupied, timeSlots } from '../services/bookingService';
import { roomService } from '../services/roomDataSource';
import { useBookingStore } from '../store/useBookingStore';
import type { Booking } from '../types/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomDetails'>;
const getDates = () => Array.from({ length: 7 }, (_, offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
});
const createBookingMetadata = () => ({
  id: `booking-${Date.now()}`,
  createdAt: new Date().toISOString(),
});

export default function RoomDetailScreen({ route, navigation }: Props) {
  const room = roomService.getRoomById(route.params.roomId);
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const dates = React.useMemo(() => getDates(), []);
  const [date, setDate] = React.useState(dates[0]);
  const [slotId, setSlotId] = React.useState<string>();
  const [message, setMessage] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);

  if (!room) return <SafeAreaView style={styles.safeArea}><Text style={styles.emptyState}>Không tìm thấy phòng</Text></SafeAreaView>;
  const selectedSlot = timeSlots.find((slot) => slot.id === slotId);
  const selectedBooked = selectedSlot ? isSlotOccupied(room.id, date, selectedSlot, bookings) : false;

  const bookRoom = () => {
    if (!selectedSlot || selectedBooked || submitting) return;
    setSubmitting(true);
    const booking: Booking = {
      ...createBookingMetadata(), roomId: room.id, roomName: room.name, building: room.building,
      date, startTime: selectedSlot.startTime, endTime: selectedSlot.endTime,
      status: 'CONFIRMED',
    };
    const result = addBooking(booking);
    if (!result.success) {
      setMessage(result.message);
      setSlotId(undefined);
      setSubmitting(false);
      return;
    }
    navigation.replace('BookingConfirmation', { bookingId: booking.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={room.image} style={styles.image} resizeMode="cover" />
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>{room.building}  |  {room.capacity} chỗ</Text>
        <Text style={styles.sectionTitle}>Chọn ngày</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((item, index) => {
            const label = formatCompactDate(item);
            const selected = date === item;
            return <Pressable key={item} onPress={() => { setDate(item); setSlotId(undefined); setMessage(undefined); }} style={[styles.dateButton, selected && styles.selectedDateButton]}>
              <Text style={[styles.weekday, selected && styles.selectedDateText]}>{index === 0 ? 'HÔM NAY' : label.weekday}</Text>
              <Text style={[styles.day, selected && styles.selectedDateText]}>{label.day}</Text>
            </Pressable>;
          })}
        </ScrollView>
        <Text style={styles.sectionTitle}>Khung giờ</Text>
        <View style={styles.slotGrid}>{timeSlots.map((slot) => {
          const booked = isSlotOccupied(room.id, date, slot, bookings);
          const selected = slotId === slot.id;
          return <Pressable key={slot.id} disabled={booked} onPress={() => { setSlotId(slot.id); setMessage(undefined); }} style={[styles.slot, booked && styles.bookedSlot, selected && styles.selectedSlot]}>
            <Text style={[styles.slotText, booked && styles.bookedSlotText, selected && styles.selectedSlotText]}>{slot.startTime} – {slot.endTime}</Text>
            <Text style={styles.slotState}>{booked ? 'ĐÃ ĐƯỢC ĐẶT' : selected ? 'ĐANG CHỌN' : 'CÒN TRỐNG'}</Text>
          </Pressable>;
        })}</View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable onPress={bookRoom} disabled={!selectedSlot || selectedBooked || submitting} style={({ pressed }) => [styles.bookButton, (!selectedSlot || selectedBooked || submitting || pressed) && styles.bookButtonMuted]}>
          <Text style={styles.bookButtonText}>{submitting ? 'Đang đặt phòng...' : 'Đặt phòng này'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' }, content: { padding: 16, paddingBottom: 28 }, image: { borderRadius: 16, height: 190, width: '100%' },
  title: { color: '#172554', fontSize: 24, fontWeight: '700', marginTop: 16 }, subtitle: { color: '#64748b', fontSize: 15, marginTop: 6 }, sectionTitle: { color: '#172554', fontSize: 17, fontWeight: '700', marginTop: 24 },
  dateRow: { gap: 8, paddingTop: 10 }, dateButton: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, minWidth: 70, padding: 10 }, selectedDateButton: { backgroundColor: '#1d4ed8' }, weekday: { color: '#64748b', fontSize: 10, fontWeight: '700' }, day: { color: '#172554', fontSize: 20, fontWeight: '700', marginTop: 3 }, selectedDateText: { color: '#fff' },
  slotGrid: { gap: 10, paddingTop: 10 }, slot: { backgroundColor: '#fff', borderRadius: 10, padding: 13 }, selectedSlot: { backgroundColor: '#dbeafe', borderColor: '#1d4ed8', borderWidth: 1 }, bookedSlot: { backgroundColor: '#f1f5f9', opacity: 0.65 }, slotText: { color: '#172554', fontSize: 15, fontWeight: '700' }, selectedSlotText: { color: '#1d4ed8' }, bookedSlotText: { color: '#94a3b8' }, slotState: { color: '#64748b', fontSize: 11, marginTop: 3 },
  message: { color: '#dc2626', fontWeight: '600', marginTop: 14 }, bookButton: { alignItems: 'center', backgroundColor: '#1d4ed8', borderRadius: 10, marginTop: 18, padding: 14 }, bookButtonMuted: { backgroundColor: '#94a3b8' }, bookButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' }, emptyState: { color: '#64748b', padding: 24 },
});
