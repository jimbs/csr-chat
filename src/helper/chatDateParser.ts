export const formatMessageDate = (
  dateStr: string,
  config: { [prop: string]: Boolean } = {
    time_context: true,
    date: true,
    time: false,
  }
): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time part for accurate date comparison
  const date = new Date(dateStr);
  const compareDate = new Date(dateStr);

  [today, yesterday, compareDate].forEach((d) => {
    d.setHours(0, 0, 0, 0);
  });
  const dateToString = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  let toReturn = "";

  if (compareDate.getTime() === today.getTime() && config.time_context)
    toReturn +=   "TODAY "

  if (compareDate.getTime() === yesterday.getTime() && config.time_context)
    toReturn +=   "YESTERDAY "

  if(config.date)
    toReturn += dateToString;

  if(config.time)
    toReturn += ` ${formatMessageTime(dateStr)}`;

  return toReturn;
};

export const formatMessageTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`.padStart(8, "0");
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getAMonthRangeOfDate = (dateStr: string = new Date().toISOString()) => {
  const date = new Date(dateStr);
  const currentDate = new Date(date);
  const previousMonth = new Date(date.setMonth(date.getMonth() - 1));
  
  const fromYear = previousMonth.getFullYear();
  const fromMonth = String(previousMonth.getMonth() + 1).padStart(2, "0");
  const fromDay = String(previousMonth.getDate()).padStart(2, "0");
  
  const toYear = currentDate.getFullYear();
  const toMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const toDay = String(currentDate.getDate()).padStart(2, "0");

  return {
    from: `${fromYear}-${fromMonth}-${fromDay} 00:00:00`,
    to: `${toYear}-${toMonth}-${toDay} 23:59:59`
  };
};

export const isDateEqual = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};
