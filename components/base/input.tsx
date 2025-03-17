import {extendVariants, Input as HInput} from "@heroui/react";
import commonStyle from  "@/style/common";

const Input = extendVariants(HInput, {
  variants: {
    variant: {
      dark: {
        inputWrapper: [
          commonStyle.border,
          "bg-white/[0.05]",
          "focus-within:border-white/30",
          "rounded-[8px]",
        ],
        input: [
          "text-white",
          "placeholder:text-white/50",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "dark",
    size: "md",
  },
});

export default Input;