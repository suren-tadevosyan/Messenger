import firestore from "../fireStore";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const sendMessage = async (receiverId, senderId, newMessage) => {
  try {
    if (!receiverId || !senderId || !newMessage) {
      console.error("Invalid data for sending message.");
      return;
    }

    const messagesRef = collection(firestore, "messages");
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      seen: false,
    };

    await addDoc(messagesRef, messageData);
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
};

const fetchMessages = (selectedUserId, currentUserId, setMessages) => {
  if (!selectedUserId || !currentUserId) {
    return () => {};
  }

  const messagesRef = collection(firestore, "messages");
  const q = query(
    messagesRef,
    where("sender", "==", currentUserId),
    where("receiver", "==", selectedUserId),
    orderBy("timestamp", "asc")
  );

  const q2 = query(
    messagesRef,
    where("sender", "==", selectedUserId),
    where("receiver", "==", currentUserId),
    orderBy("timestamp", "asc")
  );

  const unsubscribe1 = onSnapshot(q, (querySnapshot) => {
    const fetchedMessages = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setMessages(fetchedMessages);
  });

  const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
    const fetchedMessages = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
  });

  return () => {
    unsubscribe1();
    unsubscribe2();
  };
};

const fetchLastMessage = async (
  currentUserId,
  otherUserId,
  setLastMessages,
  mark
) => {
  const messagesRef = collection(firestore, "messages");
  const q = query(
    messagesRef,
    where("sender", "==", otherUserId),
    where("receiver", "==", currentUserId),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const lastMessage = doc.data();


      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [otherUserId]: lastMessage,
      }));

      
      if (mark) {
        markLastMessageAsSeen(doc.id);
      }
   
    });
  });

 
  return unsubscribe;

  // try {
  //   const messagesRef = collection(firestore, "messages");
  //   const q = query(
  //     messagesRef,
  //     where("sender", "==", otherUserId),
  //     where("receiver", "==", currentUserId),
  //     orderBy("timestamp", "desc"),
  //     limit(1)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     const lastMessage = doc.data();
  //     console.log(lastMessage);

  //     setLastMessages((prevLastMessages) => ({
  //       ...prevLastMessages,
  //       [otherUserId]: lastMessage,
  //     }));

  //     if (mark) {
  //       console.log(4565);
  //       markLastMessageAsSeen(doc.id);
  //     }
  //   });
  // } catch (error) {
  //   console.error("Error fetching last message:", error);
  // }
};

const markLastMessageAsSeen = async (lastMessageId) => {
  try {
    const messageRef = doc(firestore, "messages", lastMessageId);
    await updateDoc(messageRef, {
      seen: true,
    });
    // console.log("Last message marked as seen successfully.");
  } catch (error) {
    console.error("Error marking last message as seen:", error);
  }
};

export { fetchMessages, sendMessage, fetchLastMessage };