class CookieService {
  /**
   * Retrieve the value of a cookie by its name.
   * @param name - The name of the cookie.
   * @returns A promise that resolves with the cookie value or null if not found.
   */
  async getCookie(name: string): Promise<string | null> {
    return new Promise((resolve) => {
      // Encode cookie name for comparison
      const nameEQ = encodeURIComponent(name) + "=";
      // Split document.cookie into individual cookies
      const cookies = document.cookie.split(";");

      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        // Check if the cookie starts with the desired name
        if (trimmedCookie.startsWith(nameEQ)) {
          // Extract and decode the cookie value
          resolve(decodeURIComponent(trimmedCookie.substring(nameEQ.length)));
          return;
        }
      }
      // Resolve null if the cookie is not found
      resolve(null);
    });
  }

  /**
   * Set a cookie with the given name and value.
   * @param name - The name of the cookie.
   * @param value - The value of the cookie.
   * @param expiresInHours - Number of hours until the cookie expires (default is 1 hour).
   */
  async addCookie(
    name: string,
    value: string,
    expiresInHours: number = 1
  ): Promise<void> {
    const expires = this.getExpiresString(expiresInHours);
    // Encode the cookie name and value
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);
    // Set the cookie
    document.cookie = `${encodedName}=${encodedValue}${expires}; path=/`;
  }

  /**
   * Delete a cookie by its name.
   * @param name - The name of the cookie to delete.
   */
  async destroyCookie(name: string): Promise<void> {
    // Encode the cookie name and set expiration date to the past
    const encodedName = encodeURIComponent(name);
    document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }

  /**
   * Generate the expiration string for a cookie.
   * @param hours - Number of hours until the cookie expires.
   * @returns The expiration string for the cookie.
   */
  private getExpiresString(hours: number): string {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return "; expires=" + date.toUTCString();
  }
}

export default CookieService;
