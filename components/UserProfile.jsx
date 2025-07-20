
// components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Button, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();

const UserProfile = ({ userId, currentUser, onFollow }) => {
  const [wardrobe, setWardrobe] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadWardrobe();
    checkFollowing();
  }, [userId]);

  const loadWardrobe = async () => {
    const q = query(collection(db, 'styles'), where('userId', '==', userId), where('public', '==', true));
    const snapshot = await getDocs(q);
    setWardrobe(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const checkFollowing = async () => {
    const followingSnap = await getDocs(query(collection(db, 'following')));
    followingSnap.forEach(doc => {
      if (doc.id === currentUser.uid) {
        const following = doc.data().users || [];
        setIsFollowing(following.includes(userId));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Text>ID: {userId}</Text>
      <Button
        title={isFollowing ? 'Unfollow' : 'Follow'}
        onPress={() => {
          onFollow(userId);
          setIsFollowing(!isFollowing);
        }}
      />
      <Text style={styles.subheading}>Wardrobe</Text>
      <FlatList
        horizontal
        data={wardrobe}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.wardrobeItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.description}</Text>
            <Text>Price: ${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold' },
  subheading: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  wardrobeItem: { marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 6 },
});

export default UserProfile;
