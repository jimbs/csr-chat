export const formatMessageDate = (dateStr: string): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time part for accurate date comparison
  const date = new Date(dateStr);
  const compareDate = new Date(dateStr);
  [today, yesterday, compareDate].forEach((d) => {
    d.setHours(0, 0, 0, 0);
  });

  if (compareDate.getTime() === today.getTime()) {
    return (
      "TODAY " +
      date
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase()
    );
  }

  if (compareDate.getTime() === yesterday.getTime()) {
    return (
      "YESTERDAY " +
      date
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase()
    );
  }

  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

export const formatMessageTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`.padStart(8, "0");
};

export const getCurrentDateTime = () =>{
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const isDateEqual = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};
