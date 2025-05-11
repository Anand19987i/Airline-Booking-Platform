import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    //State for store in user details
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children} {/* Render the children components */}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);