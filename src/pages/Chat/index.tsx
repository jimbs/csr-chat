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

<<<<<<< Updated upstream
const token =
  "JZImtn9M2nIRNszBBOE9uVnM0SUo0dCtLeFdvbno5aWJmL2hVLzhha1MzV29GWk9udnVTTkZ2QW1TaEFNU21BSTRUOHlCTGcrSllFTHdMZk1rcTRZMUgwMUhCdUVqSGJqOEpCekUyL2FlQlJySlBXN0RzS3lRSEVjV0Y5UkViTnhyUW9IN0xRR2pZdFlPZ21Kdi91elNBMjRMbEk0VzgwZz09";
=======
>>>>>>> Stashed changes
const user_id = -5;

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<any>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<any>([]);
  const [sendingMessages, updateSendingMessages] = useState<any>([]);
  const [data, setData] = useState<any>(null);
  const { ticket_number } = useParams();

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
    setMessages([]); // Clear messages when ticket_number changes
    setTimeout(() => {
      scrollToBottom(true);
    }, 300);
    polling.start();

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

  return (
    <div
      className={styles.chatContainer}
      key={ticket_number ?? "ticket-number"}
    >
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              const lineCount = e.target.value.split("\n").length;
              e.target.style.height = `${Math.min(lineCount, 4) * 1}rem`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                e.target.style.height = "1rem";
              }
            }}
            className={`${styles.messageInput}`}
            style={{
              overflowY: "auto",
              resize: "none",
            }}
          />
          <div className={styles.inputActions}>
            <Send className={styles.icon} onClick={handleSend} />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.attachButton}>
            <img
              src="/assets/Icons/attach-file.svg"
              alt=""
              className="p-0"
              height={32}
            />
          </button>
          <button className={styles.endButton}>End</button>
          <button className={styles.rateButton}>Rate</button>
        </div>
      </div>
    </div>
  );
};
