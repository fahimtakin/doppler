import { useEffect, useState } from "react";
import { formatTime } from "../utils/format";

/** Returns a human label for the active sleep timer, ticking every second. */
export function useSleepCountdown(sleep) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!sleep.endsAt) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [sleep.endsAt]);

  if (sleep.endOfTrack) return "Stopping after this song";
  if (sleep.endsAt) {
    const remaining = Math.max(0, Math.ceil((sleep.endsAt - now) / 1000));
    return `Sleep timer · ${formatTime(remaining)} left`;
  }
  return null;
}
