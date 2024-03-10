import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../services/userServices";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import userPhoto from "../../images/userMale.png";
import "./home.css";
import { NotFound } from "../../utils/animations";
import Chat from "./chat";
import { fetchLastMessage } from "../../services/messageServices";

const Home = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { id } = useSelector((state) => state.user);
  const [userImages, setUserImages] = useState({});
  const [searchText, setSearchText] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [activeUsersVisible, setActiveUsersVisible] = useState(true);
  const [screenSize, setScreenSize] = useState(false);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const users = await getAllUsers();
        setActiveUsers(users.filter((user) => user.userId !== id));
        users.forEach((user) => {
          fetchLastMessage(id, user.userId, setLastMessages, false);
        });
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
  }, [id]);

  useEffect(() => {});
  const fetchUserImage = useCallback(
    async (userId) => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `user_photos/${userId}/user-photo.jpg`);

        const downloadURL = await getDownloadURL(storageRef);
        setUserImages((prevUserImages) => ({
          ...prevUserImages,
          [userId]: downloadURL,
        }));
      } catch (error) {}
    },
    [setUserImages]
  );

  useEffect(() => {
    activeUsers.forEach((user) => fetchUserImage(user.userId));
  }, [activeUsers, fetchUserImage]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedUserId(user.userId === selectedUserId ? null : user.userId);

    fetchLastMessage(id, user.userId, setLastMessages, true);
    if (screenSize) {
      toggleActiveUsersVisibility();
    }
  };

  const filteredUsers = activeUsers.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleActiveUsersVisibility = () => {
    setActiveUsersVisible(!activeUsersVisible);
    console.log(activeUsersVisible);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 850) {
        setScreenSize(true);
      } else {
        setScreenSize(false);
      }
    };

    handleResize(); // Call the function to set initial state

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="message-container">
      <div
        className={`active-users-container ${
          activeUsersVisible ? "" : "hidden"
        }`}
      >
        <div className="search">
          <p>Chat</p>
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users-message">
              <NotFound />
              <p>No users found.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                className={`user ${
                  selectedUserId === user.userId ? "active" : ""
                } ${
                  lastMessages[user.userId]
                    ? lastMessages[user.userId].seen
                      ? "seen"
                      : "unseen"
                    : ""
                } `}
                onClick={() => handleUserClick(user)}
                key={user.userId}
              >
                <li
                  className={`active-user ${
                    selectedUserId === user.userId ? "active" : ""
                  }`}
                >
                  <div className="user-image">
                    <img
                      src={
                        userImages[user.userId]
                          ? userImages[user.userId]
                          : userPhoto
                      }
                      alt="User Avatar"
                    />
                  </div>

                  <div className="user-text">
                    <div className="active-user-name">{user.name}</div>
                    <div className="active-user-message">
                      {" "}
                      {lastMessages[user.userId] &&
                        lastMessages[user.userId].content}
                    </div>
                  </div>
                </li>
                <div className="time">
                  {" "}
                  Seen:{" "}
                  {lastMessages[user.userId] && lastMessages[user.userId].seen
                    ? "true"
                    : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div
        className={`chat-container-all ${
          activeUsersVisible && screenSize ? "hidden" : ""
        }`}
      >
        <Chat
          selectedUser={selectedUser}
          toggleActiveUsersVisibility={toggleActiveUsersVisibility}
        />
      </div>
    </div>
  );
};

export default Home;
