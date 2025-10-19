import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/80 focus:ring-primary",
        ghost:
          "bg-transparent text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 focus:ring-primary dark:focus:ring-accent",
      },
      size: {
        default: "min-h-[44px] px-4 py-2",
        icon: "min-h-[44px] min-w-[44px] p-2 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface OriginalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "icon";
}

const Button: React.FC<OriginalButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const isIconVariant = variant === "icon";
  const cvaVariant = isIconVariant ? "ghost" : variant;
  const cvaSize = isIconVariant ? "icon" : "default";

  return (
    <button
      className={cn(
        buttonVariants({ variant: cvaVariant, size: cvaSize, className })
      )}
      {...props}
    />
  );
};

export default Button;
