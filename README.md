# VKU Room Booking

## Overview
A Week 05 Expo/React Native mini-project for browsing VKU study rooms and creating mock reservations.

## Features
- 22 mock rooms with search and All/Available/Occupied filters
- Responsive FlatList layout with compact room cards
- Typed bottom tabs: Browse Rooms, My Bookings, Profile
- Room detail view with date and time-slot selection
- Mock booking creation, cancellation, occupied-slot blocking, and conflict prevention
- Loading-safe, empty-state UI for rooms and bookings

## Tech Stack
Expo SDK 57, React Native, TypeScript, React Navigation 7, Safe Area Context.

## Architecture
The UI uses `RoomDataSource` and `BookingDataSource` interfaces with mock implementations. Booking conflict rules live in `bookingService`, while `BookingContext` shares client booking state between screens.

## Project Structure
- `src/navigation`: typed tabs and Browse stack
- `src/screens`: browse, detail, bookings, and profile screens
- `src/components`: reusable room card
- `src/services`: data-source boundaries and booking rules
- `src/types`: Room and Booking domain models

## Installation
```bash
npm install
```

## Run Locally
```bash
npx expo start
```

## Run with Expo Go
Start the dev server and scan the QR code with Expo Go on a compatible device.

## Android Emulator
```bash
npm run android
```

## Booking Flow
Browse Rooms -> Room Detail -> choose date -> choose an available slot -> Book room -> My Bookings.

## Conflict Prevention
A booking is rejected when the room and date match an existing confirmed booking and the time ranges overlap. Occupied slots are disabled in the selector.

## Robin / LibCal Integration
Status: mock only. The repository does not contain official Robin/LibCal API documentation, credentials, endpoint details, or response contracts. The data-source interfaces are ready for an official adapter without changing the UI.

## Screenshots
Not included yet.

## Live Demo
No hosted demo. Expo Go is the supported local preview.

## Known Limitations
- Mock data is in memory and resets on app restart.
- No authentication or remote realtime synchronization is implemented.
- Date selection currently exposes the next three local dates.

## Report
Official lecturer report template not present in the repository; final report is waiting for that template.
