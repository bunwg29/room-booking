import React, { type ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../store/useBookingStore';

type IconName = ComponentProps<typeof Ionicons>['name'];

const appInformation: { icon: IconName; label: string; value: string }[] = [
  { icon: 'school-outline', label: 'Ứng dụng', value: 'VKU Room Booking' },
  { icon: 'phone-portrait-outline', label: 'Nền tảng', value: 'React Native + Expo' },
  { icon: 'code-slash-outline', label: 'Dự án', value: 'Mini-Project 2' },
  { icon: 'information-circle-outline', label: 'Chế độ', value: 'Demo / Local Data' },
];

export default function ProfileScreen() {
  const activeBookings = useBookingStore(
    (state) => state.bookings.filter((booking) => booking.status === 'CONFIRMED').length,
  );
  const cancelledBookings = useBookingStore(
    (state) => state.bookings.filter((booking) => booking.status === 'CANCELLED').length,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Hồ sơ</Text>
        <Text style={styles.subtitle}>Đặt phòng VKU</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
          <Text style={styles.name}>Nguyễn Bá Thiện </Text>
          <Text style={styles.caption}>0901234567 / thiennb@vku.udn.vn</Text>
          <View style={styles.badge}>
            <Ionicons name="flask-outline" size={14} color="#1d4ed8" />
            <Text style={styles.badgeText}>Demo Mode</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lịch đặt</Text>
        <View style={styles.statisticsRow}>
          <StatisticCard icon="calendar-outline" value={activeBookings} label="Đang hoạt động" color="#1d4ed8" backgroundColor="#eff6ff" />
          <StatisticCard icon="close-circle-outline" value={cancelledBookings} label="Đã hủy" color="#dc2626" backgroundColor="#fff1f2" />
        </View>

        <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
        <View style={styles.informationCard}>
          {appInformation.map((item, index) => (
            <InformationRow key={item.label} {...item} showDivider={index < appInformation.length - 1} />
          ))}
        </View>

        <View style={styles.notice}>
          <View style={styles.noticeIcon}><Ionicons name="information-circle-outline" size={22} color="#1d4ed8" /></View>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Chế độ Demo</Text>
            <Text style={styles.noticeText}>Ứng dụng Mini-Project sử dụng dữ liệu cục bộ và không yêu cầu đăng nhập.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatisticCard({ icon, value, label, color, backgroundColor }: { icon: IconName; value: number; label: string; color: string; backgroundColor: string }) {
  return <View style={styles.statisticCard}>
    <View style={[styles.statisticIcon, { backgroundColor }]}><Ionicons name={icon} size={20} color={color} /></View>
    <Text style={[styles.statisticValue, { color }]}>{value}</Text>
    <Text style={styles.statisticLabel}>{label}</Text>
  </View>;
}

function InformationRow({ icon, label, value, showDivider }: { icon: IconName; label: string; value: string; showDivider: boolean }) {
  return <View style={[styles.informationRow, showDivider && styles.informationDivider]}>
    <View style={styles.informationIcon}><Ionicons name={icon} size={20} color="#1d4ed8" /></View>
    <View style={styles.informationText}><Text style={styles.informationLabel}>{label}</Text><Text style={styles.informationValue}>{value}</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f4f6', flex: 1 },
  header: { backgroundColor: '#1a1a2e', paddingHorizontal: 18, paddingVertical: 14 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' }, subtitle: { color: '#cbd5e1', marginTop: 3 },
  content: { padding: 16, paddingBottom: 32 },
  profileCard: { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 18, elevation: 2, padding: 22, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  avatar: { alignItems: 'center', backgroundColor: '#dbeafe', borderColor: '#bfdbfe', borderRadius: 42, borderWidth: 3, height: 84, justifyContent: 'center', width: 84 },
  avatarText: { color: '#1d4ed8', fontSize: 32, fontWeight: '700' }, name: { color: '#172554', fontSize: 21, fontWeight: '700', marginTop: 13 },
  caption: { color: '#64748b', fontSize: 13, lineHeight: 19, marginTop: 4, textAlign: 'center' },
  badge: { alignItems: 'center', backgroundColor: '#eff6ff', borderRadius: 20, flexDirection: 'row', gap: 5, marginTop: 12, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: '#1d4ed8', fontSize: 12, fontWeight: '700' }, sectionTitle: { color: '#172554', fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 22 },
  statisticsRow: { flexDirection: 'row', gap: 12 }, statisticCard: { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, flex: 1, minHeight: 124, padding: 14 },
  statisticIcon: { alignItems: 'center', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 }, statisticValue: { fontSize: 25, fontWeight: '800', marginTop: 7 },
  statisticLabel: { color: '#64748b', fontSize: 13, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  informationCard: { backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', paddingHorizontal: 16 }, informationRow: { alignItems: 'center', flexDirection: 'row', minHeight: 66, paddingVertical: 10 },
  informationDivider: { borderBottomColor: '#e2e8f0', borderBottomWidth: StyleSheet.hairlineWidth }, informationIcon: { alignItems: 'center', backgroundColor: '#eff6ff', borderRadius: 10, height: 40, justifyContent: 'center', width: 40 },
  informationText: { flex: 1, marginLeft: 12 }, informationLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }, informationValue: { color: '#334155', fontSize: 15, fontWeight: '600', marginTop: 2 },
  notice: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginTop: 20, padding: 15 }, noticeIcon: { marginRight: 10, paddingTop: 1 },
  noticeContent: { flex: 1 }, noticeTitle: { color: '#1e3a8a', fontSize: 15, fontWeight: '700' }, noticeText: { color: '#475569', fontSize: 13, lineHeight: 19, marginTop: 4 },
});
