import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDateLabel } from '../services/bookingService';
import { useBookingStore } from '../store/useBookingStore';
import type { Booking } from '../types/booking';

export default function MyBookingsScreen() {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Text style={styles.title}>Lịch đặt phòng</Text><Text style={styles.subtitle}>Các phòng bạn đã đăng ký</Text></View>
    <FlatList data={bookings} keyExtractor={(item) => item.id} contentContainerStyle={[styles.list, bookings.length === 0 && styles.emptyList]}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Chưa có lịch đặt phòng.</Text><Text style={styles.emptyText}>Các phòng bạn đặt sẽ xuất hiện tại đây.</Text></View>}
      renderItem={({ item }) => <BookingCard booking={item} onCancel={cancelBooking} />} />
  </SafeAreaView>;
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  const translateX = useSharedValue(0);
  const cancel = React.useCallback(() => onCancel(booking.id), [booking.id, onCancel]);
  const pan = Gesture.Pan().activeOffsetX([-12, 12]).failOffsetY([-12, 12]).enabled(booking.status === 'CONFIRMED')
    .onUpdate((event) => { translateX.value = Math.min(0, event.translationX); })
    .onEnd(() => { if (translateX.value < -120) runOnJS(cancel)(); translateX.value = withSpring(0); });
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  return <View style={styles.swipeBackground}><Text style={styles.swipeText}>Vuốt để hủy</Text><GestureDetector gesture={pan}>
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.roomName}>{booking.roomName}</Text><Text style={styles.detail}>{booking.building}</Text>
      <Text style={styles.detail}>{formatDateLabel(booking.date)}  |  {booking.startTime} – {booking.endTime}</Text>
      <View style={styles.footer}><Text style={[styles.status, booking.status === 'CANCELLED' && styles.cancelled]}>{booking.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' : 'ĐÃ HỦY'}</Text>
        {booking.status === 'CONFIRMED' ? <Pressable onPress={cancel} style={styles.cancelButton}><Text style={styles.cancelText}>Hủy đặt phòng</Text></Pressable> : null}</View>
    </Animated.View>
  </GestureDetector></View>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f4f6', flex: 1 }, header: { backgroundColor: '#1a1a2e', padding: 18 }, title: { color: '#fff', fontSize: 24, fontWeight: '700' }, subtitle: { color: '#cbd5e1', marginTop: 4 }, list: { gap: 12, padding: 16 }, emptyList: { flexGrow: 1 }, empty: { alignItems: 'center', marginTop: 40 }, emptyTitle: { color: '#334155', fontSize: 17, fontWeight: '700' }, emptyText: { color: '#64748b', marginTop: 6 },
  swipeBackground: { backgroundColor: '#dc2626', borderRadius: 14, overflow: 'hidden' }, swipeText: { color: '#fff', fontWeight: '700', position: 'absolute', right: 18, top: '45%' }, card: { backgroundColor: '#fff', borderRadius: 14, padding: 16 }, roomName: { color: '#172554', fontSize: 17, fontWeight: '700' }, detail: { color: '#64748b', marginTop: 6 }, footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, status: { color: '#15803d', fontSize: 12, fontWeight: '700' }, cancelled: { color: '#dc2626' }, cancelButton: { padding: 4 }, cancelText: { color: '#dc2626', fontWeight: '600' },
});
