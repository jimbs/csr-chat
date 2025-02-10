import React from "react";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import styles from "./styles.module.scss";

export const Promotions: React.FC = () => {
  const promotions = [
    {
      image: "/assets/images/Promo1Home.png", 
      alt: "Welcome Bonus",
    },
    {
      image: "/assets/images/Promo2Home.png",
      alt: "Refer & Earn Promo",
    },
  ];

  return (
    <Box className={styles["promotions"]}>
      {/* Section Header */}
      <Box className={styles["header"]}>
        <img
          src="/assets/images/promosAnimated.gif" 
          alt="Promotions Icon"
          className={styles["header-icon"]}
        />
        <Typography className={styles["header-title"]}>Promotions</Typography>
      </Box>

      {/* Promotion Banners */}
      <Box className={styles["banners"]}>
        {promotions.map((promo, index) => (
          <Card key={index} className={styles["promo-card"]}>
            <CardMedia
              component="img"
              image={promo.image}
              alt={promo.alt}
              className={styles["promo-image"]}
            />
          </Card>
        ))}
      </Box>
    </Box>
  );
};
