import React from "react";
import styles from "./styles.module.scss";
import { Outlet, useParams } from "react-router-dom";

export const CSR: React.FC = () => {
  const { id } = useParams();
  return (
    <div className={styles.CSR}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.noSelection} id="ChatList">
          No Chat Available.
        </div>
        {id ? (
          <Outlet />
        ) : (
          <div className={styles.noSelection}>
            Select conversation to the left
          </div>
        )}
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <div className={styles.profilePicture}>
          <img src="https://placehold.co/50" alt="profile" />
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <p className={styles.userName}>CS Princess</p>
          <p className={styles.userId}>User ID: 0d5393c2-a155...</p>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className={styles.hamburgerMenu}>
        <img
          src="/assets/csr/hamburger icon.png"
          alt="Menu"
          className={styles.menuIcon}
        />
      </div>
    </header>
  );
};
