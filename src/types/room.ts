import type { ImageSourcePropType } from 'react-native';

export type RoomStatus = 'Available' | 'Occupied';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  status: RoomStatus;
  image: ImageSourcePropType; // require() is compatible with ImageSourcePropType
}
