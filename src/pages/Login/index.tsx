import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TermsModal } from "../../components/TermsPopUp/Index";
import UserService from "../Services/Backend/UserServices";
import { UserData } from "../../store/UserDataStore";
import { apiCall, apiCallLocal } from "../Services/APICalls";
import CircularProgress from "@mui/material/CircularProgress";
import { checkCredentials } from "../Services/Backend/storeLocalData";
export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    checkCredentials() && navigate("/");
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const payload = {
        data: {
          endpoint: "username-login",
          data: {
            // login_type: "password",
            // mobile_number: "09050000001", // Replace with the actual phone number
            username: phoneNumber,
            password: password,
          },
        },
      };

      const loginResult = await apiCall(payload, payload.data.endpoint);
      // const loginResult = await apiCall(payload);

      if (loginResult && loginResult.status_code === 200) {
        setLoginSuccess(true);
        // Navigate after showing success message for a moment
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      if (!loginSuccess) setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-background"]}>
      {/* Success overlay */}
      {loginSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "25px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              maxWidth: "220px",
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src="/assets/Icons/success-check-icon.svg"
                width={74}
                style={{ marginTop: ".5rem" }}
                alt="Login Successfully"
              />
            </div>
            <p
              style={{
                fontFamily: '"Baloo 2", serif',
                margin: 0,
                textAlign: "center",
              }}
            >
              Your account has been successfully logged in.
            </p>
          </div>
        </div>
      )}

      <div className={styles["header-container"]}>
        <img src="/assets/LoginAssets/karera logo.png" alt="Karera Live" />
        <img src="/assets/LoginAssets/Secure-login.png" alt="secured login" />
      </div>

      <Typography className={styles.headerText}>
        Let’s Get You Signed In!
      </Typography>
      <div id={styles.bg}>
        <div className={styles["tab-container"]}>
          {/* Tab Buttons */}

          {/* Tab Content */}
          <div className={styles["tab-content"]}>
            {errorMessage && (
              <div className={styles["error-message"]}>{errorMessage}</div>
            )}
            <div>
              <Typography
                style={{
                  color: "#999999",
                }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                inputProps={{
                  maxLength: 32,
                }}
                disabled={isLoading} // Add this line
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #D9D9D9",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: '"Baloo 2", serif',
                    fontSize: "16px",
                    fontWeight: "300",
                    color: "#000",
                  },
                }}
              />
              <Typography
                style={{
                  color: "#999999",
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                type={showPassword ? "text" : "password"}
                disabled={isLoading} // Add this line
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #D9D9D9",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: '"Baloo 2", serif',
                    fontSize: "16px",
                    fontWeight: "300",
                    color: "#000",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={styles["visibility-toggle"]}
                        aria-label="toggle password visibility"
                        disabled={isLoading} // Add this line
                      >
                        <img
                          src={
                            showPassword
                              ? "/assets/LoginAssets/hide-pass.png"
                              : "/assets/LoginAssets/show-pass.png"
                          }
                          alt={showPassword ? "Hide password" : "Show password"}
                          className={styles["visibility-icon"]}
                        />
                      </button>
                    </InputAdornment>
                  ),
                }}
              />
              <button
                className={styles["req-otp-button"]}
                style={{
                  background: !isLoading
                    ? "linear-gradient(180deg, #00CB60 0%, #009135 100%)"
                    : "#D9D9D9",
                  cursor: !isLoading ? "pointer" : "not-allowed",
                }}
                disabled={isLoading}
                onClick={handleLogin}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    style={{ color: "#ffffff", marginTop: ".5rem" }}
                  />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["pagcor-container"]}>
        <img
          className={styles["pagcor-terms"]}
          src="/assets/LoginAssets/PAGCOR.png"
          alt="PAGCOR.png"
        />
      </div>
      <TermsModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
