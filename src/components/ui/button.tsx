import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-gradient-primary transition ${className}`}
      {...props}
    />
  );
}
