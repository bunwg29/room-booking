import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookingPassModal from '../components/BookingPassModal';
import { formatDateLabel } from '../services/bookingService';
import { useBookingStore } from '../store/useBookingStore';
import type { Booking } from '../types/booking';

export default function MyBookingsScreen() {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const checkInBooking = useBookingStore((state) => state.checkInBooking);
  const [selectedId, setSelectedId] = React.useState<string>();
  const selected = bookings.find((item) => item.id === selectedId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Lịch đặt phòng</Text><Text style={styles.subtitle}>Booking pass được lưu offline trên thiết bị</Text></View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, bookings.length === 0 && styles.emptyList]}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Chưa có lịch đặt phòng</Text><Text style={styles.emptyText}>Chọn một phòng và khung giờ để bắt đầu.</Text></View>}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={(id) => void cancelBooking(id)}
            onShowPass={setSelectedId}
          />
        )}
      />
      <BookingPassModal
        booking={selected}
        visible={Boolean(selected)}
        onClose={() => setSelectedId(undefined)}
        onCheckIn={selected ? () => void checkInBooking(selected.id) : undefined}
      />
    </SafeAreaView>
  );
}

function BookingCard({ booking, onCancel, onShowPass }: { booking: Booking; onCancel: (id: string) => void; onShowPass: (id: string) => void }) {
  const translateX = useSharedValue(0);
  const cancellable = booking.status === 'CONFIRMED';
  const cancel = React.useCallback(() => onCancel(booking.id), [booking.id, onCancel]);
  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .enabled(cancellable)
    .onUpdate((event) => { translateX.value = Math.min(0, event.translationX); })
    .onEnd(() => {
      if (translateX.value < -120) runOnJS(cancel)();
      translateX.value = withSpring(0);
    });
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const statusLabel = booking.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' : booking.status === 'CHECKED_IN' ? 'ĐÃ CHECK-IN' : 'ĐÃ HỦY';

  return (
    <View style={styles.swipeBackground}>
      <Text style={styles.swipeText}>Vuốt để hủy</Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.cardTop}>
            <View style={styles.cardContent}>
              <Text style={styles.roomName}>{booking.roomName}</Text>
              <Text style={styles.detail}>{booking.building}</Text>
              <Text style={styles.detail}>{formatDateLabel(booking.date)} · {booking.startTime}–{booking.endTime}</Text>
            </View>
            {booking.status !== 'CANCELLED' ? <Pressable onPress={() => onShowPass(booking.id)} style={styles.qrButton}><Text style={styles.qrIcon}>▦</Text><Text style={styles.qrLabel}>QR</Text></Pressable> : null}
          </View>
          <View style={styles.footer}>
            <Text style={[styles.status, booking.status === 'CANCELLED' && styles.cancelled, booking.status === 'CHECKED_IN' && styles.checked]}>{statusLabel}</Text>
            {cancellable ? <Pressable onPress={cancel} style={styles.cancelButton}><Text style={styles.cancelText}>Hủy đặt phòng</Text></Pressable> : null}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f7fb', flex: 1 },
  header: { backgroundColor: '#111b3b', padding: 18 },
  title: { color: '#fff', fontSize: 25, fontWeight: '800' },
  subtitle: { color: '#a5b4cf', marginTop: 4 },
  list: { gap: 12, padding: 16 },
  emptyList: { flexGrow: 1 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { color: '#334155', fontSize: 18, fontWeight: '800' },
  emptyText: { color: '#64748b', marginTop: 7 },
  swipeBackground: { backgroundColor: '#dc2626', borderRadius: 16, overflow: 'hidden' },
  swipeText: { color: '#fff', fontWeight: '800', position: 'absolute', right: 18, top: '45%' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  cardTop: { alignItems: 'center', flexDirection: 'row' },
  cardContent: { flex: 1 },
  roomName: { color: '#172554', fontSize: 17, fontWeight: '800' },
  detail: { color: '#64748b', marginTop: 6 },
  qrButton: { alignItems: 'center', backgroundColor: '#eff6ff', borderRadius: 10, marginLeft: 12, padding: 10 },
  qrIcon: { color: '#2563eb', fontSize: 24, lineHeight: 24 },
  qrLabel: { color: '#2563eb', fontSize: 9, fontWeight: '800', marginTop: 3 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  status: { color: '#15803d', fontSize: 11, fontWeight: '800' },
  cancelled: { color: '#dc2626' },
  checked: { color: '#2563eb' },
  cancelButton: { padding: 4 },
  cancelText: { color: '#dc2626', fontWeight: '700' },
});
