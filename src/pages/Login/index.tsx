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
          endpoint: "login",
          data: {
            login_type: "password",
            mobile_number: "09050000001", // Replace with the actual phone number
            username: phoneNumber,
            password: password,
          },
        },
      };

      const loginResult = await apiCallLocal(payload, payload.data.endpoint);
      // const loginResult = await apiCall(payload);

      if (loginResult && loginResult.status_code === 200) {
        navigate("/");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-background"]}>
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
