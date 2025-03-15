import "./styles.module.scss";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { AttachFile, EmojiEmotions, Send } from "@mui/icons-material";
import styles from "./styles.module.scss";
import {
  isDateEqual,
  formatMessageDate,
  formatMessageTime,
  getCurrentDateTime,
} from "../../helper/chatDateParser";
import { PollingService } from "../../services/pollingService";
import { useParams } from "react-router-dom";

const staticMessages = [
  {
    id: 1,
    message: "Hello! How can I help you today?",
    sender: "operator",
    time: "09:00",
    date_created: "2025-01-26",
    user_id: 128,
  },
  {
    id: 2,
    message: "I need help with my account",
    sender: "user",
    time: "09:01",
    date_created: "2025-01-26",
    user_id: 129,
  },
  {
    id: 3,
    message: "Sure, I'd be happy to help. What seems to be the issue?",
    sender: "operator",
    time: "09:02",
    date_created: "2025-01-26",
    user_id: 128,
  },
  {
    id: 4,
    message: "I can't access my dashboard",
    sender: "user",
    time: "09:03",
    date_created: "2025-01-25",
    user_id: 129,
  },
  {
    id: 5,
    message: "Let me check that for you. When did this issue start?",
    sender: "operator",
    time: "09:04",
    date_created: "2025-01-25",
    user_id: 128,
  },
  {
    id: 6,
    message: "Since this morning",
    sender: "user",
    time: "09:05",
    date_created: "2025-01-25",
    user_id: 129,
  },
  {
    id: 7,
    message: "I see. Have you tried clearing your browser cache?",
    sender: "operator",
    time: "09:06",
    date_created: "2025-01-24",
    user_id: 128,
  },
  {
    id: 8,
    message: "No, I haven't. How do I do that?",
    sender: "user",
    time: "09:07",
    date_created: "2025-01-24",
    user_id: 129,
  },
  {
    id: 9,
    message: "I'll guide you through the process",
    sender: "operator",
    time: "09:07",
    date_created: "2025-01-24",
    user_id: 128,
  },
  {
    id: 10,
    message: "Press Ctrl+Shift+Delete on your keyboard",
    sender: "operator",
    time: "09:07",
    date_created: "2025-01-24",
    user_id: 128,
  },
  {
    id: 11,
    message: "Okay, done",
    sender: "user",
    time: "09:10",
    date_created: "2025-01-23",
    user_id: 129,
  },
  {
    id: 12,
    message: "Now select 'Cached images and files' and click Clear Data",
    sender: "operator",
    time: "09:11",
    date_created: "2025-01-23",
    user_id: 128,
  },
  {
    id: 13,
    message: "I've done that",
    sender: "user",
    time: "09:12",
    date_created: "2025-01-23",
    user_id: 129,
  },
  {
    id: 14,
    message: "Great! Now try accessing your dashboard again",
    sender: "operator",
    time: "09:13",
    date_created: "2025-01-22",
    user_id: 128,
  },
  {
    id: 15,
    message: "It works now! Thank you!",
    sender: "user",
    time: "09:14",
    date_created: "2025-01-22",
    user_id: 129,
  },
  {
    id: 16,
    message: "You're welcome! Is there anything else I can help you with?",
    sender: "operator",
    time: "09:15",
    date_created: "2025-01-22",
    user_id: 128,
  },
  {
    id: 17,
    message: "No, that's all. Thanks again!",
    sender: "user",
    time: "09:16",
    date_created: "2025-01-21",
    user_id: 129,
  },
  {
    id: 18,
    message: "Glad I could help. Have a great day!",
    sender: "operator",
    time: "09:17",
    date_created: "2025-01-21",
    user_id: 128,
  },
  {
    id: 19,
    message: "You too!",
    sender: "user",
    time: "09:18",
    date_created: "2025-01-21",
    user_id: 129,
  },
  {
    id: 20,
    message: "Thank you for using our service!",
    sender: "operator",
    time: "09:19",
    date_created: "2025-01-21",
    user_id: 128,
  },
];

// const tokenn = localStorage.getItem("token");
const token =
  "Pl813FYaeWqsXcT1KtTKBWZLMnAyNGh6UmQ4cXEwUE1UVG1xdTk0aVJ4enlXRS8vdnU5UllpUGRQZFVvSkIrOHlwMmwrYk5Ba2czb3hDQ1JtdTlWRkJvRFJZejFNcnAyMGRxNHozK3J3OVVhTU80ZDZEcm5lZ1Z0TWUwYnlVbmNuSG54Z29KcjR0UWc4STFuU0l6TWtPN2g3Q2Z5ZTVCTE1ZS0VrQT09";
const user_id = -5;

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<any>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<any>([]);
  const [sendingMessages, updateSendingMessages] = useState<any>([]);
  const [data, setData] = useState<any>(null);
  const { ticket_number } = useParams();

  const messagesList = useMemo(
    () =>
      messages
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
        ),
    [messages]
  );
  const polling = useMemo(
    () =>
      new PollingService(
        async () => {
          try {
            const response = await fetch("/api/get-ticket-messages", {
              method: "POST",
              body: JSON.stringify({
                data: {
                  ticket_number: ticket_number,
                  user_id: user_id,
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
            setMessages((prevMessages: any) => {
              const existingIds = new Set(
                prevMessages.map((msg: any) => msg.id)
              );
              const uniqueNewMessages = newMessages.data.filter(
                (msg: any) => !existingIds.has(msg.id) || !msg.id
              );

              prevMessages = prevMessages
                .sort((a: any, b: any) => {
                  // Handle messages without id (uuid only) by placing them at the end
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
              let _newMessages = prevMessages.filter((msg: any) => {
                if (msg.uuid) {
                  const sending = sendingMessages.find(
                    (_: any) => _.uuid == msg.uuid
                  );
                  const isExist = existingIds.has(
                    sending?.ticket_message_id.toString()
                  );
                  if (isExist) {
                    updateSendingMessages(() => {
                      let clone = [...sendingMessages];
                      clone.splice(
                        clone.findIndex((_: any) => _.uuid == msg.uuid),
                        1
                      );
                      return clone;
                    });
                    return !isExist;
                  }
                  return true;
                }
                return true;
              });

              return [..._newMessages, ...uniqueNewMessages];
            });
          }
        },
        1000
      ),
    [ticket_number]
  ); // Remove messages from dependencies

  useEffect(() => {
    setMessages(() => []);
    polling.start();
    // Cleanup on unmount
    return () => {
      if (polling.isActive()) {
        polling.stop();
      }
    };
  }, [ticket_number]);

  const uuid = Math.random().toString(36).substr(2, 9);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      const res = await fetch("/api/send-ticket-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: newMessage }),
      });
      const _data = await res.json();

      if (_data.status_code == 201)
        updateSendingMessages((prev: any) => [
          ...prev,
          { uuid, ..._data.data },
        ]);
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
                  user_id == messagesList[index ? index - 1 : 0].user_id
                    ? "16px"
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
                      user_id == messagesList[index ? index - 1 : 0].user_id
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

                <p>{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <div
            contentEditable
            data-placeholder="Write your message here..."
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              setMessage(target.innerText);
              // Add/remove placeholder class based on content
              target.classList.toggle('empty', !target.innerText.trim());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={`${styles.messageInput} empty`}
            style={{}}
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
