import Cookies from "js-cookie";
import * as _ from "lodash";
import addCookie from "./CookieService";
import { storeLocalData } from "./Backend/storeLocalData";
// import { useAuthStore } from "../store/useAuthStore";
// import usePinStore from "../pages/AccountSetting/WalletPIN/usePinStore";

const generateToken = async () => {
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        //@ts-ignore
        username: import.meta.env.VITE_TOKEN_USERNAME,
        //@ts-ignore
        password: import.meta.env.VITE_TOKEN_PASSWORD,
      },
    }),
  };

  const url = "/api/generate-token";

  return await fetch(url, payload)
    .then((response) => response.json())
    .then((data) => {
      return data.data.token;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const apiCall = async (payload, token?) => {
  try {
    const url = `${
      //@ts-ignore
      import.meta.env[`VITE_API_URL`]
    }/api/apiservice`;
    console.log(url)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) storeLocalData(result.data?.token, result.data?.user_details, result.data?.device_session);
    } else {
      result = {
        status_code: response.status,
        message: "No JSON response body",
      };
    }

    // Debugging: Log full API response
    // console.log("API Response:", result);

    return result;
  } catch (error) {
    console.error("Error:", error);
    //alert("Something went wrong. Please try again later.");
  }
};

export const apiCallLocal = async (payload, endpoint, token?) => {
  try {
    const authToken =
      localStorage.getItem("auth_token") || (await generateToken());
    //@ts-ignore
    const url = `/api/${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: { ...payload.data.data } }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
      if (authToken) storeLocalData(authToken, result.data?.user_details, result.data?.device_session);
    } else {
      result = {
        status_code: response.status,
        message: "No JSON response body",
      };
    }

    // Debugging: Log full API response
    // console.log("API Response:", result);

    return result;
  } catch (error) {
    console.error("Error:", error);
    //alert("Something went wrong. Please try again later.");
  }
};
