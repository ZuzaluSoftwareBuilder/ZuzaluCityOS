import {
  extendVariants,
  Card as HCard,
  CardBody as HCardBody,
  CardFooter as HCardFooter,
  cn,
  CardHeader as HCardHeader,
} from '@heroui/react';
import commonStyle from '@/style/common';
const Card = extendVariants(HCard, {
  variants: {
    card: {
      default: {
        base: cn(
          commonStyle.border,
          'bg-white/[0.02] shadow-none',
          'rounded-[10px]',
        ),
      },
    },
  },
  defaultVariants: {
    card: 'default',
  },
});
const CardHeader = extendVariants(HCardHeader, {});
const CardBody = extendVariants(HCardBody, {});
const CardFooter = extendVariants(HCardFooter, {});
export { Card, CardHeader, CardBody, CardFooter };
