import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Lightweight Select components that mirror Shadcn's API but work    */
/* without full Radix primitives – keeps bundle small and avoids      */
/* complex peer-dependency issues.                                    */
/* ------------------------------------------------------------------ */

const SelectContext = React.createContext();

function Select({ children, onValueChange, value, multiple, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(value ?? "");
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (val) => {
    setSelected(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, selected, handleSelect }}>
      <div ref={ref} className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen, selected } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white",
        className
      )}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { selected } = React.useContext(SelectContext);
  return <span className={selected ? "" : "text-gray-400"}>{selected || placeholder}</span>;
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

function SelectItem({ className, value, children, ...props }) {
  const { handleSelect, selected } = React.useContext(SelectContext);
  return (
    <div
      role="option"
      aria-selected={selected === value}
      onClick={() => handleSelect(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-indigo-50 dark:hover:bg-gray-700",
        selected === value && "bg-indigo-100 dark:bg-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
