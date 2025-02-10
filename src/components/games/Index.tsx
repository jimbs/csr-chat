import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, ButtonBase } from "@mui/material";
import styles from './styles.module.scss'; // Import SCSS module

export const LiveBettingGames: React.FC = () => {
  // Data for the games
  const games = [
    {
      image: "/assets/games/Zodiac.png", // Replace with actual paths
      title: "Zodiac Race",
    },
    {
      image: "/assets/games/DosLetra.png", // Replace with actual paths
      title: "Dos Letra Karera",
    },
    {
      image: "/assets/games/TresLetra.png", // Replace with actual paths
      title: "Tres Letra Karera",
    },
  ];

  return (
    <Box>
      {/* Section Title */}
      <Box className={styles["section-title"]}>
        <img
          src="/assets/images/hot.png" // Replace with your hot icon path
          alt="Hot Icon"
          className={styles["hot-icon"]}
        />
        <Typography className={styles["section-title-text"]}>
          Live Betting Games
        </Typography>
      </Box>

      {/* Game Cards */}
      <Box className={styles["game-cards"]}>
        {games.map((game, index) => (
          <ButtonBase
            key={index}
            className={styles["game-card-button"]}
            onClick={() => alert(`Clicked on ${game.title}`)} // Add your button logic here
          >
            <Card className={styles["game-card"]}>
              {/* Game Image */}
              <CardMedia
                component="img"
                image={game.image}
                alt={game.title}
                className={styles["game-image"]}
              />
              <CardContent className={styles["game-content"]}>
                {/* Game Title */}
                <Typography className={styles["game-title"]}>
                  {game.title}
                </Typography>
              </CardContent>
            </Card>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
};
