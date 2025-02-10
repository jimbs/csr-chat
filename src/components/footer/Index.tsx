import React, { useState, useEffect } from "react";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

interface FooterProps {
  className?: string; // Allow 'className' to be passed as a prop
}

export function Footer({ className }: FooterProps) {
  const location = useLocation();
  const [selectedNav, setSelectedNav] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedNav(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    setSelectedNav(path);
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box className={`${styles.bottomNavContainer} ${styles.footer}`}>
        <BottomNavigation
          value={selectedNav}
          onChange={(event, newValue) => handleNavigation(newValue)}
          sx={{
            justifyContent: "space-between",
            background: "linear-gradient(to right, #FF2020, #C80000)",
            width: "100%",
            display: "flex",
            height: "72px",
          }}
        >
          {/* Home */}
          <BottomNavigationAction
            value="/"
            icon={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {selectedNav === "/" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-5px",
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#FFD700",
                      borderRadius: "50%",
                      zIndex: -1,
                    }}
                  />
                )}
                <img
                  src="/assets/navigation/HomeIcon.png"
                  alt="Home"
                  style={{ width: 30, height: 22 }}
                />
                <Box
                  sx={{
                    marginTop: "5px",
                    padding: selectedNav === "/" ? "2px 10px" : "0",
                    backgroundColor:
                      selectedNav === "/" ? "#FFD700" : "transparent",
                    color: selectedNav === "/" ? "#9C0000" : "#FFFFFF",
                    borderRadius: selectedNav === "/" ? "5px" : "0",
                    fontWeight: selectedNav === "/" ? "bold" : "normal",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                  }}
                >
                  Home
                </Box>
              </Box>
            }
          />
          {/* Games */}
          <BottomNavigationAction
            value="/games"
            icon={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {selectedNav === "/games" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-5px",
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#FFD700",
                      borderRadius: "50%",
                      zIndex: -1,
                    }}
                  />
                )}
                <img
                  src="/assets/navigation/GameIcon.png"
                  alt="Games"
                  style={{ width: 30, height: 22 }}
                />
                <Box
                  sx={{
                    marginTop: "5px",
                    padding: selectedNav === "/games" ? "2px 10px" : "0",
                    backgroundColor:
                      selectedNav === "/games" ? "#FFD700" : "transparent",
                    color: selectedNav === "/games" ? "#9C0000" : "#FFFFFF",
                    borderRadius: selectedNav === "/games" ? "10px" : "0",
                    fontWeight: selectedNav === "/games" ? "bold" : "normal",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                  }}
                >
                  Games
                </Box>
              </Box>
            }
          />

          {/* Wallet */}
          <BottomNavigationAction
            value="/wallet"
            icon={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  top: "-38px",
                }}
              >
                {/* Gradient Circle Background */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "70px",
                    height: "70px",
                    background:
                      "radial-gradient(circle, #9C0000 50%, #FFE40082 55%)",
                    borderRadius: "50%",
                    zIndex: 0,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
                {/* Wallet Icon */}
                <img
                  src="/assets/navigation/WalletIcon.png"
                  alt="Wallet"
                  style={{
                    width: 42,
                    height: 31,
                    zIndex: 1,
                    position: "absolute",
                  }}
                />
                {/* Wallet Label */}
                <Box
                  sx={{
                    marginTop: "105px",
                    padding: selectedNav === "/wallet" ? "2px 10px" : "0",
                    backgroundColor:
                      selectedNav === "/wallet" ? "#FFD700" : "transparent",
                    color: selectedNav === "/wallet" ? "#9C0000" : "#FFFFFF",
                    borderRadius: selectedNav === "/wallet" ? "5px" : "0",
                    fontWeight: selectedNav === "/wallet" ? "bold" : "normal",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                  }}
                >
                  Wallet
                </Box>
              </Box>
            }
          />

          {/* Promos */}
          <BottomNavigationAction
            value="/promos"
            icon={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {selectedNav === "/promos" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-5px",
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#FFD700",
                      borderRadius: "50%",
                      zIndex: -1,
                    }}
                  />
                )}
                <img
                  src="/assets/navigation/PromosIcon.png"
                  alt="Promos"
                  style={{ width: 30, height: 22 }}
                />
                <Box
                  sx={{
                    marginTop: "5px",
                    padding: selectedNav === "/promos" ? "2px 10px" : "0",
                    backgroundColor:
                      selectedNav === "/promos" ? "#FFD700" : "transparent",
                    color: selectedNav === "/promos" ? "#9C0000" : "#FFFFFF",
                    borderRadius: selectedNav === "/promos" ? "5px" : "0",
                    fontWeight: selectedNav === "/promos" ? "bold" : "normal",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',

                  }}
                >
                  Promos
                </Box>
              </Box>
            }
          />
          {/* More */}
          <BottomNavigationAction
            value="/more"
            icon={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {selectedNav === "/more" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-5px",
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#FFD700",
                      borderRadius: "50%",
                      zIndex: -1,
                    }}
                  />
                )}
                <img
                  src="/assets/navigation/MoreIcon.png"
                  alt="More"
                  style={{ width: 30, height: 22 }}
                />
                <Box
                  sx={{
                    marginTop: "5px",
                    padding: selectedNav === "/more" ? "2px 10px" : "0",
                    backgroundColor:
                      selectedNav === "/more" ? "#FFD700" : "transparent",
                    color: selectedNav === "/more" ? "#9C0000" : "#FFFFFF",
                    borderRadius: selectedNav === "/more" ? "5px" : "0",
                    fontWeight: selectedNav === "/more" ? "bold" : "normal",
                    fontSize: "12px",
                    fontFamily: '"Baloo 2", serif',
                  }}
                >
                  More
                </Box>
              </Box>
            }
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
}
