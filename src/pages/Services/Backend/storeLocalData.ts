import Cookies from "js-cookie";
import { apiCall } from "../APICalls";
import { c } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";

export const storeLocalData = (
  token: string,
  userData: any,
  sessionId: string
) => {
  if (!token && !userData && !sessionId) return;
  // console.log("storing data", token, userData, sessionId);
  // Store token in localStorage
  localStorage.setItem("auth_token", token);

  // Store user data in localStorage
  localStorage.setItem("user_data", JSON.stringify(userData));

  // Store user_id in localStorage
  localStorage.setItem("user_id", userData.id);

  localStorage.setItem("session_id", sessionId);

  // Store token in cookies with 7 days expiration
  Cookies.set("auth_token", token, { expires: 7 });
};

export const clearLocalData = () => {
  // Remove token from localStorage
  // console.log("clearing data");

  localStorage.removeItem("auth_token");

  // Remove user data from localStorage
  localStorage.removeItem("user_data");

  // Remove user_id from localStorage
  localStorage.removeItem("user_id");

  localStorage.removeItem("session_id");

  // Remove token from cookies
  Cookies.remove("auth_token");
};

export const checkCredentials = () => {
  // console.log("checking credentials");

  const localStorageToken = localStorage.getItem("auth_token");
  const session_id = Cookies.get("session_id");

  // Check if user data exists in localStorage
  const userData = localStorage.getItem("user_data");

  // Check if user_id exists in localStorage
  const userId = localStorage.getItem("user_id");

  return !!(localStorageToken || session_id || userData || userId);
};

export const isSessionStill = async () => {
  // Check if session_id exists in localStorage
  const sessionId = localStorage.getItem("session_id");
  const user_id = localStorage.getItem("user_id");

  // console.log(sessionId, user_id);
  if (!sessionId || !user_id) {
    return false;
  }

  const userData = await apiCall({
    data: {
      endpoint: "get-user-details",
      data: {
        user_id: parseInt(user_id),
      },
    },
  });

  return userData?.data.session_device === sessionId;
};
