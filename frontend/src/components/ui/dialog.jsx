import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Lightweight Dialog / Modal                                          */
/* ------------------------------------------------------------------ */

function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      {/* Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {children}
      </div>
    </>
  );
}

function DialogContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-in fade-in-0 zoom-in-95",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex justify-end gap-2 mt-6", className)}
      {...props}
    />
  );
}

function DialogClose({ children, asChild, ...props }) {
  // Just renders its child – close logic handled by onOpenChange
  if (asChild) return children;
  return <button {...props}>{children}</button>;
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose };
