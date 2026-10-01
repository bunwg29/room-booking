import React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import RoomListScreen from './RoomListScreen';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'BrowseRooms'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function BrowseRoomsScreen({ navigation }: Props) {
  return (
    <RoomListScreen
      onRoomPress={(room) =>
        navigation.navigate('RoomDetails', { roomId: room.id, roomName: room.name })
      }
    />
  );
}
