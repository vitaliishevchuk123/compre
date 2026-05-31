import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts, Caveat_400Regular } from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import LessonScreen from './src/screens/LessonScreen';
import WordsScreen from './src/screens/WordsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { VoiceProvider } from './src/context/VoiceContext';
import { A1_CARDS, validateCards } from './src/data/seed/a1';
import { theme } from './src/theme';
import type { RootStackParamList, TabParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof TabParamList, { active: IoniconName; inactive: IoniconName }> = {
  Home:    { active: 'home',           inactive: 'home-outline' },
  Words:   { active: 'book',           inactive: 'book-outline' },
  Profile: { active: 'person',         inactive: 'person-outline' },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 1 },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.option,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          return (
            <View style={focused ? styles.activeIcon : styles.inactiveIcon}>
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={18}
                color={focused ? '#fff' : theme.textSecondary}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Words"   component={WordsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Caveat_400Regular });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

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
      <VoiceProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Lesson"
              component={LessonScreen}
              options={{
                title: 'A1',
                headerBackTitle: 'Home',
                headerStyle: { backgroundColor: 'rgb(72, 64, 56)' },
                headerTintColor: theme.headerText,
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </VoiceProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    backgroundColor: theme.accent,
    borderRadius: 12,
    width: 44,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIcon: {
    width: 44,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
