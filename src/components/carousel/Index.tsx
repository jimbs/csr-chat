import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Carousel: React.FC = () => {
  const images = [
    "/assets/carousel/KareraLiveBanner.png",
    "/assets/carousel/DosLetraBanner.png",
    "/assets/carousel/ZodiacRaceBanner.png",
    "/assets/carousel/PromoBanner1.png",
    "/assets/carousel/PromoBanner2.png", 
    "/assets/carousel/BirthdayPromo.png",
  ];

  const settings = {
    dots: false,
    infinite: true, 
    speed: 500, 
    slidesToShow: 1,
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", marginTop: "60px" }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
