import clsx from "clsx";
export default function Badge({ label, className }) {
  return (
    <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full border", className)}>
      {label}
    </span>
  );
}
