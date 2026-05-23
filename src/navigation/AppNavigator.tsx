import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  Results: { wrongAnswers: number; score: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ChaosTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#06060f',
    card: '#0d0d1a',
    text: '#ffffff',
    border: '#1a1a35',
    primary: '#00ffff',
    notification: '#ff0080',
  },
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={ChaosTheme}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#06060f' },
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
