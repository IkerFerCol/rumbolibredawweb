import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem("rl_preferences");
        return saved
            ? JSON.parse(saved)
            : {
                theme: "light",
                currency: "EUR",
                language: "es",
            };
    });

    useEffect(() => {
        const root = document.documentElement;

        if (preferences.theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("rl_preferences", JSON.stringify(preferences));
        
        console.log("🌓 Tema aplicado:", preferences.theme, "| HTML classes:", root.className);
    }, [preferences]);

    const updatePreference = (key, value) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <SettingsContext.Provider value={{ preferences, updatePreference }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);