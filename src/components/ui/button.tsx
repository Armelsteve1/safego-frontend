import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-semibold text-white
        bg-[linear-gradient(90deg,_#5de0e6,_#004aad)]
        hover:opacity-90 transition
        ${className}
      `}
      {...props}
    />
  );
}
