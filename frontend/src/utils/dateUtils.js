import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from "date-fns";
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d))    return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d, yyyy");
};
export const isOverdue = (date) => date && isPast(new Date(date));
export const fromNow   = (date) => date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";
