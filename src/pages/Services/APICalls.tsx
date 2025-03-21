import Cookies from "js-cookie";
import * as _ from "lodash";
// import { useAuthStore } from "../store/useAuthStore";
// import usePinStore from "../pages/AccountSetting/WalletPIN/usePinStore";

export const apiCall = async (payload, token?) => {
  try {
    const authToken = token || localStorage.getItem("auth_token");
    //@ts-ignore
    const url = `${import.meta.env.VITE_API_URL}/api/apiservice`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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

// export const login = async (payload) => {
//   try {
//     const url = `${import.meta.env.VITE_API_URL}/api/apiservice`;
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const contentType = response.headers.get("content-type");
//     let result;
//     console.log(response);

//     if (contentType && contentType.includes("application/json")) {
//       result = await response.json();
//     } else {
//       result = {
//         status_code: response.status,
//         message: "No JSON response body",
//       };
//     }

//     // Debugging: Log full API response
//     console.log("API Response:", result);

//     // Ensure token exists before setting it
//     if (result.status_code === 200 && result.data && result.data.token) {
//       Cookies.set("token", result.data.token, { expires: 7 });
//       console.log("Token stored in cookies:", Cookies.get("token"));

//       // ✅ Store user_id, username, and other details in localStorage
//       const loginType = _.get(payload, "data.data.login_type", "otp");
//       const userDetails = _.get(
//         result,
//         loginType == "otp" ? "data" : "data.user_details"
//       );

//       localStorage.setItem("user_id", _.get(userDetails, "id"));
//       localStorage.setItem("username", _.get(userDetails, "last_name", ""));
//       localStorage.setItem("auth_token", _.get(result, "data.token", null));
//       localStorage.setItem("user", JSON.stringify(userDetails));

//       usePinStore.getState().setActualPin(_.get(userDetails, "pin"));

//       useAuthStore.getState().setUserData({
//         id: _.get(userDetails, "id"),
//         first_name: _.get(userDetails, "first_name"),
//         last_name: _.get(userDetails, "last_name"),
//         birth_date: _.get(userDetails, "birth_date"),
//         mobile_number: _.get(userDetails, "mobile_number"),
//         site_location: _.get(userDetails, "site_location"),
//         valid_id: _.get(userDetails, "valid_id", ""),
//       });
//       return true;
//     } else {
//       alert(result.message || "Login failed. Please try again.");
//       return false;
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     //alert("Something went wrong. Please try again later.");
//   }
// };
// export const checklogin = async (payload) => {
//   try {
//     const url = `${import.meta.env.VITE_API_URL}/api/apiservice`;
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });
//     console.log(response);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const contentType = response.headers.get("content-type");
//     let result;

//     if (contentType && contentType.includes("application/json")) {
//       result = await response.json();
//     } else {
//       result = {
//         status_code: response.status,
//         message: "No JSON response body",
//       };
//     }

//     // Debugging: Log full API response
//     console.log("API Response:", result);

//     // Ensure token exists before setting it
//     if (result.status_code === 200 && result.data && result.data.token) {
//       Cookies.set("token", result.data.token, { expires: 7 });
//       console.log("Token stored in cookies:", Cookies.get("token"));

//       // ✅ Store user_id, username, and other details in localStorage
//       const loginType = _.get(payload, "data.data.login_type", "otp");
//       const userDetails = _.get(
//         result,
//         loginType == "otp" ? "data" : "data.user_details"
//       );

//       localStorage.setItem("user_id", _.get(userDetails, "id"));
//       localStorage.setItem("username", _.get(userDetails, "last_name", ""));
//       localStorage.setItem("auth_token", _.get(result, "data.token", null));
//       localStorage.setItem('user', JSON.stringify(userDetails));

//       useAuthStore.getState().setUserData({
//         id: result.data.id,
//         first_name: result.data.first_name,
//         last_name: result.data.last_name,
//         birth_date: result.data.birth_date,
//         mobile_number: result.data.mobile_number,
//         site_location: result.data.site_location,
//         valid_id: result.data.id,
//       });
//       return result;
//     } else {
//       alert(result.message || "Login failed. Please try again.");
//       throw result.message;
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     //alert("Something went wrong. Please try again later.");
//     throw error;
//   }
// };
