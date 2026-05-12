import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-600",
        secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
        link: "text-brand-600 underline-offset-4 hover:underline p-0 h-auto font-medium",
        inverse: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
        unstyled: "",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3 py-2 text-xs rounded-lg",
        small: "px-3 py-2 text-xs rounded-lg",
        lg: "px-7 py-3.5 text-base rounded-2xl",
        icon: "h-9 w-9 rounded-xl",
      },
      mode: {
        icon: "p-0 h-auto w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, mode, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, mode, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
