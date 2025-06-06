import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importando as telas
import HomeScreen from './src/screens/HomeScreen';
import CarDetailsScreen from './src/screens/CarDetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CarFormScreen from './src/screens/CarFormScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: 'Carros - Victor Theodoro' }} 
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen} 
        options={{ title: 'Detalhes do Carro' }} 
      />
      <Stack.Screen 
        name="CarForm" 
        component={CarFormScreen} 
        options={({ route }) => ({ 
          title: route.params?.car ? 'Editar Carro' : 'Novo Carro'
        })} 
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="FavoritesScreen" 
        component={FavoritesScreen} 
        options={{ title: 'Favoritos' }} 
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen} 
        options={{ title: 'Detalhes do Carro' }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2ecc71',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#eee',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Favorites" component={FavoritesStack} />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              title: 'Perfil'
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
