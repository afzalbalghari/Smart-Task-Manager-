import clsx from "clsx";
import Loader from "./Loader";

export default function Button({ children, loading, variant = "primary", className, ...props }) {
  const variants = {
    primary: "btn-primary",
    ghost:   "btn-ghost",
    danger:  "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-4 py-2 rounded-lg transition-all duration-200",
  };
  return (
    <button
      className={clsx(variants[variant], "flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", className)}
      disabled={loading}
      {...props}
    >
      {loading && <Loader />}
      {children}
    </button>
  );
}
