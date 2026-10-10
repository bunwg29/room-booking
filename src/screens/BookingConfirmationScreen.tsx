import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookingPassModal from '../components/BookingPassModal';
import { formatDateLabel } from '../services/bookingService';
import { useBookingStore } from '../store/useBookingStore';

export default function BookingConfirmationScreen({ bookingId }: { bookingId: string }) {
  const booking = useBookingStore((state) => state.bookings.find((item) => item.id === bookingId));
  const checkIn = useBookingStore((state) => state.checkInBooking);
  const [showPass, setShowPass] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
        <Text style={styles.title}>Đặt phòng thành công</Text>
        <Text style={styles.subtitle}>Booking pass đã được tạo và lưu trên thiết bị.</Text>
        {booking ? (
          <View style={styles.pass}>
            <Row label="Phòng" value={booking.roomName} />
            <Row label="Tòa nhà" value={booking.building} />
            <Row label="Ngày" value={formatDateLabel(booking.date)} />
            <Row label="Thời gian" value={`${booking.startTime} – ${booking.endTime}`} />
            <View style={styles.divider} />
            <Row label="Mã đặt phòng" value={booking.passCode} />
          </View>
        ) : <Text style={styles.missing}>Không tìm thấy thông tin đặt phòng.</Text>}

        {booking ? <Pressable onPress={() => setShowPass(true)} style={styles.qrButton}><Text style={styles.qrText}>▦ Mở QR check-in</Text></Pressable> : null}
        <Pressable onPress={() => router.replace('/bookings')} style={styles.doneButton}><Text style={styles.doneText}>Xem lịch đã đặt</Text></Pressable>
      </View>
      <BookingPassModal
        booking={booking}
        visible={showPass}
        onClose={() => setShowPass(false)}
        onCheckIn={booking ? () => void checkIn(booking.id) : undefined}
      />
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f7fb', flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  check: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#dcfce7', borderRadius: 38, height: 76, justifyContent: 'center', width: 76 },
  checkText: { color: '#15803d', fontSize: 40, fontWeight: '800' },
  title: { color: '#172554', fontSize: 26, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  subtitle: { color: '#64748b', lineHeight: 19, marginBottom: 22, marginTop: 6, textAlign: 'center' },
  pass: { backgroundColor: '#fff', borderRadius: 18, gap: 13, padding: 20 },
  row: { gap: 3 },
  label: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: '#172554', fontSize: 16, fontWeight: '800' },
  divider: { backgroundColor: '#e2e8f0', height: 1 },
  missing: { color: '#dc2626', textAlign: 'center' },
  qrButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, marginTop: 20, padding: 15 },
  qrText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  doneButton: { alignItems: 'center', padding: 14 },
  doneText: { color: '#2563eb', fontSize: 15, fontWeight: '800' },
});
