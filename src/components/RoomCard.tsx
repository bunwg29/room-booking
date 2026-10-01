import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Room } from '../types/room';

const statusLabels = {
  Available: 'Còn trống',
  Occupied: 'Đang sử dụng',
} as const;

interface RoomCardProps {
  room: Room;
  onPress?: () => void;
}

function RoomCard({ room, onPress }: RoomCardProps) {
  const isAvailable = room.status === 'Available';

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress} disabled={!onPress}>
      <Image source={room.image} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {room.name}
        </Text>

        <View style={styles.row}>
          <Text style={styles.icon}>⌂</Text>
          <Text style={styles.detail}>{room.building}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.icon}>♙</Text>
          <Text style={styles.detail}>{room.capacity} chỗ</Text>
        </View>

        <View style={[styles.statusBadge, isAvailable ? styles.badgeAvailable : styles.badgeOccupied]}>
          <Text style={[styles.statusDot, isAvailable ? styles.statusAvailable : styles.statusOccupied]}>●</Text>
          <Text
            style={[
              styles.status,
              isAvailable ? styles.statusAvailable : styles.statusOccupied,
            ]}
          >
            {statusLabels[room.status]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(RoomCard);

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    flexDirection: 'row',
    minHeight: 116,
    overflow: 'hidden',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.82,
  },
  image: {
    aspectRatio: 1.08,
    borderRadius: 10,
    height: '100%',
    maxWidth: 124,
    minWidth: 92,
  },
  info: {
    flex: 1,
    gap: 7,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  name: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  icon: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    width: 18,
  },
  detail: {
    color: '#52627a',
    fontSize: 13,
    flexShrink: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeAvailable: {
    backgroundColor: '#ecfdf3',
  },
  badgeOccupied: {
    backgroundColor: '#fff1f2',
  },
  statusDot: {
    fontSize: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusAvailable: {
    color: '#16a34a',
  },
  statusOccupied: {
    color: '#dc2626',
  },
});
