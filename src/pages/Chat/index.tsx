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
import { isMessageImage } from "../../services/messageTypeValidation";

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
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isRating, setIsRating] = useState<boolean>(false);
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

  const getTicketDetails = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching new messages:", error);
      throw error;
    }
  };

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
        type: "text",
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);
    const maxSizeMB = 15; // Maximum size in MB
    const minSizeMB = 10; // Minimum size in MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const minSizeBytes = minSizeMB * 1024 * 1024;

    const processedFiles: {
      name: string;
      type: string;
      base64: string;
      size: number;
    }[] = [];

    for (const file of files) {
      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file);
        let processedBase64 = base64Data;
        let currentSize = getBase64Size(base64Data);

        if (currentSize > maxSizeBytes) {
          processedBase64 = await reduceFileSize(
            file,
            base64Data,
            minSizeBytes,
            maxSizeBytes
          );
          currentSize = getBase64Size(processedBase64);
        }

        processedFiles.push({
          name: file.name,
          type: file.type,
          base64: processedBase64,
          size: Math.round((currentSize / (1024 * 1024)) * 100) / 100,
        });

        processedFiles.forEach(async (file: any) => {
          const uuid = Math.random().toString(36).substring(2, 15);
          const newMessage = {
            uuid,
            user_id: user_id,
            message: file.base64,
            type: "image",
            ticket_number: ticket_number,
            date_created: getCurrentDateTime(),
          };

          updateSendingMessages((prevMessages) => [
            ...prevMessages,
            newMessage,
          ]);
          setTimeout(() => scrollToBottom(), 800);

          console.log(newMessage);
          const _data = await apiCall({
            data: {
              endpoint: "send-ticket-message",
              data: newMessage,
            },
          });

          if (_data.status_code == 201)
            updateSendingMessages((prev: any) =>
              prev.filter((msg: any) => msg.uuid !== uuid)
            );
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    console.log("Processed files:", processedFiles);
    // Here you can handle the processed files, e.g., send them to the server
    // or add them to the message
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const getBase64Size = (base64String: string): number => {
    // Remove the data URL prefix to get just the base64 content
    const base64 = base64String.split(",")[1];
    // Calculate size in bytes: (base64 length * 3) / 4 - padding
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return (base64.length * 3) / 4 - padding;
  };

  const reduceFileSize = async (
    file: File,
    base64Data: string,
    targetMinSize: number,
    targetMaxSize: number
  ): Promise<string> => {
    // For images, use canvas to reduce quality/resolution
    if (file.type.startsWith("image/")) {
      return reduceImageSize(base64Data, targetMinSize, targetMaxSize);
    }

    // For other file types, we can't easily reduce size
    // You might want to implement specific handlers for different file types
    console.warn(`Cannot reduce size for file type: ${file.type}`);
    return base64Data;
  };

  const reduceImageSize = (
    base64Image: string,
    targetMinSize: number,
    targetMaxSize: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;

      img.onload = () => {
        let quality = 0.9; // Start with high quality
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d")!;

        // Start with original dimensions
        let width = img.width;
        let height = img.height;

        // If the image is very large, reduce dimensions first
        const MAX_DIMENSION = 2000;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Try to find the right quality through binary search
        const compress = (min: number, max: number) => {
          quality = (min + max) / 2;
          const result = canvas.toDataURL("image/jpeg", quality);
          const size = getBase64Size(result);

          // If we're within the target range or can't get closer, return the result
          if (
            (size >= targetMinSize && size <= targetMaxSize) ||
            Math.abs(max - min) < 0.01
          ) {
            resolve(result);
            return;
          }

          // Adjust quality and try again
          if (size > targetMaxSize) {
            compress(min, quality);
          } else {
            compress(quality, max);
          }
        };
        compress(0.1, 1.0);
      };
    });
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

  async function rateTheCSR(rating: number) {
    if (ticketDetails.csr_rating_to_customer) return;
    ticketDetails.status = rating;
    const params = {
      user_id: user_id,
      ticket_number: ticket_number,
      csr_rating_to_customer: rating,
      csr_remarks: rating == 5 ? "Satisfied" : "Unsatisfied",
      csr_satisfactory: rating == 5 ? "Satisfied" : "Unsatisfied",
    };
    const res = await apiCall({
      data: {
        endpoint: "rate-customer-for-ticket-interaction",
        data: params,
      },
    });

    if (res.status_code == 200) {
      await getTicketDetails();
    }
  }

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

                {isMessageImage(msg.message) ? (
                  <div className={styles.messageTextWrapper}>
                    <img
                      src={msg.message}
                      alt="Shared image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => setModalImage(msg.message)}
                    />
                  </div>
                ) : (
                  <div className={styles.messageTextWrapper}>
                    <p>
                      {(msg.message ?? "")
                        .split(/\n|\\n/)
                        .map((line: any, index: any) => {
                          return (
                            <React.Fragment key={index}>
                              {line}
                              {index <
                                msg.message.split(/\n|\\n/).length - 1 && (
                                <br />
                              )}
                            </React.Fragment>
                          );
                        })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {endedStatuses.includes(ticketDetails?.status) && (
            <div className={styles.endChatRow}>
              This chat session has ended.
            </div>
          )}
          {(!isRating || !ticketDetails?.csr_rating_to_customer) &&
            endedStatuses.includes(ticketDetails?.status) && (
              <div
                className={`${styles.feedbackSection} ${
                  ticketDetails?.csr_rating_to_customer
                    ? parseInt(ticketDetails.csr_rating_to_customer) == 5
                      ? styles["satisfied"]
                      : styles["not-satisfied"]
                    : ""
                }`}
              >
                <p>Did we solve your concern?</p>
                <div className={styles.feedbackIcons}>
                  <div
                    id={styles["rateSatisfied"]}
                    className={styles.feedbackIcon}
                    onClick={() => rateTheCSR(5)}
                  >
                    <img src="/assets/Icons/happy-face.svg" alt="Happy" />
                    <p>YES</p>
                  </div>
                  <div
                    id={styles["rateUnsatisfied"]}
                    className={styles.feedbackIcon}
                    onClick={() => rateTheCSR(1)}
                  >
                    <img src="/assets/Icons/sad-face.svg" alt="Sad" />
                    <p>NO</p>
                  </div>
                </div>
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
                multiple
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onClick={(e) => {
                  if (endedStatuses.includes(ticketDetails.status))
                    e.preventDefault();
                }}
                onChange={handleFileUpload}
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
              disabled={
                !endedStatuses.includes(ticketDetails.status) && ticketDetails?.csr_rating_to_customer
              }
              style={{
                filter:
                  endedStatuses.includes(ticketDetails.status) &&
                  !isRating &&
                  !ticketDetails?.csr_rating_to_customer
                    ? "none"
                    : "grayscale(1)",
                opacity:
                  endedStatuses.includes(ticketDetails.status) &&
                  !isRating &&
                  !ticketDetails?.csr_rating_to_customer
                    ? "1"
                    : ".5",
                cursor:
                  endedStatuses.includes(ticketDetails.status) &&
                  !isRating &&
                  !ticketDetails?.csr_rating_to_customer
                    ? "auto"
                    : "not-allowed",
              }}
              onClick={() => {
                if(ticketDetails?.csr_rating_to_customer) return;
                setIsRating(true);
              }}
            >
              Rate
            </button>
          </div>
        </div>
      )}
      {modalImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
              }}
              onClick={() => setModalImage(null)}
            >
              ✕
            </div>
            <img
              src={modalImage}
              alt="Full size image"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
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
