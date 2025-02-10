import React from "react";
import { Box, Typography } from "@mui/material";
import styles from './styles.module.scss'; // Import SCSS file

export const LatestWinnings: React.FC = () => {

  const data = [
    { player: "okkokey67", game: "Dos Letra Karera", bets: "₱ 550.00", winnings: "₱ 4,550.00" },
    { player: "mr.donut20", game: "Tres Letra Karera", bets: "₱ 550.00", winnings: "₱ 7,250.00" },
    { player: "justinPogi", game: "Dos Letra Karera", bets: "₱ 550.00", winnings: "₱ 950.00" },
    { player: "baninay", game: "Zodiac Race", bets: "₱ 550.00", winnings: "₱ 510.00" },
    { player: "player5", game: "Zodiac Race", bets: "₱ 550.00", winnings: "₱ 5,550.00" },
    { player: "player6", game: "Dos Letra Karera", bets: "₱ 550.00", winnings: "₱ 6,550.00" },
    { player: "justinPogi", game: "Dos Letra Karera", bets: "₱ 550.00", winnings: "₱ 950.00" },
    { player: "baninay", game: "Zodiac Race", bets: "₱ 550.00", winnings: "₱ 510.00" },
    { player: "player5", game: "Zodiac Race", bets: "₱ 550.00", winnings: "₱ 5,550.00" },
    { player: "player6", game: "Dos Letra Karera", bets: "₱ 550.00", winnings: "₱ 6,550.00" },
  ];

  return (
    <Box className={styles["latest-winnings"]}>
      {/* Header */}
      <Box className={styles["header"]}>
        <Box className={styles["header-icon"]}>
          <img
            src="/assets/images/wins.png" // Replace with the actual icon path
            alt="Trophy Icon"
          />
        </Box>
        <Typography className={styles["header-title"]}>Latest</Typography>
        <Typography className={styles["header-tag"]}>Winnings</Typography>
      </Box>

     {/* Table Container */}
      <Box className={styles["table-container"]}>
        {/* Table Header */}
        <Box className={styles["table-header"]}>
          <Typography className={styles["header-cell"]}>Player</Typography>
          <Typography className={styles["header-cell"]}>Game</Typography>
          <Typography className={styles["header-cell"]}>Bets</Typography>
          <Typography className={styles["header-cell"]}>Winnings</Typography>
        </Box>

        {/* Table Rows */}
        <Box className={styles["table-rows"]}>
          {data.map((row, index) => (
            <Box key={index} className={styles["table-row"]}>
              <Typography className={styles["table-cell"]}>{row.player}</Typography>
              <Typography className={styles["table-cell"]}>{row.game}</Typography>
              <Typography className={`${styles["table-cell"]} ${styles["bets"]}`}>{row.bets}</Typography>
              <Typography className={`${styles["table-cell"]} ${styles["winnings"]}`}>{row.winnings}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
