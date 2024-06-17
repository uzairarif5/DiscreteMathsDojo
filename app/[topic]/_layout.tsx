import { Stack } from 'expo-router';
import { pageBackground } from '../constants';

export default function TopicLayout() {

  return (
    <Stack screenOptions={{
      contentStyle: { backgroundColor: pageBackground },
      headerShown: false,
      headerTintColor:"black"
    }}>
      <Stack.Screen name="[chapter]/index" options={{headerShown: true}} />
    </Stack>
  );
}
