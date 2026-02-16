"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ReviewModeContextType {
    isReviewMode: boolean;
    toggleReviewMode: () => void;
}

const ReviewModeContext = createContext<ReviewModeContextType | undefined>(undefined);

export function ReviewModeProvider({ children }: { children: React.ReactNode }) {
    const [isReviewMode, setIsReviewMode] = useState(false);

    // Persist preference
    useEffect(() => {
        const saved = localStorage.getItem("reviewMode");
        if (saved) setIsReviewMode(JSON.parse(saved));
    }, []);

    const toggleReviewMode = () => {
        const newValue = !isReviewMode;
        setIsReviewMode(newValue);
        localStorage.setItem("reviewMode", JSON.stringify(newValue));
    };

    return (
        <ReviewModeContext.Provider value={{ isReviewMode, toggleReviewMode }}>
            {children}
        </ReviewModeContext.Provider>
    );
}

export function useReviewMode() {
    const context = useContext(ReviewModeContext);
    if (context === undefined) {
        throw new Error("useReviewMode must be used within a ReviewModeProvider");
    }
    return context;
}
