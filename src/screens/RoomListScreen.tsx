import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoomCard from '../components/RoomCard';
import { useRooms } from '../hooks/useRooms';
import { isRoomOccupiedNow } from '../services/bookingService';
import { useBookingStore } from '../store/useBookingStore';
import type { BuildingCode, Room, RoomEquipment } from '../types/room';

type CapacityFilter = 'any' | '2-4' | '5-10' | '11-20';
type AvailabilityFilter = 'all' | 'available' | 'occupied';

const buildingOptions: ('all' | BuildingCode)[] = ['all', 'A', 'B', 'C', 'V'];
const capacityOptions: CapacityFilter[] = ['any', '2-4', '5-10', '11-20'];
const equipmentOptions: ('all' | RoomEquipment)[] = [
  'all', 'Projector', 'Whiteboard', 'High-spec PC', 'AC',
];

interface RoomListScreenProps {
  onRoomPress: (room: Room) => void;
}

const keyExtractor = (item: Room) => item.id;

function capacityMatches(capacity: number, filter: CapacityFilter) {
  if (filter === 'any') return true;
  const [minimum, maximum] = filter.split('-').map(Number);
  return capacity >= minimum && capacity <= maximum;
}

export default function RoomListScreen({ onRoomPress }: RoomListScreenProps) {
  const { width } = useWindowDimensions();
  const { data: rooms = [], isLoading, isError, isRefetching, refetch } = useRooms();
  const bookings = useBookingStore((state) => state.bookings);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [availability, setAvailability] = React.useState<AvailabilityFilter>('all');
  const [building, setBuilding] = React.useState<'all' | BuildingCode>('all');
  const [capacity, setCapacity] = React.useState<CapacityFilter>('any');
  const [equipment, setEquipment] = React.useState<'all' | RoomEquipment>('all');
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  const filteredRooms = React.useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('vi');
    return rooms.filter((room) => {
      const availableNow = !isRoomOccupiedNow(
        room.id,
        room.status === 'Occupied',
        bookings,
      );
      return (
        (!query || `${room.name} ${room.building}`.toLocaleLowerCase('vi').includes(query)) &&
        (availability === 'all' || (availability === 'available') === availableNow) &&
        (building === 'all' || room.buildingCode === building) &&
        capacityMatches(room.capacity, capacity) &&
        (equipment === 'all' || room.equipment.includes(equipment))
      );
    });
  }, [availability, bookings, building, capacity, equipment, rooms, searchQuery]);

  const renderItem = React.useCallback<ListRenderItem<Room>>(
    ({ item, index }) => (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index, 8) * 45).springify()}
        style={styles.itemContainer}
      >
        <RoomCard
          room={item}
          availableNow={!isRoomOccupiedNow(item.id, item.status === 'Occupied', bookings)}
          onPress={() => onRoomPress(item)}
        />
      </Animated.View>
    ),
    [bookings, onRoomPress],
  );

  if (isLoading) {
    return <StateView text="Đang tải danh sách phòng..." loading />;
  }
  if (isError) {
    return <StateView text="Không thể tải danh sách phòng." onRetry={() => void refetch()} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>VKU CAMPUS</Text>
        <Text style={styles.headerTitle}>Tìm phòng học</Text>
        <Text style={styles.headerSubtitle}>{filteredRooms.length} phòng phù hợp</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm phòng hoặc tòa nhà"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.filters}>
        <FilterLine label="Trạng thái">
          <FilterChip label="Tất cả" selected={availability === 'all'} onPress={() => setAvailability('all')} />
          <FilterChip label="Còn trống" selected={availability === 'available'} onPress={() => setAvailability('available')} />
          <FilterChip label="Đang dùng" selected={availability === 'occupied'} onPress={() => setAvailability('occupied')} />
        </FilterLine>
        <FilterLine label="Tòa nhà">
          {buildingOptions.map((item) => <FilterChip key={item} label={item === 'all' ? 'Tất cả' : `Tòa ${item}`} selected={building === item} onPress={() => setBuilding(item)} />)}
        </FilterLine>
        <FilterLine label="Sức chứa">
          {capacityOptions.map((item) => <FilterChip key={item} label={item === 'any' ? 'Tất cả' : `${item} người`} selected={capacity === item} onPress={() => setCapacity(item)} />)}
        </FilterLine>
        <FilterLine label="Thiết bị">
          {equipmentOptions.map((item) => <FilterChip key={item} label={item === 'all' ? 'Tất cả' : item} selected={equipment === item} onPress={() => setEquipment(item)} />)}
        </FilterLine>
      </View>

      <FlatList
        key={`rooms-${columns}`}
        data={filteredRooms}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        ListEmptyComponent={<Text style={styles.emptyState}>Không tìm thấy phòng phù hợp</Text>}
        contentContainerStyle={[styles.listContent, filteredRooms.length === 0 && styles.emptyList]}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={40}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
      />
    </SafeAreaView>
  );
}

function FilterLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.filterLine}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {children}
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function StateView({ text, loading, onRetry }: { text: string; loading?: boolean; onRetry?: () => void }) {
  return (
    <View style={styles.centerState}>
      {loading ? <ActivityIndicator size="large" color="#2563eb" /> : null}
      <Text style={styles.stateText}>{text}</Text>
      {onRetry ? <Pressable onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Thử lại</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { backgroundColor: '#111b3b', paddingHorizontal: 18, paddingBottom: 16, paddingTop: 12 },
  eyebrow: { color: '#60a5fa', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  headerTitle: { color: '#fff', fontSize: 27, fontWeight: '800', marginTop: 4 },
  headerSubtitle: { color: '#a5b4cf', fontSize: 13, marginTop: 3 },
  searchBox: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', marginTop: 14, paddingHorizontal: 12 },
  searchIcon: { color: '#64748b', fontSize: 24, width: 24 },
  searchInput: { color: '#111827', flex: 1, fontSize: 14, paddingHorizontal: 8, paddingVertical: 11 },
  filters: { backgroundColor: '#fff', borderBottomColor: '#e2e8f0', borderBottomWidth: 1, paddingVertical: 8 },
  filterLine: { alignItems: 'center', flexDirection: 'row', minHeight: 39 },
  filterLabel: { color: '#475569', fontSize: 11, fontWeight: '800', paddingLeft: 16, width: 79 },
  filterScroll: { gap: 7, paddingRight: 16 },
  chip: { backgroundColor: '#f1f5f9', borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7 },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { color: '#475569', fontSize: 11, fontWeight: '700' },
  chipTextSelected: { color: '#fff' },
  listContent: { padding: 16, paddingBottom: 28 },
  emptyList: { flexGrow: 1 },
  emptyState: { alignSelf: 'center', color: '#64748b', fontSize: 16, marginTop: 42 },
  itemContainer: { flex: 1, marginBottom: 14 },
  columnWrapper: { gap: 14 },
  centerState: { alignItems: 'center', backgroundColor: '#f5f7fb', flex: 1, justifyContent: 'center', padding: 24 },
  stateText: { color: '#64748b', marginTop: 12, textAlign: 'center' },
  retryButton: { backgroundColor: '#2563eb', borderRadius: 9, marginTop: 14, paddingHorizontal: 18, paddingVertical: 10 },
  retryText: { color: '#fff', fontWeight: '700' },
});
