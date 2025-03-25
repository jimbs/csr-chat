import Cookies from "js-cookie";

export const storeLocalData = (token: string, userData: any) => {
  // Store token in localStorage
  localStorage.setItem("auth_token", token);

  // Store user data in localStorage
  localStorage.setItem("user_data", JSON.stringify(userData));
  
  // Store user_id in localStorage
  localStorage.setItem("user_id", userData.id);
  
  // Store token in cookies with 7 days expiration
  Cookies.set("auth_token", token, { expires: 7 });
};

export const clearLocalData = () => {
  // Remove token from localStorage
  localStorage.removeItem("auth_token");

  // Remove user data from localStorage
  localStorage.removeItem("user_data");
  
  // Remove user_id from localStorage
  localStorage.removeItem("user_id");
  
  // Remove token from cookies
  Cookies.remove("auth_token");
};

export const checkCredentials = () => {
  // Check if token exists in localStorage or cookies
  const localStorageToken = localStorage.getItem("auth_token");
  const cookieToken = Cookies.get("auth_token");

  // Check if user data exists in localStorage
  const userData = localStorage.getItem("user_data");

  // Check if user_id exists in localStorage
  const userId = localStorage.getItem("user_id");

  return !!(localStorageToken || cookieToken || userData || userId);
};
