import { Variants } from "framer-motion";
import { transition } from "./transitions";

export { transition };

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition },
    exit: { opacity: 0, transition },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition },
    exit: { opacity: 0, y: 10, transition },
};

export const slideInLeft: Variants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition },
    exit: { x: -20, opacity: 0, transition },
};

export const slideInRight: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition },
    exit: { x: 20, opacity: 0, transition },
};

export const scaleIn: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition },
    exit: { scale: 0.95, opacity: 0, transition },
};

export const listItem: Variants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0, transition },
    exit: { opacity: 0, x: -10, transition },
};

export const containerVariants: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export const sidebarVariants: Variants = {
    expanded: { width: 256, transition }, // 16rem = 256px
    collapsed: { width: 80, transition }, // 5rem = 80px
};

export const menuTextVariants: Variants = {
    expanded: { opacity: 1, width: "auto", display: "block", transition },
    collapsed: { opacity: 0, width: 0, display: "none", transition },
};
