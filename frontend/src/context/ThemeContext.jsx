
import { createContext, useContext, useEffect, useState } from "react";

//creating the context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    // State to manage the dark mode status, initialized to false
    const [darkMode, setDarkMode] = useState(false);


    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            const parsedMode = JSON.parse(savedMode);
            setDarkMode(parsedMode);
        }
    }, [])

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        })

    }

    return (
        <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useDarkMode = () => useContext(ThemeContext);