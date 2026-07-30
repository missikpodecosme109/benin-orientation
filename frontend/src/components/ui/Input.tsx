import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erreurs?: string[];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, erreurs, id, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 ${
            erreurs?.length
              ? "border-red-400 focus:border-red-500"
              : "border-border-strong focus:border-brand-500"
          } ${className}`}
          {...props}
        />
        {erreurs?.map((msg) => (
          <p key={msg} className="mt-1 text-xs text-red-600">
            {msg}
          </p>
        ))}
      </div>
    );
  }
);
Input.displayName = "Input";
