import React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  className?: string; // Allow 'className' to be passed as a prop
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleGoLogin = () => {
    navigate("/login");
    return; 
  };

  const handleGoRegister = () => {
    navigate("/register");
  };

  const isPromosPage =
    location.pathname === "/voucher" ||
    location.pathname === "/promos" ||
    location.pathname === "/promos/detail"; // Adjust based on your route

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          background: "linear-gradient(#FF2020, #C80000)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isPromosPage ? (
            <>
              {/* Back Button */}
              <img
                src="/assets/images/back.png"
                alt="Back"
                style={{
                  height: "18px",
                  cursor: "pointer",
                }}
                onClick={handleBack}
              />

              {/* Title */}
              <Typography
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: '"Baloo 2", serif',
                }}
              >
                Promotions
              </Typography>

              {/* Gift Icon */}
              <img
                src="/assets/images/gift.png"
                alt="Gift"
                style={{
                  height: "20px",
                }}
              />
            </>
          ) : (
            <>
              {/* Default Header Content */}
              <img
                src="/assets/images/karera logo.png"
                alt="Karera Logo"
                style={{
                  height: "auto",
                  width: "175px",
                  marginLeft: "-10px",
                }}
              />

              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="outlined"
                  onClick={handleGoLogin}
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "#fff",
                    backgroundColor: "transparent",
                    borderRadius: "36px",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                  }}
                >
                  Sign In
                </Button>

                <Button
                  variant="contained"
                  onClick={handleGoRegister}
                  sx={{
                    borderRadius: "36px",
                    textTransform: "none",
                    color: "#000",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                    background: "linear-gradient(#FFEA00, #FFC600)",
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
