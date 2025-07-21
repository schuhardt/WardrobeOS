
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Notification when someone likes a wardrobe item
exports.sendLikeNotification = functions.firestore
  .document('likes/{likeId}')
  .onCreate(async (snap, context) => {
    const likeData = snap.data();
    const { itemId, likedBy, itemOwner } = likeData;

    // Get the item owner's FCM token
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(itemOwner)
      .get();

    if (!userDoc.exists) return;

    const fcmToken = userDoc.data().fcmToken;
    if (!fcmToken) return;

    // Get the liker's username
    const likerDoc = await admin.firestore()
      .collection('users')
      .doc(likedBy)
      .get();

    const likerName = likerDoc.data().username || 'Someone';

    const message = {
      token: fcmToken,
      notification: {
        title: '❤️ New Like!',
        body: `${likerName} liked your item`,
      },
      data: {
        type: 'like',
        itemId: itemId,
        likedBy: likedBy,
      },
    };

    try {
      await admin.messaging().send(message);
      console.log('Like notification sent successfully');
    } catch (error) {
      console.error('Error sending like notification:', error);
    }
  });

// Notification when someone follows a user
exports.sendFollowNotification = functions.firestore
  .document('follows/{followId}')
  .onCreate(async (snap, context) => {
    const followData = snap.data();
    const { follower, following } = followData;

    // Get the followed user's FCM token
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(following)
      .get();

    if (!userDoc.exists) return;

    const fcmToken = userDoc.data().fcmToken;
    if (!fcmToken) return;

    // Get the follower's username
    const followerDoc = await admin.firestore()
      .collection('users')
      .doc(follower)
      .get();

    const followerName = followerDoc.data().username || 'Someone';

    const message = {
      token: fcmToken,
      notification: {
        title: '👤 New Follower!',
        body: `${followerName} started following you`,
      },
      data: {
        type: 'follow',
        follower: follower,
      },
    };

    try {
      await admin.messaging().send(message);
      console.log('Follow notification sent successfully');
    } catch (error) {
      console.error('Error sending follow notification:', error);
    }
  });

// Notification when someone comments on an item
exports.sendCommentNotification = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const commentData = snap.data();
    const { itemId, commentBy, itemOwner, text } = commentData;

    // Don't notify if user comments on their own item
    if (commentBy === itemOwner) return;

    // Get the item owner's FCM token
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(itemOwner)
      .get();

    if (!userDoc.exists) return;

    const fcmToken = userDoc.data().fcmToken;
    if (!fcmToken) return;

    // Get the commenter's username
    const commenterDoc = await admin.firestore()
      .collection('users')
      .doc(commentBy)
      .get();

    const commenterName = commenterDoc.data().username || 'Someone';

    const message = {
      token: fcmToken,
      notification: {
        title: '💬 New Comment!',
        body: `${commenterName}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      },
      data: {
        type: 'comment',
        itemId: itemId,
        commentBy: commentBy,
      },
    };

    try {
      await admin.messaging().send(message);
      console.log('Comment notification sent successfully');
    } catch (error) {
      console.error('Error sending comment notification:', error);
    }
  });
