import { Stack } from 'expo-router';
import { pageBackground } from './constants';

export default function RootLayout() {

  return (
    <Stack screenOptions={{
      contentStyle: { backgroundColor: pageBackground },
      headerShown: false
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[topic]" />
      <Stack.Screen name="contact" />
    </Stack>
  );
}
