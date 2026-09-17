/**
 * JWT Auth & Token Expiry Utilities
 */

/**
 * Checks whether a given JWT token is expired or invalid.
 * @param {string|null} token - JWT access token
 * @returns {boolean} - true if expired or invalid, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Decode JWT payload (base64url)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);

    if (!decoded.exp) return false;

    // Compare expiration timestamp (exp is in seconds, Date.now() is in ms)
    // Adding 5-second buffer to handle minor clock skew
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime + 5;
  } catch (err) {
    console.error("Error decoding token:", err);
    return true;
  }
};

/**
 * Clears all authentication data from localStorage.
 */
export const clearAuthSession = () => {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("adminId");
  localStorage.removeItem("role");
};

/**
 * Clears session and redirects to the login screen.
 */
export const handleUnauthorized = () => {
  clearAuthSession();
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};
