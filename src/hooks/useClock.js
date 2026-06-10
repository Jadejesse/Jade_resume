import { useEffect, useState } from 'react';

// Matches the original site's format exactly: "Mon 1 Dec" and "12:15 PM".
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function format(now) {
  const date = `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return { date, time: `${hours}:${minutesStr} ${ampm}` };
}

export function useClock() {
  const [value, setValue] = useState(() => format(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => setValue(format(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return value;
}
