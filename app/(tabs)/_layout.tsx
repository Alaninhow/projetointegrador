import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f59e42',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 48,
          borderRadius: 24,
          height: 68,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          borderTopWidth: 0,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          fontFamily: 'SpaceMono',
        },
        tabBarItemStyle: {
          marginHorizontal: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'home-variant' : 'home-variant-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produto"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'shopping' : 'shopping-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'compass' : 'compass-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
