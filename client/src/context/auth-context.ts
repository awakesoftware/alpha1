import { createContext } from 'react';

interface AuthContextType {
    userId: string,
    userEmail: string,
    image: string,
    username: string,
    firstName: string,
    lastName: string,
    token,
    isLoggedIn: boolean, 
    isDarkMode: boolean,
    login (
        userId: string,
        email: string,
        image: string,
        username: string,
        firstName: string,
        lastName: string,
        token
    ): void,
    logout(): void
}

export const AuthContext = createContext<AuthContextType>({ 
    userId: null,
    userEmail: null,
    image: null,
    username: null,
    firstName: null,
    lastName: null,
    token: null,
    isLoggedIn: false, 
    isDarkMode: false,
    login: () => {}, 
    logout: () => {}
});