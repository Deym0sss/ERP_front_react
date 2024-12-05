import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import image from "../assets/user.png";
import home from "../assets/home.png";

const Header = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState();
  const [userSurname, setUserSurname] = useState();
  const [visible, setVisible] = useState(false);

  const toHome = () => {
    navigate("/home");
  };

  const togglePopover = () => {
    setVisible(!visible);
  };
  const hidePopover = () => {
    setVisible(false);
    navigate("/login");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userSurname");
  };

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
    setUserSurname(localStorage.getItem("userSurname"));
  }, []);

  return (
    <div className={styles.header}>
      <div>
        <img
          className={styles.homeImg}
          src={home}
          alt="none"
          onClick={toHome}
        />
      </div>
      <div>
        <p className={styles.userInfo}>
          {userName} {userSurname}
        </p>
        <div
          className={styles.avatar__container}
          onClick={togglePopover}
          style={{ backgroundColor: "#bde3ff" }}
        >
          <img className={styles.avatar} src={image} alt="none" />
          {visible && (
            <div className={styles.popover} onClick={hidePopover}>
              <p style={{ backgroundColor: "white" }}>Log out</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
