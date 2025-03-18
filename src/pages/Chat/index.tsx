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

  const player_details = useMemo(
    () => messages[0]?.player_details ?? null,
    [ticket_number]
  );

  const messagesList = useMemo(() => {
    const sorted_data = messages
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
  }, [messages]);
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
  );

  useEffect(() => {
    setMessages(() => []);
    polling.start();

    scrollToBottom();
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
      setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      setMessage("");
      const res = await fetch("/api/send-ticket-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: newMessage }),
      });
      const _data = await res.json();

      if (_data.status_code == 201) {
        setTimeout(() => scrollToBottom(), 800);

        updateSendingMessages((prev: any) => [
          ...prev,
          { uuid, ..._data.data },
        ]);
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
                  {msg.message.split(/\n|\\n/).map((line: any, index: any) => (
                    <React.Fragment
                      key={`${line
                        .trim()
                        .split("")
                        .sort()
                        .join("")
                        .substring(0, 6)}${index}`}
                    >
                      {line}
                      {index < msg.message.split(/\n|\\n/).length - 1 && <br />}
                    </React.Fragment>
                  ))}
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
