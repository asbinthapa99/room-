import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200 text-gray-700",
        brand: "bg-brand-50 border border-brand-200 text-brand-700",
        green: "bg-emerald-50 border border-emerald-200 text-emerald-700",
        amber: "bg-amber-50 border border-amber-200 text-amber-700",
        destructive: "bg-red-50 border border-red-200 text-red-700",
        dark: "bg-gray-900 text-white border-0",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
