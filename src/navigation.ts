import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// Root stack: tabs + lesson overlay
export type RootStackParamList = {
  Main: undefined;
  Lesson: undefined;
};

// Bottom tab screens
export type TabParamList = {
  Home: undefined;
  Words: undefined;
  Profile: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type LessonProps = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

export type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type WordsProps = BottomTabScreenProps<TabParamList, 'Words'>;
export type ProfileProps = BottomTabScreenProps<TabParamList, 'Profile'>;
