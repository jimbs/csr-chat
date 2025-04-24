export const isMessageImage = (message: string): boolean => {
  if (!message) return false;

  if (message.startsWith("data:image/")) return true;

  if (
    message.startsWith("http") &&
    (message.endsWith(".png") ||
      message.endsWith(".jpg") ||
      message.endsWith(".jpeg") ||
      message.endsWith(".gif"))
  )
    return true;

  if (message.length > 100 && /^[A-Za-z0-9+/=]+$/.test(message)) return true;

  const regex = /^T-2820250419075414\d+\.png$/;
  return regex.test(message.substring(message.lastIndexOf("/") + 1));
};
