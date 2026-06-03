import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Main: undefined;
  CategoryPicker: { level: string };
  Lesson: { category?: string; mode?: 'learn' | 'test'; autoAdvance?: boolean; repeatCount?: number; pauseSeconds?: number };
};

export type TabParamList = {
  Home: undefined;
  Words: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type LessonProps = NativeStackScreenProps<RootStackParamList, 'Lesson'>;
export type CategoryPickerProps = NativeStackScreenProps<RootStackParamList, 'CategoryPicker'>;

export type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type WordsProps = BottomTabScreenProps<TabParamList, 'Words'>;
export type ProfileProps = BottomTabScreenProps<TabParamList, 'Profile'>;
