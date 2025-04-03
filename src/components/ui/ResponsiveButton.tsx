import { ButtonHTMLAttributes } from "react";

export function ResponsiveButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`
        w-full sm:w-auto
        px-6 py-3 rounded-full font-semibold text-white text-sm sm:text-base
        flex items-center justify-center gap-2
        bg-[linear-gradient(90deg,_#5de0e6,_#004aad)]
        transition
        ${className}
      `}
      {...props}
    />
  );
}
