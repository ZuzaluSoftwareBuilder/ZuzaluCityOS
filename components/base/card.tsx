import {extendVariants, Card as HCard, CardBody as HCardBody, CardFooter as HCardFooter,    cn, CardHeader as HCardHeader } from "@heroui/react";
import commonStyle from "@/style/common";
const Card = extendVariants(HCard, {
    variants: {
        card: {
            default: {
                base: cn("border-1 border-white/[0.1]", "bg-white/[0.02] shadow-none")
            }
        }   
    },
    defaultVariants: {
        card: "default",
    },
}) 
const CardHeader = extendVariants(HCardHeader, {})
const CardBody = extendVariants(HCardBody, {})
const CardFooter = extendVariants(HCardFooter, {})
export {Card, CardHeader, CardBody, CardFooter}