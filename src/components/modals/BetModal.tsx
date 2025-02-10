import React, { useState } from "react";
import * as _ from "lodash";
import { Box } from "@mui/material";
import { playerData } from "../../data/PlayerData";
import { amounts } from "../../constant/constant";
import styles from "./styles.module.scss";

interface BetModalProps {
  selectedBet: any;
  selectedAmount: any;
  customAmount: any;
  playerBets: any;
  totalBets: any;
  setModalVisible: (visible: boolean) => void;
  setSelectedBet: (bet: any) => void;
  setSelectedAmount: (amount: any) => void;
  setCustomAmount: (amount: any) => void;
  setPlayerBets: (bet: any) => void;
  setTotalBets: (bet: any) => void;
}
  
export const BetModal: React.FC<BetModalProps> = ({
  selectedBet,
  selectedAmount,
  customAmount,
  playerBets,
  totalBets,
  setModalVisible,
  setSelectedBet,
  setSelectedAmount,
  setCustomAmount,
  setPlayerBets,
  setTotalBets,
}) => {
  const {
    odds,
    setOdds,
    credits,
    setCredits,
    send,
    user,
  } = playerData();

  const [isBetTypeModalVisible, setBetTypeModalVisible] = useState(false);
  const [betType, setBetType] = useState<"single" | "advance" | null>(null);

  const handleClearInput = () => {
    setCustomAmount(""); 
  };

  const closeModal = () => {
    setBetTypeModalVisible(false);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const validateAmount = () => {
    if (selectedAmount || customAmount) {
      const betAmount = selectedAmount === "ALL IN" ? credits : parseFloat(customAmount);
      if (isNaN(betAmount) || betAmount <= 0) {
        alert("Please enter a valid amount!");
        return;
      }

      // if (betAmount > credits) {
      //   alert("Insufficient credits!");
      //   return;
      // }
      setModalVisible(false);
      setBetTypeModalVisible(true);
    }
  }

  const handleConfirm = () => {
    // if (selectedAmount || customAmount) {
    //   // Deduct bet from credits
    //   setCredits(credits - betAmount);

    //   // Update bets and odds
    //   const updatedPlayerBets = { ...playerBets };
    //   const updatedTotalBets = { ...totalBets };

    //   if (selectedBet === "A") {
    //     updatedPlayerBets.A += betAmount;
    //     updatedTotalBets.A += betAmount;
    //   } else if (selectedBet === "B") {
    //     updatedPlayerBets.B += betAmount;
    //     updatedTotalBets.B += betAmount;
    //   }

    //   setPlayerBets(updatedPlayerBets);
    //   setTotalBets(updatedTotalBets);

    //   // Update odds dynamically
    //   const totalPool = updatedTotalBets.A + updatedTotalBets.B;
    //   const newOdds = {
    //     A: totalPool > 0 ? (totalPool / updatedTotalBets.A).toFixed(2) : 0,
    //     B: totalPool > 0 ? (totalPool / updatedTotalBets.B).toFixed(2) : 0,
    //   };

    //   setOdds(newOdds);

    //   // Send bet to backend
    //   send({
    //     channel: "Bet",
    //     data: {
    //       user_id: user?.id,
    //       selectedBet,
    //       betAmount,
    //       totalBets: updatedTotalBets,
    //       odds: newOdds,
    //     },
    //   });

    //   closeModal();
    // } else {
    //   alert("Please select or enter an amount!");
    // }
  };

  return (
    <Box>
      <div className={styles.modalOverlay}
        onClick={(e) => {
        if (e.target === e.currentTarget) {
        setModalVisible(false);
        setSelectedAmount(null);
        setCustomAmount("");
        }
      }}>
        <div className={styles.modal}>
          <div
              className={`${styles.modalHeader} ${
              selectedBet === "A" ? styles.headerA : selectedBet === "B" ? styles.headerB : ""
              }`}
          >
            {selectedBet === "A" && (
            <div className={styles.betType}>
              <img src="/assets/DosLetra/DosLetraA.png" alt="Bet A" className={styles.betIcon} />
              <span className={styles.betLabel}>LETRA A</span>
            </div>
            )}
            {selectedBet === "B" && (
            <div className={styles.betType}>
              <img src="/assets/DosLetra/DosLetraB.png" alt="Bet B" className={styles.betIcon} />
              <span className={styles.betLabel}>LETRA B</span>
            </div>
            )}
          </div>

          <div className={styles.betAmounts}>
            {amounts.map((amount) => (
            <button
              key={amount}
              className={`${styles.amountButton} ${
              selectedAmount === amount ? styles.selected : ""
              }`}
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount(amount === "ALL IN" ? "5000" : amount);
              }}
            >
              {amount}
            </button>
            ))}
          </div>

          <div className={styles.inputContainer}>
            <div className={`${styles.inputWrapper} ${customAmount ? styles.hasValue : ""}`}>
            <input
              type="text"
              placeholder="Enter Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className={styles.amountInput}
            />
              <span className={styles.currency}>{customAmount ? "₱" : ""}</span>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              className={styles.resetButton}
              onClick={handleClearInput}
              disabled={!customAmount && !selectedAmount} 
            >
              RESET
            </button>

            <button
              className={styles.confirmButton}
              onClick={validateAmount}
              disabled={!customAmount && !selectedAmount} 
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
      {isBetTypeModalVisible && (
        <div className={styles.modalOverlay}
          onClick={(e) => {
          if (e.target === e.currentTarget) {
          setModalVisible(false);
          setSelectedAmount(null);
          setCustomAmount("");
          }
        }}>
          <div className={styles.modal}>
            <div>Hello</div>
          </div>
        </div>
      )}
    </Box>
  );
};
