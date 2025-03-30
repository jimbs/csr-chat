import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import "./styles.module.scss";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PollingService } from "../../services/pollingService";
import {
  formatMessageDate,
  formatMessageTime,
  getAMonthRangeOfDate,
} from "../../helper/chatDateParser";
import { apiCall, apiCallLocal } from "../Services/APICalls";
import {
  checkCredentials,
  clearLocalData,
} from "../Services/Backend/storeLocalData";
import { useToast } from "../../context/ToastContext";

const user_id = -5;

export const ChatList: React.FC<{
  windowWidth: number | null;
  filterBadge?: string;
  selectedTicket?: string;
  notifSound: boolean;
  setNotifSound: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterBadge: React.Dispatch<React.SetStateAction<string>>;
  onTicketsChange?: (tickets: { [param: string]: any }) => void;
}> = ({
  windowWidth,
  filterBadge,
  selectedTicket,
  setFilterBadge,
  onTicketsChange,
  notifSound,
  setNotifSound,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [takingTicket, setTakingTicket] = useState(false);
  const [tickets, setTickets] = useState<any>([]);
  const { ticket_number } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userDetails, setUserDetails] = useState<any>(null);

  const handleResize = () => {
    if (window.innerWidth <= 768 && selectedTicket) {
      polling.stop();
      return;
    }
    if (localStorage.getItem("user_id")) polling.start();
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
            const range = getAMonthRangeOfDate();
            const newMessages = await apiCall({
              data: {
                endpoint: "get-csr-tickets",
                data: {
                  user_id: user_id,
                  status: filterBadge, // If Pending was used, it will not locked to the csr, all  will be visible, other statuses, only the csr assigned will see it.
                  date_from: range.from,
                  date_to: range.to,
                  limit: 10, // put -1 for limitless
                },
              },
            });
            const sortedMessages = {
              ...newMessages,
              data: newMessages.data.sort((a: any, b: any) => {
                return (
                  new Date(b.latest_ticket_message.date_created).getTime() -
                  new Date(a.latest_ticket_message.date_created).getTime()
                );
              }),
            };
            return sortedMessages;
          } catch (error) {
            console.error("Error fetching new messages:", error);
            throw error;
          }
        },
        (newMessages) => {
          if (newMessages.status_code == 200) {
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

  const fetchTickets = async (status) => {
    try {
      const range = getAMonthRangeOfDate();

      const response = await apiCall({
        data: {
          endpoint: "get-csr-tickets",
          data: {
            user_id: user_id,
            status: status, // If Pending was used, it will not locked to the csr, all  will be visible, other statuses, only the csr assigned will see it.
            date_from: range.from,
            date_to: range.to,
            limit: 10, // put -1 for limitless
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching new messages:", error);
      throw error;
    }
  };

  const handleTakeTicket = async (ticket_num: string, player: any) => {
    try {
      setTakingTicket(true);
      const newMessages = await apiCall({
        data: {
          data: {
            user_id: user_id,
            status: "In Progress",
            ticket_number: ticket_num,
          },
          endpoint: "update-ticket-status",
        },
      });
      if (newMessages.status_code == 200) {
        await apiCall({
          data: {
            data: {
              user_id: user_id,
              ticket_number: ticket_num,
              message: "Hi this is csr_1 happy to serve you.",
            },
            endpoint: "send-ticket-message",
          },
        });
        setFilterBadge("In Progress");
        navigate(`/${ticket_num}`);
        onTicketsChange(player);
        setTakingTicket(false);
      }
    } catch (error) {
      console.error("Error fetching new messages:", error);
      setTakingTicket(false);
      throw error;
    }
  };

  const nameToDisplay = (obj: any) => {
    const { customer_details } = obj;
    if (!customer_details) return obj.ticket_number;

    if (customer_details.first_name && customer_details.last_name) {
      return `${customer_details.first_name} ${customer_details.last_name}`;
    } else if (customer_details.first_name) {
      return customer_details.first_name;
    } else if (customer_details.last_name) {
      return customer_details.last_name;
    } else {
      return "Unknown";
    }
  };

  const handleSelect = (id: string, player: any) => {
    if (filterBadge === "Pending" || id == ticket_number) return;
    navigate(`/${id}`);
    onTicketsChange(player);
  };

  const setUserDetailsLocal = () => {
    if (localStorage.getItem("user_data") == "undefined") return null;
    return JSON.parse(localStorage.getItem("user_data"));
  };

  useEffect(() => {
    // if (!checkCredentials()) {
    //   navigate("/login");
    //   return;
    // }

    if (!userDetails) {
      if (!setUserDetailsLocal()) {
        clearLocalData();
        navigate("/login");
        return;
      }

      setUserDetails(setUserDetailsLocal());
    }

    let hasError = false;

    if (!initialLoad) {
      (async () => {
        const ticket = await apiCall({
          data: {
            endpoint: "get-ticket-details",
            data: {
              user_id: user_id,
              ticket_number: ticket_number,
            },
          }, 
        })

        if (ticket.status_code != 200) {
         showToast({
          message: "An error occured while getting ticket details.",
          type: "error",
          duration: -1,
         });
         polling.stop();
         return;
        }

        setFilterBadge(ticket.data.status);
        const res = await fetchTickets(ticket.data.status);
        const { data } = res;
        if (ticket_number)
          onTicketsChange(
            data.find((x: any) => x.ticket_number == ticket_number)
              .customer_details
          );
      })();

      setInitialLoad(true);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    // Remove the automatic sound play on component mount
    // playNotificationSound()
    return () => {
      polling.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [filterBadge, selectedTicket]);

  const playNotificationSound = (sound?: string) => {
    // Only play if notification sound is enabled
    if (notifSound) {
      const audio = new Audio("/assets/Sounds/notification-2-269292.mp3");
      audio.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

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
            <input
              type="checkbox"
              checked={notifSound}
              onChange={(e) => setNotifSound(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
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
              onClick={() =>
                handleSelect(chat.ticket_number, chat.customer_details)
              }
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
                  <span className={styles.userName}>{nameToDisplay(chat)}</span>
                  <span className={styles.timeStamp}>
                    {formatMessageDate(chat.date_modified, {
                      time_context: true,
                      date: false,
                      time: true,
                    })}
                  </span>
                </div>
                <div className={styles.messagePreview}>
                  <p>
                    {chat.latest_ticket_message?.message
                      .split(/\n|\\n/)
                      .join(" ") ?? chat.concern_type}
                  </p>
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

                    await handleTakeTicket(
                      chat.ticket_number,
                      chat.customer_details
                    );
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
