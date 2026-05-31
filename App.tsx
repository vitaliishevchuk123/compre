import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LessonScreen from './src/screens/LessonScreen';
import { A1_CARDS, validateCards } from './src/data/seed/a1';
import { theme } from './src/theme';
import type { RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Fail loud in development if any lesson card breaks the CI invariant.
  useEffect(() => {
    if (__DEV__) {
      const problems = validateCards(A1_CARDS);
      if (problems.length) {
        console.warn('Lesson invariant violations:\n' + problems.join('\n'));
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lesson"
            component={LessonScreen}
            options={{
              title: 'Lesson',
              headerBackTitle: 'Home',
              headerStyle: { backgroundColor: theme.header },
              headerTintColor: theme.headerText,
              headerTitleStyle: { fontWeight: '700' },
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
