import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import "./styles.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { PollingService } from "../../services/pollingService";
import {
  formatMessageDate,
  formatMessageTime,
} from "../../helper/chatDateParser";

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

const token =
  "Pl813FYaeWqsXcT1KtTKBWZLMnAyNGh6UmQ4cXEwUE1UVG1xdTk0aVJ4enlXRS8vdnU5UllpUGRQZFVvSkIrOHlwMmwrYk5Ba2czb3hDQ1JtdTlWRkJvRFJZejFNcnAyMGRxNHozK3J3OVVhTU80ZDZEcm5lZ1Z0TWUwYnlVbmNuSG54Z29KcjR0UWc4STFuU0l6TWtPN2g3Q2Z5ZTVCTE1ZS0VrQT09";
const user_id = -5;

// Update the component to accept filterBadge as a prop
export const ChatList: React.FC<{
  filterBadge?: string;
  selectedTicket?: string;
  setFilterBadge: React.Dispatch<React.SetStateAction<string>>;
}> = ({ filterBadge, selectedTicket, setFilterBadge }) => {
  // Use filterBadge in your component logic to filter the chat list
  const navigate = useNavigate();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [takingTicket, setTakingTicket] = useState(false);
  const [tickets, setTickets] = useState<any>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    if (window.innerWidth <= 768 && selectedTicket) {
      console.log(true)
      polling.stop();
      return;
    }
      console.log(false)
      polling.start();
  };

  const isLoadedConversation = (id: string) => {
    const pathname = location.pathname;
    const pathnameArray = pathname.split("/").filter((x) => x);
    return pathnameArray[0] === id;
  };

  const polling = useMemo(
    () =>
      new PollingService(
        async () => {
          try {
            const response = await fetch("/api/get-csr-tickets", {
              method: "POST",
              body: JSON.stringify({
                data: {
                  user_id: user_id,
                  status: filterBadge, // If Pending was used, it will not locked to the csr, all  will be visible, other statuses, only the csr assigned will see it.
                  date_from: "2024-02-15 00:00:00",
                  date_to: "2025-03-15 23:50:17",
                  limit: 10, // put -1 for limitless
                },
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const newMessages = await response.json();
            return newMessages;
          } catch (error) {
            console.error("Error fetching new messages:", error);
            throw error;
          }
        },
        (newMessages) => {
          if (newMessages.status_code == 200) {
            // Filter duplicates by message id
            setTickets(newMessages.data);
            if (isLoading) {
              setIsLoading(false);
            }
          }
        },
        1500
      ),
    [filterBadge]
  );

  const handleTakeTicket = async (ticket_num: string) => {
    try {
      setTakingTicket(true);
      const response = await fetch("/api/update-ticket-status", {
        method: "POST",
        body: JSON.stringify({
          data: {
            user_id: user_id,
            status: "In Progress",
            ticket_number: ticket_num,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const newMessages = await response.json();
      if (newMessages.status_code == 200) {
        const response = await fetch("/api/send-ticket-message", {
          method: "POST",
          body: JSON.stringify({
            data: {
              user_id: user_id,
              ticket_number: ticket_num,
              message: "Hi this is csr_1 happy to serve you.",
            },
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFilterBadge("In Progress");
        navigate(`/${ticket_num}`);
        setTakingTicket(false);
      }
    } catch (error) {
      console.error("Error fetching new messages:", error);
      setTakingTicket(false);
      throw error;
    }
  };

  const handleSelect = (id: string) => {
    if (filterBadge === "Pending") return;
    navigate(`/${id}`);
  };

  useEffect(() => {
    handleResize();

    if (!initialLoad) {
      handleResize();
      window.addEventListener("resize", handleResize);
      setInitialLoad(true);
    }
    return () => {
      polling.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [filterBadge, selectedTicket]);

  return (
    <div className={styles.chatList}>
      <div className={styles.notificationSection}>
        <div className={styles.notificationLeft}>
          <span className={styles.soundIcon}>
            <img
              src="/assets/Icons/sound-icon.svg"
              alt="sound-icon"
              width={16}
            />
          </span>
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
      {tickets.length ? (
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
          {/* {sampleMessages.map((chat) => (
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
          ))} */}
          {tickets.map((chat: any) => (
            <div
              key={chat.id}
              className={styles.chatItem}
              onClick={() => handleSelect(chat.ticket_number)}
              style={{
                backgroundColor: isLoadedConversation(chat.ticket_number)
                  ? "#FFFAD1"
                  : "",
              }}
            >
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <img
                    src={chat.avatar ?? "https://placehold.co/50"}
                    alt={chat.name ?? "User"}
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
                  <span className={styles.userName}>{chat.ticket_number}</span>
                  <span className={styles.timeStamp}>
                    {formatMessageDate(chat.date_modified, {
                      time_context: true,
                      date: false,
                      time: true,
                    })}
                  </span>
                </div>
                <div className={styles.messagePreview}>
                  <p>{chat.concern_type}</p>
                  {chat.rating && (
                    <span className={styles.rating}>Rated: {chat.rating}</span>
                  )}
                </div>
              </div>
              {filterBadge === "Pending" && (
                <button
                  className={`${styles.takeTicketBtn} ${
                    takingTicket ? styles.loading : ""
                  }`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (takingTicket) return;
                    // Add your take ticket logic here
                    await handleTakeTicket(chat.ticket_number);
                  }}
                  disabled={takingTicket}
                >
                  {takingTicket ? "Taking..." : "Take Ticket"}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noSelection}>No message available.</div>
      )}
    </div>
  );
};
