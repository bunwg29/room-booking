import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { formatDateLabel } from '../services/bookingService';
import type { Booking } from '../types/booking';

interface Props {
  booking?: Booking;
  visible: boolean;
  onClose: () => void;
  onCheckIn?: () => void;
}

export default function BookingPassModal({ booking, visible, onClose, onCheckIn }: Props) {
  if (!booking) return null;
  const qrValue = JSON.stringify({
    type: 'VKU_ROOM_BOOKING',
    bookingId: booking.id,
    passCode: booking.passCode,
    roomId: booking.roomId,
    date: booking.date,
    slot: `${booking.startTime}-${booking.endTime}`,
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.eyebrow}>BOOKING PASS</Text>
          <Text style={styles.title}>{booking.roomName}</Text>
          <Text style={styles.subtitle}>{formatDateLabel(booking.date)} · {booking.startTime}–{booking.endTime}</Text>
          <View style={styles.qrFrame}>
            <QRCode value={qrValue} size={210} color="#111b3b" backgroundColor="#ffffff" />
          </View>
          <Text style={styles.code}>{booking.passCode}</Text>
          <Text style={styles.hint}>Quét mã tại cửa phòng hoặc nhấn xác nhận để mô phỏng check-in.</Text>
          {booking.status === 'CONFIRMED' && onCheckIn ? (
            <Pressable onPress={onCheckIn} style={styles.primaryButton}>
              <Text style={styles.primaryText}>Xác nhận check-in</Text>
            </Pressable>
          ) : (
            <View style={styles.checkedBadge}><Text style={styles.checkedText}>✓ Đã check-in</Text></View>
          )}
          <Pressable onPress={onClose} style={styles.closeButton}><Text style={styles.closeText}>Đóng</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(15, 23, 42, 0.65)', flex: 1, justifyContent: 'flex-end' },
  sheet: { alignItems: 'center', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 30 },
  handle: { backgroundColor: '#cbd5e1', borderRadius: 2, height: 4, marginBottom: 20, width: 48 },
  eyebrow: { color: '#2563eb', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: '#172554', fontSize: 23, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#64748b', marginTop: 5 },
  qrFrame: { backgroundColor: '#fff', borderColor: '#dbeafe', borderRadius: 18, borderWidth: 2, marginTop: 20, padding: 14 },
  code: { color: '#172554', fontFamily: 'monospace', fontSize: 13, fontWeight: '700', marginTop: 14 },
  hint: { color: '#64748b', fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 300, textAlign: 'center' },
  primaryButton: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, marginTop: 18, padding: 14, width: '100%' },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  checkedBadge: { backgroundColor: '#dcfce7', borderRadius: 12, marginTop: 18, padding: 14, width: '100%' },
  checkedText: { color: '#15803d', fontWeight: '800', textAlign: 'center' },
  closeButton: { padding: 13 },
  closeText: { color: '#475569', fontWeight: '700' },
});
