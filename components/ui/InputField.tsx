import * as React from "react";
import { cn } from "../../lib/utils.ts";
import { useI18n } from "../../store/i18n.tsx";
import BilingualText from "./BilingualText.tsx";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, id, label, ...props }, ref) => {
    const { isRTL } = useI18n();
    return (
      <div>
        <label htmlFor={id}>
          <BilingualText
            role="Caption"
            className="!text-slate-700 dark:!text-white/80 mb-1 block"
          >
            {label}
          </BilingualText>
        </label>
        <input
          id={id}
          type={type}
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "flex h-11 w-full rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 px-3 py-2 text-slate-900 dark:text-white ring-offset-background file:border-0 file:bg-transparent placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputField.displayName = "InputField";

export default InputField;
