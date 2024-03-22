import "./header.css";
import logo from "../../images/logo.png";
import { Email, Logout, Person2 } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../../redux/slices/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import userPhoto1 from "../../images/userMale.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const { id, photo } = useSelector((state) => state.user);
  const [userPhoto, setUserPhoto] = useState(
    photo.photo ? photo.photo : userPhoto1
  );

  async function onLogout() {
    dispatch(removeUser());
    localStorage.removeItem("userId");
    localStorage.removeItem("hasModalBeenShown");

    dispatch(loginUser(null));
    navigate("/login");
  }

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);

    switch (iconName) {
      case "email":
        navigate("/emailpage");
        break;
      case "person":
        navigate("/authorpage");
        break;
      case "logOut":
        onLogout();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `user_photos/${id}/user-photo.jpg`);
        const downloadURL = await getDownloadURL(storageRef);
        setUserPhoto(downloadURL);
      } catch (error) {
        console.error();
        setUserPhoto(userPhoto);
      }
    };

    fetchAuthorImage();
  }, [userPhoto, id]);

  return (
    <div className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="icons">
          <Email
            className={
              selectedIcon === "email" ? "icon email selected" : "icon email"
            }
            onClick={() => handleIconClick("email")}
          />
          <Person2
            className={
              selectedIcon === "person" ? "icon person selected" : "icon person"
            }
            onClick={() => handleIconClick("person")}
          />
          <Logout
            className={
              selectedIcon === "logOut"
                ? "icon logOut selected"
                : "icon logOut "
            }
            onClick={() => handleIconClick("logOut")}
          />
        </div>

        <div className="header-user-photo">
          <img src={userPhoto} alt="User" />
        </div>
      </div>
    </div>
  );
};
export default Header;
