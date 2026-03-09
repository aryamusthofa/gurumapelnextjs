"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { NotifProvider } from "./Notif";

export default function Providers({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NotifProvider>{children}</NotifProvider>
        </ThemeProvider>
    );
}
