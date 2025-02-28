import React, { useState } from "react";
import styles from "./styles.module.scss";
import "./styles.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const sampleMessages = [
  {
    id: "jode7891990",
    name: "jode7891990",
    message: "Withdrawal Concern",
    time: "Today 10:06AM",
    avatar: "https://placehold.co/50",
    status: "online",
  },
  {
    id: "masa8172000",
    name: "masa8172000",
    message: "Deposit Concern",
    time: "Today 10:06AM",
    avatar: "https://placehold.co/50",
    status: "online",
    unread: 2,
  },
  {
    id: "locr2221984",
    name: "locr2221984",
    message: "Hello po!",
    time: "Today 09:23AM",
    avatar: "https://placehold.co/50",
    status: "offline",
    unread: 2,
  },
  {
    id: "guest_3",
    name: "guest_1",
    message: "Paano manalo dito?",
    time: "Today 08:15AM",
    avatar: "https://placehold.co/50",
    status: "offline",
  },
  {
    id: "guest_1",
    name: "guest_1",
    message: "Paano manalo dito?",
    time: "Today 08:15AM",
    avatar: "https://placehold.co/50",
    status: "offline",
  },
  {
    id: "guest_2",
    name: "guest_1",
    message: "Paano manalo dito?",
    time: "Today 08:15AM",
    avatar: "https://placehold.co/50",
    status: "offline",
  },
  {
    id: "jajo9902001",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902002",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902003",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902004",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902001_1",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902001_2",
    name: "jajo9902001", // keeping the display name same
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902001_3",
    name: "jajo9902001", // keeping the display name same
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
  {
    id: "jajo9902005",
    name: "jajo9902001",
    message: "Okay bye. Thanks.",
    time: "Yesterday",
    avatar: "https://placehold.co/50",
    status: "offline",
    rating: "😄",
  },
];

export const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filterBadge, setFilterBadge] = useState("all");
  const hasMessages = true;

  const isLoadedConversation = (id: string) => {
    const pathname = location.pathname;
    const pathnameArray = pathname.split("/").filter((x) => x);
    return pathnameArray[0] === id;
  };

  const handleSelect = (id: string) => {
    return () => {
      navigate(`/${id}`);
    };
  };

  return (
    <div className={styles.chatList}>
      <div className={styles.notificationSection}>
        <div className={styles.notificationLeft}>
          <span className={styles.soundIcon}><img src="/assets/Icons/sound-icon.svg" alt="sound-icon" width={16} /></span>
          <span className={styles.soundText}>Notification Sound</span>
        </div>
        <div className={styles.toggleSwitch}>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
          <span className={styles.toggleText}>ON</span>
        </div>
      </div>
      {hasMessages ? (
        <div className={styles.messageList}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search something here"
                className={styles.searchInput}
              />
            </div>
          </div>
          {sampleMessages.map((chat) => (
            <div
              key={chat.id}
              className={styles.chatItem}
              onClick={handleSelect(chat.id)}
              style={{
                backgroundColor: isLoadedConversation(chat.id) ? "#FFFAD1" : "",
              }}
            >
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className={styles.avatar}
                  />
                  <span
                    className={`${styles.status} ${
                      chat.status === "online" ? styles.online : ""
                    }`}
                  />
                </div>
                {chat.unread && (
                  <span className={styles.unreadBadge}>{chat.unread}</span>
                )}
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.userName}>{chat.name}</span>
                  <span className={styles.timeStamp}>{chat.time}</span>
                </div>
                <div className={styles.messagePreview}>
                  <p>{chat.message}</p>
                  {chat.rating && (
                    <span className={styles.rating}>Rated: {chat.rating}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noSelection}>No message available.</div>
      )}
    </div>
  );
};
