import React from "react";

type ButtonColor =
  | "primary"
  | "primary-dark"
  | "success"
  | "info"
  | "warning"
  | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: "solid" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  size = "md",
  variant = "solid",
  className = "",
  disabled = false,
  ...props
}) => {
  // Color classes
  const colorClasses = {
    primary:
      variant === "solid"
        ? "bg-primary text-white hover:bg-primary/90"
        : "border-primary text-primary hover:bg-primary hover:text-white",
    "primary-dark":
      variant === "solid"
        ? "bg-primary-dark text-white hover:bg-primary-dark/90"
        : "border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white",
    success:
      variant === "solid"
        ? "bg-success text-white hover:bg-success/90"
        : "border-success text-success hover:bg-success hover:text-white",
    info:
      variant === "solid"
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    warning:
      variant === "solid"
        ? "bg-yellow-500 text-white hover:bg-yellow-600"
        : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
    danger:
      variant === "solid"
        ? "bg-red-500 text-white hover:bg-red-600"
        : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant specific classes
  const variantClasses = variant === "outline" ? "border-2 bg-transparent" : "";

  // Disabled classes
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const combinedClasses = [
    baseClasses,
    colorClasses[color],
    sizeClasses[size],
    variantClasses,
    disabledClasses,
    className,
  ].join(" ");

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
