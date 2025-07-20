import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreSwiper from './components/ExploreSwiper';
import UserProfile from './components/UserProfile';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const ExploreScreen = () => {
  const dummyUsers = [
    {
      userId: 'user1',
      wardrobe: [
        {
          id: '1',
          image: 'https://via.placeholder.com/200',
          description: 'Black leather jacket',
          tags: ['leather', 'black'],
        },
      ],
    },
  ];

  return <ExploreSwiper users={dummyUsers} onBuy={() => {}} onViewProfile={() => {}} />;
};

const ProfileScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Your Profile</Text>
    </View>
  );
};