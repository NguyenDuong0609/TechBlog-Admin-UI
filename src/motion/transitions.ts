import { Transition } from "framer-motion";

export const transition: Transition = {
    duration: 0.2, // Short duration (120-200ms recommended)
    ease: "easeOut",
};

export const spring: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
};

export const layoutTransition: Transition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
};
