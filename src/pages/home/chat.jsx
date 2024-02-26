import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./chat.css";
import { useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../services/messageServices";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import userPhotoDef from "../../images/userMale.png";

const Chat = ({ selectedUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const { id } = useSelector((state) => state.user);
  const [userPhoto, setUserPhoto] = useState(null);

  const handleMessageSend = () => {
    if (newMessage && selectedUser) {
      sendMessage(selectedUser.userId, id, newMessage);
      setNewMessage("");
      const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

      return () => unsubscribe();
    }
  };

  useEffect(() => {
    const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

    return () => unsubscribe();
  }, [selectedUser, id]);

  useEffect(() => {
    const sorted = messages.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      return dateA - dateB;
    });

    const seenTimestamps = new Set();

    const filteredData = sorted.filter((item) => {
      const timestamp = item.timestamp;
      if (seenTimestamps.has(timestamp)) {
        return false;
      } else {
        seenTimestamps.add(timestamp);
        return true;
      }
    });

    setSortedMessages(filteredData);
  }, [messages]);

  const formatTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    } else {
      const options = { day: "numeric", month: "short" };
      return messageDate.toLocaleDateString(undefined, options);
    }
  };

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `user_photos/${selectedUser && selectedUser?.userId}/user-photo.jpg`
        );
        const downloadURL = await getDownloadURL(storageRef);
        setUserPhoto(downloadURL);
      } catch (error) {
        setUserPhoto(userPhotoDef);
        // console.error("Error fetching author's image from Firebase storage:");
      }
    };

    fetchAuthorImage();
  }, [selectedUser, id]);

  return (
    <div className="chat-container">
      <div className="selected-user">
        <div className="selected-user-image">
          <img src={userPhoto} alt="" />
        </div>
        <div className="selected-user-name">
          <p>{selectedUser && selectedUser.name}</p>
          <span>Online</span>
        </div>
      </div>
      <div className="messages">
        {sortedMessages.map((message, index) => (
          <div
            key={index}
            className={`${message.sender === id ? "sent-m" : "received-m"}`}
          >
            {" "}
            <div
              className={`message ${
                message.sender === id ? "sent" : "received"
              }`}
            >
              <p> {message.content} </p>
            </div>
            <span>{formatTime(message.timestamp)}</span>
          </div>
        ))}
      </div>
      <div className="messages-input">
        <input
          type="text"
          placeholder="Write messages..."
          value={newMessage}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMessageSend();
            }
          }}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="button">
          <AttachFileIcon />
        </button>
        <button type="button" onClick={handleMessageSend}>
          <SendIcon style={{ transform: "rotate(-45deg)" }} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
