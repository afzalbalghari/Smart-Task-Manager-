import { PRIORITY_COLORS, PRIORITY_LABELS } from "./constants";
export const getPriorityColor = (p) => PRIORITY_COLORS[p] || PRIORITY_COLORS.medium;
export const getPriorityLabel = (p) => PRIORITY_LABELS[p] || "Medium";
export const priorityOptions  = ["low", "medium", "high"];
