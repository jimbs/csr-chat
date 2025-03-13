import "./styles.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { AttachFile, EmojiEmotions, Send } from "@mui/icons-material";
import styles from "./styles.module.scss";
import { generateCustomUUID } from "../../helper/generate.js";

const staticMessages = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    sender: "operator",
    time: "09:00",
  },
  {
    id: 2,
    text: "I need help with my account",
    sender: "user",
    time: "09:01",
  },
  {
    id: 3,
    text: "Sure, I'd be happy to help. What seems to be the issue?",
    sender: "operator",
    time: "09:02",
  },
  {
    id: 4,
    text: "I can't access my dashboard",
    sender: "user",
    time: "09:03",
  },
  {
    id: 5,
    text: "Let me check that for you. When did this issue start?",
    sender: "operator",
    time: "09:04",
  },
  { id: 6, text: "Since this morning", sender: "user", time: "09:05" },
  {
    id: 7,
    text: "I see. Have you tried clearing your browser cache?",
    sender: "operator",
    time: "09:06",
  },
  {
    id: 8,
    text: "No, I haven't. How do I do that?",
    sender: "user",
    time: "09:07",
  },
  {
    id: 9,
    text: "I'll guide you through the process",
    sender: "operator",
    time: "09:07",
  },
  {
    id: 10,
    text: "Press Ctrl+Shift+Delete on your keyboard",
    sender: "operator",
    time: "09:07",
  },
  { id: 11, text: "Okay, done", sender: "user", time: "09:10" },
  {
    id: 12,
    text: "Now select 'Cached images and files' and click Clear Data",
    sender: "operator",
    time: "09:11",
  },
  { id: 13, text: "I've done that", sender: "user", time: "09:12" },
  {
    id: 14,
    text: "Great! Now try accessing your dashboard again",
    sender: "operator",
    time: "09:13",
  },
  { id: 15, text: "It works now! Thank you!", sender: "user", time: "09:14" },
  {
    id: 16,
    text: "You're welcome! Is there anything else I can help you with?",
    sender: "operator",
    time: "09:15",
  },
  {
    id: 17,
    text: "No, that's all. Thanks again!",
    sender: "user",
    time: "09:16",
  },
  {
    id: 18,
    text: "Glad I could help. Have a great day!",
    sender: "operator",
    time: "09:17",
  },
  { id: 19, text: "You too!", sender: "user", time: "09:18" },
  {
    id: 20,
    text: "Thank you for using our service!",
    sender: "operator",
    time: "09:19",
  },
  // Add more messages as needed
];

export const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const uuid = useRef(generateCustomUUID());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [staticMessages]);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const [isOnline, setIsOnline] = useState(true); // Add this state

  return (
    <div className={styles.chatContainer}>
      {/* <div className={styles.chatHeader}>
        <div className={styles.userAvatar}>
          <img src="https://placehold.co/50" alt="User" />
        </div>
        <div className={styles.userInfo}>
          <h3 className="pb-0 mb-0">
            John Doe
            <span
              className={`${styles.status} ${
                isOnline ? styles.online : styles.offline
              }`}
            ></span>
          </h3>
        </div>
        <div className={styles.ticketInfo}>
          <span className={styles.ticketNumber}>Ticket No. 123456</span>
          <img src="/assets/Icons/more-icon.svg" alt="more" className={styles.moreIcon} />
        </div>
      </div> */}

      <div className={styles.messageList}>
        {staticMessages.map((msg, index) => (
          <div
            key={msg.id}
            className={`${styles.messageItem} ${
              msg.sender == "operator" ? styles.operator : styles.user
            }`}
          >
            <div className={styles.messageContent}>
              <span
                className={`${styles.messageTime}`}
                style={{
                  display:
                    index > 0 &&
                    staticMessages[index ? index - 1 : 0].time == msg.time &&
                    staticMessages[index ? index - 1 : 0].sender == msg.sender
                      ? "none"
                      : "block",
                  right:
                    index > 0 &&
                    staticMessages[index ? index - 1 : 0].sender != "operator"
                      ? "auto"
                      : ".9rem",
                }}
              >
                {msg.sender == "operator" ? "You" : msg.sender} {msg.time}
              </span>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSend()}
            className={styles.messageInput}
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
