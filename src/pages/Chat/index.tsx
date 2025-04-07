import "./styles.module.scss";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Send } from "@mui/icons-material";
import styles from "./styles.module.scss";
import {
  formatMessageDate,
  formatMessageTime,
  getCurrentDateTime,
} from "../../helper/chatDateParser";
import { PollingService } from "../../services/pollingService";
import { useParams } from "react-router-dom";
import { apiCall } from "../Services/APICalls";
import { convertImageToBase64 } from "../../helper/img-converter";
import { useToast } from "../../context/ToastContext";

const endedStatuses = ["Closed Resolved", "Closed Unresolved"];

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<any>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<any>([]);
  const [sendingMessages, updateSendingMessages] = useState<any>([]);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const { ticket_number } = useParams();
  const [endCallModalShow, setEndCallModalShow] = useState<boolean>(false);
  const user_id = parseInt(localStorage.getItem("user_id"));
  const { showToast } = useToast();

  const messagesList = useMemo(() => {
    const sorted_data = [...messages, ...sendingMessages]
      .map((msg: any) =>
        msg.date_created
          ? {
              ...msg,
              date: formatMessageDate(msg.date_created) ?? null,
              time: formatMessageTime(msg.date_created) ?? null,
            }
          : msg
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.date_created).getTime() -
          new Date(b.date_created).getTime()
      );
    return sorted_data;
  }, [messages, sendingMessages]);

  const polling = useMemo(
    () =>
      new PollingService(
        async () => {
          try {
            const newMessages = await apiCall({
              data: {
                endpoint: "get-ticket-messages",
                data: {
                  ticket_number: ticket_number,
                  user_id: user_id,
                },
              },
            });
            return newMessages;
          } catch (error) {
            console.error("Error fetching new messages:", error);
            throw error;
          }
        },
        (newMessages) => {
          if (newMessages.status_code == 200) {
            setMessages((prevMessages: any) => {
              const existingIds = new Set(
                prevMessages.map((msg: any) => msg.id)
              );
              const uniqueNewMessages = newMessages.data.filter(
                (msg: any) => !existingIds.has(msg.id) || !msg.id
              );

              prevMessages = prevMessages
                .sort((a: any, b: any) => {
                  if (!a.id) return 1;
                  if (!b.id) return -1;
                  return parseInt(a.id) - parseInt(b.id);
                })
                .filter((msg: any) => {
                  return uniqueNewMessages.findIndex(
                    (_msg: any) =>
                      _msg.uuid == msg.uuid &&
                      msg.id == _msg.ticket_message_number
                  );
                });

              return [...prevMessages, ...uniqueNewMessages];
            });
          }
        },
        1000
      ),
    [ticket_number]
  );

  useEffect(() => {
    // if (!checkCredentials()) {
    //   navigate("/login");
    //   return;
    // }
    setMessages([]);

    const handelFetch = async () => {
      const _data = await apiCall({
        data: {
          endpoint: "get-ticket-details",
          data: {
            ticket_number: ticket_number,
            user_id: user_id,
          },
        },
      });
      if (_data.status_code != 200) {
        showToast({
          message: `An error occured getting the ticket ${ticket_number} details. Please reload the browser.`,
          type: "error",
          duration: -1,
        });
        return;
      }

      setTicketDetails(() => _data.data);


      setTimeout(() => {
        scrollToBottom(true);
      }, 500);
      polling.start();
      if (endedStatuses.includes(_data.data.status)) {
        polling.stop();
      }
    };

    handelFetch();

    return () => {
      if (polling.isActive()) {
        polling.stop();
      }
    };
  }, [ticket_number]);

  const scrollToBottom = (quick?: boolean) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: quick ? "auto" : "smooth",
    });
  };

  const handleSend = async () => {
    const uuid = Math.random().toString(36).substring(2, 15);
    if (message.trim()) {
      const newMessage = {
        uuid,
        user_id: user_id,
        message: message,
        type: "message",
        ticket_number: ticket_number,
        date_created: getCurrentDateTime(),
      };

      updateSendingMessages((prevMessages: any) => [
        ...prevMessages,
        newMessage,
      ]);
      setMessage("");

      const _data = await apiCall({
        data: { data: newMessage, endpoint: "send-ticket-message" },
      });

      if (_data.status_code == 201) {
        updateSendingMessages((prev: any) =>
          prev.filter((_: any) => _.uuid != uuid)
        );
      }
    }
  };

  const handleEndChat = async (status: string) => {
    // Here you would handle the API call to end the chat with the selected status
    const response = await apiCall({
      data: {
        endpoint: "update-ticket-status",
        data: {
          ticket_number: ticket_number,
          status: status,
          user_id: user_id,
        },
      },
    });

    if (response.status_code != 200) {
      showToast({
        message: `An error occured ending the chat. Please try again.`,
        type: "error",
        duration: 6000,
      });
      return "failed";
    }

    setTicketDetails((prev: any) => ({
      ...prev,
      status: status,
    }));
    polling.stop();
    setEndCallModalShow(false);
  };

  return (
    <div
      className={styles.chatContainer}
      key={ticket_number ?? "ticket-number"}
    >
      {endCallModalShow && (
        <EndChatModal
          onConfirm={(status) => handleEndChat(status)}
          onCancel={() => setEndCallModalShow(false)}
        />
      )}
      <div className={styles.messageListWrapper}>
        <div className={styles.messageList}>
          {messagesList.map((msg: any, index: any) => (
            <div
              key={`${msg.id}-${index}`}
              className={`${styles.messageItem} ${
                msg.user_id == user_id ? styles.operator : styles.user
              }`}
              style={{
                marginTop:
                  index != 0 &&
                  messagesList[index ? index - 1 : 0].time == msg.time &&
                  msg.user_id == messagesList[index ? index - 1 : 0].user_id
                    ? "8px"
                    : "24px",
              }}
            >
              {messagesList[index ? index - 1 : 0]?.date &&
                msg.date &&
                (messagesList[index ? index - 1 : 0]?.date != msg.date ||
                  !index) && (
                  <div className={styles["span-by-date"]}>{msg.date}</div>
                )}
              <div className={styles.messageContent}>
                <span
                  className={`${styles.messageTime}`}
                  style={{
                    display:
                      index != 0 &&
                      messagesList[index ? index - 1 : 0].time == msg.time &&
                      msg.user_id == messagesList[index ? index - 1 : 0].user_id
                        ? "none"
                        : "block",
                    right:
                      index > -1 && messagesList[index].user_id != user_id
                        ? "6px"
                        : "auto",
                  }}
                >
                  {msg.created_by == user_id
                    ? "You"
                    : msg.user_details?.username ??
                      msg.user_details?.mobile_number}{" "}
                  {msg.id && msg.time}
                </span>

                {!msg.id && (
                  <span className={`${styles.spinner} ${styles.user}`}></span>
                )}

                <p>
                  {msg.message.split(/\n|\\n/).map((line: any, index: any) => {
                    return (
                      <React.Fragment
                        key={`${line
                          .trim()
                          .split("")
                          .sort()
                          .join("")
                          .substring(0, 6)}${index}`}
                      >
                        {line}
                        {index < msg.message.split(/\n|\\n/).length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    );
                  })}
                </p>
              </div>
            </div>
          ))}
          {endedStatuses.includes(ticketDetails?.status) && (
            <div className={styles.endChatRow}>
              This chat session has ended.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {ticketDetails && (
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <textarea
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => {
                if (endedStatuses.includes(ticketDetails.status)) {
                  e.preventDefault();
                  setMessage("");
                  return;
                }
                setMessage(e.target.value);
                const lineCount = e.target.value.split("\n").length;
                e.target.style.height = `${Math.min(lineCount, 4) * 1}rem`;
              }}
              onKeyDown={(e) => {
                if (endedStatuses.includes(ticketDetails.status)) return;
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  // @ts-ignore
                  e.target.style.height = "1rem";
                }
              }}
              className={`${styles.messageInput}`}
              style={{
                overflowY: "auto",
                resize: "none",
              }}
              disabled={endedStatuses.includes(ticketDetails.status)}
            />
            <div className={styles.inputActions}>
              <Send className={styles.icon} onClick={handleSend} />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.attachButton}>
              <input
                type="file"
                id="fileInput"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onClick={(e) => {
                  if (endedStatuses.includes(ticketDetails.status))
                    e.preventDefault();
                }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Handle the file upload here
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    console.log("File size:", fileSizeMB, "MB");
                    console.log("File type:", file.type);
                    console.log("File:", file);

                    try {
                      const base64 = await convertImageToBase64(file);
                      console.log("Base64 conversion:", base64);
                    } catch (error) {
                      console.error("Error converting to base64:", error);
                    }
                  }
                }}
                disabled={endedStatuses.includes(ticketDetails.status)}
              />
              <label htmlFor="fileInput">
                <img
                  src="/assets/Icons/attach-file.svg"
                  alt="Attach file"
                  className="p-0"
                  height={32}
                />
              </label>
            </button>
            <button
              className={styles.endButton}
              onClick={() => {
                if (endedStatuses.includes(ticketDetails.status)) return;
                setEndCallModalShow(true);
              }}
              disabled={endedStatuses.includes(ticketDetails.status)}
            >
              End
            </button>
            <button
              className={styles.rateButton}
              disabled={!endedStatuses.includes(ticketDetails.status)}
            >
              Rate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EndChatModal: React.FC<{
  onConfirm: (status: string) => Promise<string>;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    if (selectedStatus) {
      try {
        const res = await onConfirm(selectedStatus);
        if (res == "failed") {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error ending chat:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    showToast({
      message: "Please select a status to end the chat.",
      type: "info",
      duration: 5000,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeModalButton} onClick={onCancel}>
          <span>×</span>
        </div>
        <div className={styles.modalIcon}>
          {/* <img src="/assets/Icons/logout-icon.svg" alt="Sign Out" /> */}
        </div>
        <div className={styles.modalText}>
          <p>Are you sure you want to end this chat?</p>
          <span>It will close the conversation right away.</span>
        </div>

        <div className={styles.statusOptions}>
          <div className={styles.statusDropdownContainer}>
            <p>Please select a status:</p>
            <select
              className={styles.statusDropdown}
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Closed Resolved">Resolved</option>
              <option value="Closed Unresolved">Unresolved</option>
            </select>
          </div>
        </div>

        <div className={styles.modalButtons}>
          <button
            className={`${styles.endCallButton} ${
              !selectedStatus || isLoading ? styles.disabled : ""
            }`}
            onClick={handleConfirm}
            disabled={!selectedStatus || isLoading}
          >
            {isLoading ? (
              <span className={styles.buttonSpinner}></span>
            ) : (
              "Yes, end this chat"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
