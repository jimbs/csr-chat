import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { ChatList } from "../ChatList";
import {
  checkCredentials,
  clearLocalData,
  isSessionStill,
} from "../Services/Backend/storeLocalData";
import { useNavigate } from "react-router-dom";

const filters = [
  { label: "Pending", value: "Pending", class: "all" },
  { label: "Ongoing", value: "In Progress", class: "new" },
  { label: "Solved", value: "Closed Resolved", class: "handled" },
  { label: "Unresolve", value: "Closed Unresolved", class: "closed" },
];

export const CSR: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileListVisible, setIsMobileListVisible] = useState(false);
  const [filterBadge, setFilterBadge] = useState("Pending");
  const { ticket_number } = useParams();
  const [csrDetails, setCsrDetails] = useState(null);
  const [notifSound, setNotifSound] = useState(false);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const location = useLocation();

  // useMemo(() => {
  //   if (location.pathname != "/login") {
  //     // Create a reference to store the timeout ID
  //     let checkTimerRef: NodeJS.Timeout | null = null;
      
  //     const checking = async () => {
  //       // Clear any existing timeout before setting a new one
  //       if (checkTimerRef) clearTimeout(checkTimerRef);
        
  //       // Check if session is still valid
  //       if (!(await isSessionStill())) {
  //         navigate("/login");
  //         return;
  //       }
        
  //       // Set the new timeout and store its ID
  //       checkTimerRef = setTimeout(() => {
  //         checking();
  //       }, 10000);
  //     };
      
  //     // Start the initial check
  //     checking();
      
  //     // Cleanup function to clear the timeout when component unmounts
  //     return () => {
  //       if (checkTimerRef) clearTimeout(checkTimerRef);
  //     };
  //   }
  // }, [location.pathname, navigate]);

  useEffect(() => {
    // if (!checkCredentials()) {
    //   navigate("/login");
    //   return
    // }

    if (!csrDetails) {
      if (!setUserDetailsLocal()) {
        clearLocalData();
        navigate("/login");
        return;
      }
      setCsrDetails(setUserDetailsLocal());

      if (ticket_number) setFilterBadge("In Progress");
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ticket_number]);

  const setUserDetailsLocal = () => {
    if (localStorage.getItem("user_data") == "undefined") return null;
    return JSON.parse(localStorage.getItem("user_data"));
  };

  return (
    <div className={styles.CSR}>
      <Header csr={csrDetails} onMenuClick={() => setIsSideMenuOpen(true)} />
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
              windowWidth={windowWidth}
              filterBadge={filterBadge}
              selectedTicket={ticket_number}
              notifSound={notifSound}
              setNotifSound={setNotifSound}
              setFilterBadge={setFilterBadge}
              onTicketsChange={(player: any) => {
                setPlayerDetails(player);
              }}
            />
          </div>
        </div>
        <div className={styles.rightPanel}>
         {ticket_number && <ChatHeader
            isOnline={true}
            onMenuClick={() => navigate("/")}
            showMobileMenu={windowWidth < 768}
            playerDetails={playerDetails}
          />}
          {ticket_number ? (
            <Outlet />
          ) : (
            <div className={styles.noSelection}>No selected conversation.</div>
          )}
        </div>
      </div>

      {/* Slide-in menu component */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        csr={csrDetails}
        notifSound={notifSound}
        setNotifSound={setNotifSound}
      />
    </div>
  );
};

const Header: React.FC<{ csr: any; onMenuClick: () => void }> = ({
  csr,
  onMenuClick,
}) => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <div className={styles.profilePicture}>
          <img src="https://placehold.co/50" alt="profile" />
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <p className={styles.userName}>
            {csr?.first_name || csr?.username || ""} {csr?.last_name || ""}
          </p>
          <p className={styles.userId}>User ID: {csr?.id || ""}</p>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className={styles.hamburgerMenu} onClick={onMenuClick}>
        <img
          src="/assets/Icons/hamburger.svg"
          alt="Menu"
          className={styles.menuIcon}
        />
      </div>
    </header>
  );
};

// New Side Menu Component
const SideMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  csr: any;
  notifSound: boolean;
  setNotifSound: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isOpen, onClose, csr, notifSound, setNotifSound }) => {
  const navigate = useNavigate();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = () => {
    clearLocalData();
    navigate("/login");
  };

  return (
    <div className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sideMenuOverlay}></div>
      <div className={styles.sideMenuContent}>
        <div className={styles.sideMenuHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <img
              src="/assets/Icons/close-icon-black.svg"
              width={12}
              alt="Close"
            />
          </button>
          <div className={styles.csrProfile}>
            <img
              src="https://placehold.co/80"
              alt="CSR"
              className={styles.csrAvatar}
            />
            <div className={styles.csrProfileDetails}>
              <h4>
                {csr?.first_name || "CS"} {csr?.last_name || "Princess"}
              </h4>
              <p>User ID: {csr?.id || "10-7045-6543-8912345"}</p>
            </div>
          </div>
        </div>

        <div className={styles.sideMenuOptions}>
          <div className={styles.menuItem}>
            <img src="/assets/Icons/sound-icon.svg" alt="Notification" />
            <span>Notification Sound</span>
            <div className={styles.toggle}>
              <input
                type="checkbox"
                id="soundToggle"
                checked={notifSound}
                onChange={(e) => setNotifSound(e.target.checked)}
              />
              <label htmlFor="soundToggle"></label>
            </div>
          </div>

          {/* <div className={styles.menuItem}>
            <img src="/assets/Icons/attendance.svg" alt="Attendance" />
            <span>My Attendance</span>
            <img src="/assets/Icons/chevron-right.svg" alt=">" className={styles.chevron} />
          </div> */}

          <div
            className={styles.menuItem}
            onClick={() => setShowSignOutModal(true)}
          >
            <img src="/assets/Icons/logout-icon.svg" alt="Sign Out" />
            <span>Sign Out</span>
            <img
              src="/assets/Icons/arrow-right-head-black.svg"
              alt=">"
              className={styles.chevron}
            />
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
};

// Sign Out Modal Component
const SignOutModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeModalButton} onClick={onCancel}>
          <span>×</span>
        </div>
        <div className={styles.modalIcon}>
          <img src="/assets/Icons/logout-icon.svg" alt="Sign Out" />
        </div>
        <div className={styles.modalText}>
          <p>
            Are you sure you want
            <br />
            to Sign Out?
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatHeader: React.FC<{
  isOnline?: boolean;
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
  playerDetails: {
    [key: string]: string | boolean | number | object | null | undefined;
  };
}> = ({ isOnline = true, onMenuClick, showMobileMenu, playerDetails }) => {
  const { ticket_number } = useParams();

  return (
    <div className={styles.chatHeader}>
      {showMobileMenu && (
        <button className={styles.mobileMenuButton} onClick={onMenuClick}>
          <img
            src="/assets/Icons/arrow-head-left.svg"
            alt="back-head"
            className={styles.menuIcon}
            style={{
              width: "1.5rem",
              marginTop: 4,
              filter: "invert(50%)",
            }}
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
        <h3 className="pb-0 mb-0">
          {String(playerDetails.first_name)} {String(playerDetails.last_name)}
        </h3>
        {/* <span className={styles.userId}>ID: {uuid.current}</span> */}
      </div>
      <div className={styles.ticketInfo}>
        <span className={styles.ticketNumber}>Ticket ID. {ticket_number}</span>
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
