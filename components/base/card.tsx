import commonStyle from '@/style/common';
import {
  cn,
  extendVariants,
  Card as HCard,
  CardBody as HCardBody,
  CardFooter as HCardFooter,
  CardHeader as HCardHeader,
} from '@heroui/react';
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
export { Card, CardBody, CardFooter, CardHeader };
