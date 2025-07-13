import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { User } from '@/types/models/user.model';
import { getItem, removeItem, setItem } from '../utils/storage';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isSignout: boolean;
    // login: (userData: User, tokens: AuthTokens) => Promise<void>;
    login: (tokens: AuthTokens) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    updateCurrentUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSignout, setIsSignout] = useState<boolean>(false);

    // Load user from storage on app start
    const loadUser = useCallback(async () => {
        try {
            const userData = await getItem('user');
            const accessToken = await getItem('accessToken');

            if (userData && accessToken) {
                setUser(JSON.parse(userData));
                setIsSignout(false);
            } else {
                setIsSignout(true);
            }
        } catch (error) {
            console.error('Failed to load user', error);
            setIsSignout(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Login function
    const login = useCallback(async (tokens: AuthTokens) => {
        console.log('tokens', tokens);

        try {
            await setItem('accessToken', tokens.accessToken);
            await setItem('refreshToken', tokens.refreshToken);

            setIsSignout(false);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await removeItem('accessToken');
            await removeItem('refreshToken');
            await removeItem('user');

            setUser(null);
            setIsSignout(true);
        } catch (error) {
            console.error('Logout failed', error);
        }
    }, []);

    // Update user
    const updateCurrentUser = useCallback(async (userData: User) => {
        try {
            await setItem('user', JSON.stringify(userData));

            setUser(userData);
        } catch (error) {
            console.error('update user failed', error);
            throw error;
        }
    }, []);

    // Check auth state on mount
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const value: AuthContextType = {
        user,
        isLoading,
        isSignout,
        login,
        logout,
        loadUser,
        updateCurrentUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
