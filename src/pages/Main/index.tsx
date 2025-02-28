import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Outlet, useParams } from "react-router-dom";
import { ChatList } from "../ChatList";

export const CSR: React.FC = () => {
  const [isMobileListVisible, setIsMobileListVisible] = useState(false);
  const { id } = useParams();

  console.log(id)

  return (
    <div className={styles.CSR}>
      <Header />
      <div className={styles.mainContent}>
        <div className={`${styles.leftPanel} ${`${styles.listWrapper} ${!id ? styles.visible : ''}`}`}>
          <div>
          <ChatListBadges />
            <ChatList />
          </div>
        </div>
        <div className={styles.rightPanel}>
          <ChatHeader 
            isOnline={true} 
            onMenuClick={() => setIsMobileListVisible(!isMobileListVisible)}
            showMobileMenu={!id}
          />
          {id ? (
            <Outlet />
          ) : (
            <div className={styles.noSelection}>No selected conversation.</div>
          )}
        </div>
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
          <p className={styles.userId}>User ID: 0d5393c2-a155-3123216</p>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className={styles.hamburgerMenu}>
        <img
          src="/assets/Icons/hamburger.svg"
          alt="Menu"
          className={styles.menuIcon}
        />
      </div>
    </header>
  );
};


const ChatHeader: React.FC<{ 
  isOnline?: boolean;
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}> = ({ isOnline = true, onMenuClick, showMobileMenu }) => {
  return (
    <div className={styles.chatHeader}>
      {showMobileMenu && (
        <button 
          className={styles.mobileMenuButton} 
          onClick={onMenuClick}
        >
          <img
            src="/assets/Icons/hamburger.svg"
            alt="Menu"
            className={styles.menuIcon}
          />
        </button>
      )}
      <div className={styles.userAvatar}>
        <img src="https://placehold.co/50" alt="User" />
        <span className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`} />
      </div>
      <div className={styles.userInfo}>
        <h3 className="pb-0 mb-0">
          John Doe
        </h3>
        {/* <span className={styles.userId}>ID: {uuid.current}</span> */}
      </div>
      <div className={styles.ticketInfo}>
        <span className={styles.ticketNumber}>Ticket ID. WC0821202487-X121</span>
        <img
          src="/assets/Icons/more-icon.svg"
          alt="more"
          className={styles.moreIcon}
        />
      </div>
    </div>
  );
};

const ChatListBadges: React.FC = () => {
  const [filterBadge, setFilterBadge] = useState("all");

  return ( <div className={styles.chatListHeader}>
    <div className={styles.badgeContainer}>
      <span
        className={`${styles.badge} ${styles.all} ${
          filterBadge === "pending" ? styles.active : ""
        }`}
        onClick={() => setFilterBadge("pending")}
      >
        Pending
      </span>
      <span
        className={`${styles.badge} ${styles.new} ${
          filterBadge === "ongoing" ? styles.active : ""
        }`}
        onClick={() => setFilterBadge("ongoing")}
      >
        Ongoing
      </span>
      <span
        className={`${styles.badge} ${styles.handled} ${
          filterBadge === "solved" ? styles.active : ""
        }`}
        onClick={() => setFilterBadge("solved")}
      >
        Solved
      </span>
      <span
        className={`${styles.badge} ${styles.closed} ${
          filterBadge === "unresolved" ? styles.active : ""
        }`}
        onClick={() => setFilterBadge("unresolved")}
      >
        Unresolve
      </span>
    </div>
  </div>);
};