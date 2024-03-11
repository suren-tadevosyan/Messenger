import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./chat.css";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  sendMessage,
  fetchMessages,
  deleteMessage,
} from "../../services/messageServices";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  listAll,
} from "firebase/storage";
import userPhotoDef from "../../images/userMale.png";

const Chat = ({ selectedUser, toggleActiveUsersVisibility }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const { id } = useSelector((state) => state.user);
  const [userPhoto, setUserPhoto] = useState(null);
  const messagesEndRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  const handleMessageSend = () => {
    if ((newMessage.trim() !== "" || imageUrl) && selectedUser) {
      sendMessage(selectedUser.userId, id, newMessage, imageUrl);
      setNewMessage("");
      setImageUrl(null);
      const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

      return () => unsubscribe();
    }
  };

  const handleDelete = (messageID, messageUID) => {
    deleteMessage(messageID, messageUID);
    const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

    return () => unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

    return () => unsubscribe();
  }, [selectedUser, id]);

  useEffect(() => {
    const sorted = [...messages].sort((a, b) => {
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
        const fbStorageListRef = ref(
          storage,
          `user_photos/${selectedUser && selectedUser?.userId}`
        );
        const storageRef = ref(
          storage,
          `user_photos/${selectedUser && selectedUser?.userId}/user-photo.jpg`
        );
        listAll(fbStorageListRef).then((list) => {
          if (list.items.length > 0) {
            getDownloadURL(storageRef)
              .then((downloadURL) => {
                setUserPhoto(downloadURL);
              })
              .catch((error) => {
                setUserPhoto(userPhotoDef);
              });
          } else {
            setUserPhoto(userPhotoDef);
          }
        });
      } catch (error) {
        // console.error("Error fetching author's image from Firebase storage:");
      }
    };

    fetchAuthorImage();
  }, [selectedUser, id]);

  return (
    <div className="chat-container">
      <div className="selected-user">
        {selectedUser && (
          <div className="">
            <div className="backToAll" onClick={toggleActiveUsersVisibility}>
              <ArrowBackIcon />
            </div>
            <div className="selected-user-image">
              <img src={userPhoto} alt="" />
            </div>
            <div className="selected-user-name">
              <p>{selectedUser && selectedUser.name}</p>
              <span>Online</span>
            </div>
          </div>
        )}
      </div>
      <div className="messages">
        {sortedMessages.map((message, index) => (
          <div
            key={index}
            className={`${message.sender === id ? "sent-m" : "received-m"}`}
          >
            {message.imageUrl ? (
              <div className="message-img">
                <img
                  src={message.imageUrl}
                  className="message-img"
                  alt="sendPhoto"
                />{" "}
              </div>
            ) : (
              <div
                className={`message ${
                  message.sender === id ? "sent" : "received"
                }`}
              >
                {" "}
                <p>{message.content}</p>
                {message.sender === id && (
                  <button
                    className="delete-message"
                    onClick={() => handleDelete(message.id, message.uid)}
                  >
                    <DeleteForeverIcon />
                  </button>
                )}
              </div>
            )}
            <span>{formatTime(message.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
        <input
          type="file"
          accept="image/*"
          className="file-input"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const storage = getStorage();
              const storageRef = ref(storage, `images/${file.name}`);
              uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                  setImageUrl(downloadURL);
                  console.log(imageUrl);
                  handleMessageSend();
                });
              });
            }
          }}
        />
        <button
          type="button"
          onClick={() => document.querySelector(".file-input").click()}
        >
          <AttachFileIcon style={{ transform: "rotate(45deg)" }} />
        </button>
        <button type="button" onClick={handleMessageSend}>
          <SendIcon style={{ transform: "rotate(-45deg)" }} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
