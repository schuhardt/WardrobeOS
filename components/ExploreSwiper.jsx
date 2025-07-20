
import React from 'react';
import { View, Text, Image, FlatList, Dimensions, StyleSheet, Button } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const ExploreSwiper = ({ users, onBuy, onViewProfile }) => {
  return (
    <Swiper loop={false} showsPagination={false} index={0} horizontal={false}>
      {users.map((user, index) => (
        <View key={index} style={styles.page}>
          <Text style={styles.username} onPress={() => onViewProfile(user.userId)}>{user.userId}</Text>
          <FlatList
            horizontal
            data={user.wardrobe}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text>{item.description}</Text>
                <Text>Tags: {item.tags.join(', ')}</Text>
                <Button title="Buy" onPress={() => onBuy(item)} />
              </View>
            )}
          />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  username: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  card: { width: width * 0.8, marginRight: 10 },
  image: { width: '100%', height: 200, borderRadius: 8 },
});

export default ExploreSwiper;
