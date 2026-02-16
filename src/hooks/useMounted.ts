import { useState, useEffect } from "react";

/**
 * Hook to detect if component is mounted on the client
 * Useful for guarding client-only APIs and preventing hydration mismatches
 */
export function useMounted() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted;
}
