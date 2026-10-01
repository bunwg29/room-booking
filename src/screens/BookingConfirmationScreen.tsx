import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { formatDateLabel } from '../services/bookingService';
import { useBookingStore } from '../store/useBookingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ route, navigation }: Props) {
  const booking = useBookingStore((state) => state.bookings.find((item) => item.id === route.params.bookingId));
  const done = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'MyBookings' } }] });

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.content}>
      <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
      <Text style={styles.title}>Đặt phòng thành công</Text>
      {booking ? <View style={styles.pass}>
        <Row label="Phòng" value={booking.roomName} /><Row label="Tòa nhà" value={booking.building} />
        <Row label="Ngày" value={formatDateLabel(booking.date)} /><Row label="Thời gian" value={`${booking.startTime} – ${booking.endTime}`} />
        <View style={styles.divider} /><Row label="Mã đặt phòng" value={booking.id} />
      </View> : <Text style={styles.missing}>Không tìm thấy thông tin đặt phòng.</Text>}
      <Pressable onPress={done} style={styles.doneButton}><Text style={styles.doneText}>Hoàn tất</Text></Pressable>
    </View>
  </SafeAreaView>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f4f6', flex: 1 }, content: { flex: 1, justifyContent: 'center', padding: 24 }, check: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#dcfce7', borderRadius: 36, height: 72, justifyContent: 'center', width: 72 }, checkText: { color: '#15803d', fontSize: 38, fontWeight: '700' }, title: { color: '#172554', fontSize: 25, fontWeight: '700', marginBottom: 24, marginTop: 16, textAlign: 'center' },
  pass: { backgroundColor: '#fff', borderRadius: 16, gap: 14, padding: 20 }, row: { gap: 3 }, label: { color: '#64748b', fontSize: 12, fontWeight: '600' }, value: { color: '#172554', fontSize: 16, fontWeight: '700' }, divider: { backgroundColor: '#e2e8f0', height: 1 }, missing: { color: '#dc2626', textAlign: 'center' }, doneButton: { alignItems: 'center', backgroundColor: '#1d4ed8', borderRadius: 10, marginTop: 24, padding: 14 }, doneText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
