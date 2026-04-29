import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.ComponentProps<"input"> & {
  /**
   * Larger font size so native password bullets/discs scale up (they follow computed font-size).
   * Required when toggling `type` between `password` and `text`; otherwise hidden mode loses sizing.
   */
  passwordSized?: boolean
}

function Input({ className, type, passwordSized, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        passwordSized &&
          "h-12! min-h-12! py-2.5! text-2xl! leading-normal! md:text-2xl! [&::-ms-clear]:hidden [&::-ms-reveal]:hidden",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
