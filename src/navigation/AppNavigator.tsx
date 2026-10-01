import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowseRoomsScreen from '../screens/BrowseRoomsScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import type { RootStackParamList, TabParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>
            {route.name === 'BrowseRooms' ? '⌂' : route.name === 'MyBookings' ? '▣' : '◎'}
          </Text>
        ),
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#64748b',
      })}
    >
      <Tabs.Screen name="BrowseRooms" component={BrowseRoomsScreen} options={{ title: 'Danh sách phòng' }} />
      <Tabs.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Lịch đặt phòng' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <RootStack.Screen name="RoomDetails" component={RoomDetailScreen} options={({ route }) => ({ title: route.params.roomName })} />
        <RootStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ headerShown: false, presentation: 'modal' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
