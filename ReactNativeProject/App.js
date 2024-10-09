import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
};

const getTabBarIcon = (route) => ({ color, size }) => {
  const icons = {
    Home: 'ios-home',
    Favorites: 'ios-heart',
  };
  return <Ionicons name={icons[route.name]} size={size} color={color} />;
};

const createStack = (name, component) => (
  <Stack.Navigator>
    <Stack.Screen name={name} component={component} options={{ title: name }} />
    <Stack.Screen name="Details" component={DetailScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: getTabBarIcon(route),
    ...screenOptions,
  })}>
    <Tab.Screen name="Home" options={{ headerShown: false }}>
      {() => createStack('Home', HomeScreen)}
    </Tab.Screen>
    <Tab.Screen name="Favorites" options={{ headerShown: false }}>
      {() => createStack('Favorites', FavoriteScreen)}
    </Tab.Screen>
  </Tab.Navigator>
);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </Provider>
  );
}