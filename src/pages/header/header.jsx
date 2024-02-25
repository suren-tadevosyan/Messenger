import "./header.css";
import logo from "../../images/logo.png";
import { Email, Logout, Person2 } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../../redux/slices/auth";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const { name } = useSelector((state) => state.user);

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

        <div>123</div>
      </div>
    </div>
  );
};
export default Header;
