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

export function Login() {
  const [userInfo, setUserInfo] = useState({});

  const [isTabContainerVisible, setTabContainerVisible] = useState(true);

  const [isOTPContainerVisible, setOTPContainerVisible] = useState(false);

  const [activeTab, setActiveTab] = useState(1);

  const [OtpTimer, setOtpTimer] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");

  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // Initialize otp as an array of empty strings

  const inputRefs = useRef<HTMLInputElement[]>([]); // Define inputRefs as an array of HTMLInputElement

  const userServices = new UserService();
  const { user, setUser } = UserData();
  useEffect(() => {
    console.log(user);
  }, [user]);

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

  const handleTermsChange = (e) => {
    setModalOpen(true);
    setIsTermsChecked(e.target.checked);
  };

  const handleRequestOTP = async () => {
    const login = await userServices.login({
      mobileNumber: "+63" + phoneNumber,
    });
    if (login) {
      const { error_code, message, token, user: userData } = login;
      if (error_code == 200) {
        setUserInfo(userData);

        const request_otp = await userServices.requestOTP({ id: userData.id });
        if (request_otp) {
          console.log(request_otp);
        }
        setTabContainerVisible(false);
        setOTPContainerVisible(true);
      } else {
        alert("Mobile number not registered");
      }
    }
  };
  const handleVerifyOTP = async () => {
    const { id } = userInfo as { id: number };
    const verify_otp = await userServices.verifyOTP({ id, otp: otp.join("") });
    if (verify_otp) {
      const { error_code } = verify_otp;
      if (error_code == 200) {
        setUser(userInfo);
        navigate("/");
      }
    }
  };
  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const isButtonEnabled =
    activeTab === 1
      ? phoneNumber.length === 10 && isTermsChecked
      : phoneNumber.length === 10 && isTermsChecked && password.length >= 8;

  return (
    <div className={styles["login-background"]}>
      <div className={styles["login-navbar"]}>
        <button onClick={handleBack} className={styles["back-button"]}>
          <ArrowBackIosNewIcon sx={{ color: "white" }} />
          <Typography className={styles.signInText}>Sign In</Typography>
        </button>
        <img
          className={styles["secure-navbar"]}
          src="/assets/LoginAssets/Secure-login.png"
          alt=""
        />
      </div>
      <Typography className={styles.headerText}>
        Let’s Get You Signed In!
      </Typography>
      <div id={styles.bg}>
        {isTabContainerVisible && (
          <div className={styles["tab-container"]}>
            {/* Tab Buttons */}
            <div className={styles["tab-buttons"]}>
              <button
                id={styles.tabButton}
                className={activeTab === 1 ? styles["active-tab"] : ""}
                onClick={() => setActiveTab(1)}
              >
                Phone
              </button>
              <div className={styles["vertical-line"]}></div>
              <button
                id={styles.tabButton}
                className={activeTab === 2 ? styles["active-tab"] : ""}
                onClick={() => setActiveTab(2)}
              >
                Password
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles["tab-content"]}>
              {activeTab === 1 && (
                <div>
                  <Typography
                    className={styles.numberInfo}
                    sx={{
                      fontSize: "13px",
                      color: "#5B5B5B",
                      marginBottom: "0.5rem",
                    }}
                  >
                    We’ll send a code to your mobile number
                  </Typography>
                  <TextField
                    fullWidth
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              color: "#000",
                              fontSize: "16px",
                              marginRight: "-8px",
                              fontFamily: '"Baloo 2", serif',
                              fontWeight: "300",
                            }}
                          >
                            +63
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
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
                  <button
                    className={styles["req-otp-button"]}
                    onClick={handleRequestOTP}
                    style={{
                      background: isButtonEnabled
                        ? "linear-gradient(180deg, #00CB60 0%, #009135 100%)"
                        : "#D9D9D9",
                      cursor: isButtonEnabled ? "pointer" : "not-allowed",
                    }}
                    disabled={!isButtonEnabled}
                  >
                    Request OTP
                  </button>
                  <p className={styles["dont-have-acc"]}>
                    Don’t have an account?{" "}
                    <a className={styles["reg-hyper"]} href="/register">
                      Sign up
                    </a>
                  </p>
                  <p className={styles["trouble-signing"]}>
                    Trouble signing in?
                  </p>
                  <div className={styles["email-karera-container"]}>
                    <p className={styles["email-karera"]}>
                      Email us at support@karera.live
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <Typography
                    className={styles.numberInfo}
                    sx={{
                      fontSize: "13px",
                      color: "#5B5B5B",
                      marginBottom: "0.5rem",
                    }}
                  >
                    We’ll send a code to your mobile number
                  </Typography>
                  <TextField
                    fullWidth
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              color: "#000",
                              fontSize: "16px",
                              marginRight: "-8px",
                              fontFamily: '"Baloo 2", serif',
                              fontWeight: "300",
                            }}
                          >
                            +63
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
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
                  <TextField
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    type={showPassword ? "text" : "password"}
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
                          >
                            <img
                              src={
                                showPassword
                                  ? "/assets/LoginAssets/hide-pass.png"
                                  : "/assets/LoginAssets/show-pass.png"
                              }
                              alt={
                                showPassword ? "Hide password" : "Show password"
                              }
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
                      background: isButtonEnabled
                        ? "linear-gradient(180deg, #00CB60 0%, #009135 100%)"
                        : "#D9D9D9",
                      cursor: isButtonEnabled ? "pointer" : "not-allowed",
                    }}
                    disabled={!isButtonEnabled}
                  >
                    Request OTP
                  </button>
                  <p className={styles["dont-have-acc"]}>
                    Don’t have an account?{" "}
                    <a className={styles["reg-hyper"]} href="/register">
                      Sign up
                    </a>
                  </p>
                  <p className={styles["trouble-signing"]}>
                    Trouble signing in?
                  </p>
                  <div className={styles["email-karera-container"]}>
                    <p className={styles["email-karera"]}>
                      Email us at support@karera.live
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles["terms-container"]}>
              <div className={styles["check-box-container"]}>
                <input
                  className={styles["check-box"]}
                  type="checkbox"
                  id="agree-checkbox"
                  onChange={handleTermsChange}
                />
              </div>
              <div className={styles["p-container"]}>
                <label htmlFor="agree-checkbox">
                  I agree to the{" "}
                  <a href="/terms" target="_blank">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>
          </div>
        )}
        {isOTPContainerVisible && (
          <div className={styles["OTP-container"]}>
            <p className={styles["enter-otp-text"]}>Enter One-Time-Pin (OTP)</p>
            <p className={styles["please-enter-text"]}>
              Please enter 6-digit code sent to {phoneNumber}
            </p>
            <div className={styles["OTP-field-container"]}>
              {otp.map((value, index) => (
                <TextField
                  key={index}
                  className={styles["OTP-field"]}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputRef={(el) => (inputRefs.current[index] = el)} // Assign ref to each field
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "#E9E9E9",
                      height: "39px",
                      width: "39px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Removes the outline border
                    },
                    "& .MuiOutlinedInput-input": {
                      fontFamily: '"Baloo 2", serif',
                      fontWeight: 400,
                      fontSize: "24px",
                      textAlign: "center", // Center text inside the field
                      caretColor: "transparent", // Hides the blinking cursor
                    },
                  }}
                  inputProps={{
                    maxLength: 1, // Allow only one character per input field
                  }}
                />
              ))}
            </div>
            <button
              className={styles["verify-button"]}
              onClick={handleVerifyOTP}
              style={{
                background: isButtonEnabled
                  ? "linear-gradient(180deg, #00CB60 0%, #009135 100%)"
                  : "#D9D9D9",
                cursor: isButtonEnabled ? "pointer" : "not-allowed",
              }}
              disabled={!isButtonEnabled}
            >
              Verify
            </button>
            <button
              className={styles["res-otp-button"]}
              style={{
                background: isButtonEnabled
                  ? "linear-gradient(180deg, #00CB60 0%, #009135 100%)"
                  : "#D9D9D9",
                cursor: isButtonEnabled ? "pointer" : "not-allowed",
              }}
              disabled={!isButtonEnabled}
            >
              Resend OTP
            </button>
            <div className={styles["bottom-deets-container"]}>
              <p className={styles["resend-timer-text"]}>
                Resend Code in 00:59s
              </p>
              <p className={styles["change-no-text"]}>Change Mobile Number</p>
            </div>
          </div>
        )}
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
