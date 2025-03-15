import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { Outlet, useParams } from "react-router-dom";
import { ChatList } from "../ChatList";

const filters = [
  { label: "Pending", value: "Pending", class: "all" },
  { label: "Ongoing", value: "In Progress", class: "new" },
  { label: "Solved", value: "Closed Resolved", class: "handled" },
  { label: "Unresolve", value: "Closed Unresolved", class: "closed" },
];

export const CSR: React.FC = () => {
  const [isMobileListVisible, setIsMobileListVisible] = useState(false);
  const [filterBadge, setFilterBadge] = useState("Pending");
  const { ticket_number } = useParams();

  return (
    <div className={styles.CSR}>
      <Header />
      <div className={styles.mainContent}>
        <div
          className={`${styles.leftPanel} ${`${styles.listWrapper} ${
            !ticket_number ? styles.visible : ""
          }`}`}
        >
          <div>
            <ChatListBadges
              filterBadge={filterBadge}
              setFilterBadge={setFilterBadge}
            />
            <ChatList
              filterBadge={filterBadge}
              selectedTicket={ticket_number}
              setFilterBadge={setFilterBadge}
            />
          </div>
        </div>
        <div className={styles.rightPanel}>
          <ChatHeader
            isOnline={true}
            onMenuClick={() => setIsMobileListVisible(!isMobileListVisible)}
            showMobileMenu={!ticket_number}
          />
          {ticket_number ? (
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
        <button className={styles.mobileMenuButton} onClick={onMenuClick}>
          <img
            src="/assets/Icons/hamburger.svg"
            alt="Menu"
            className={styles.menuIcon}
          />
        </button>
      )}
      <div className={styles.userAvatar}>
        <img src="https://placehold.co/50" alt="User" />
        <span
          className={`${styles.statusIndicator} ${
            isOnline ? styles.online : styles.offline
          }`}
        />
      </div>
      <div className={styles.userInfo}>
        <h3 className="pb-0 mb-0">John Doe</h3>
        {/* <span className={styles.userId}>ID: {uuid.current}</span> */}
      </div>
      <div className={styles.ticketInfo}>
        <span className={styles.ticketNumber}>
          Ticket ID. WC0821202487-X121
        </span>
        <img
          src="/assets/Icons/more-icon.svg"
          alt="more"
          className={styles.moreIcon}
        />
      </div>
    </div>
  );
};

const ChatListBadges: React.FC<{
  filterBadge: string;
  setFilterBadge: React.Dispatch<React.SetStateAction<string>>;
}> = ({ filterBadge, setFilterBadge }) => {
  return (
    <div className={styles.chatListHeader}>
      <div className={styles.badgeContainer}>
        {filters.map(({ label, value, class: cssClass }) => (
          <span
            key={label}
            className={`${styles.badge} ${styles[cssClass]} ${
              filterBadge === value ? styles.active : ""
            }`}
            onClick={() => setFilterBadge(value)}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
