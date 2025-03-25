import { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        px-4 py-2 rounded-lg border border-neutral bg-input text-text
        placeholder-neutral
        focus:outline-none focus:ring-2 focus:ring-secondary transition
        ${className}
      `}
      {...props}
    />
  );
}
