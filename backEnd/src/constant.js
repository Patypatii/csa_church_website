
/**
 * @description set of events that we are using in chat app. more to be added as we develop the chat app
 */

export const ChatEventEnum = Object.freeze({//where .freeze is used for predictability and immutability. exactrly doing the following function you cannot add, remove, or change properties.
    //- Event names are critical identifiers in a chat app. If someone accidentally changes "connected" to "connectd", sockets will break. Freezing prevents that.
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when new Notification is received
  Notification_RECEIVED_EVENT: "notificationReceived",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when Notification is deleted
  Notification_DELETE_EVENT: "notificationDeleted",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

// for this we should ensure any notification is not biased , no stale Notifications 
// when an admin delete a Notification we should not see the stale notification , when it is added we should see immediately like a chat app
