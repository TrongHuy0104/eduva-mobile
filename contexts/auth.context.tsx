import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { router } from 'expo-router';

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

let globalLogout: (() => Promise<void>) | null = null;
export const setGlobalLogout = (fn: () => Promise<void>) => {
    globalLogout = fn;
};
export const callGlobalLogout = async () => {
    if (globalLogout) await globalLogout();
};

// Global media pause registry - components can register a pause callback that will be
// invoked on logout to ensure audio/video are stopped immediately.
let globalMediaPauseFns: (() => Promise<void> | void)[] = [];
export const registerGlobalMediaPause = (
    fn: () => Promise<void> | void
): (() => void) => {
    globalMediaPauseFns.push(fn);
    return () => {
        globalMediaPauseFns = globalMediaPauseFns.filter((f) => f !== fn);
    };
};
export const callGlobalMediaPause = async () => {
    await Promise.all(
        globalMediaPauseFns.map(async (fn) => {
            try {
                await Promise.resolve(fn());
            } catch (e) {
                console.warn('Global media pause handler failed', e);
            }
        })
    );
};

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
            // First, pause any registered media to ensure playback stops immediately
            await callGlobalMediaPause();

            // navigate to a safe root route (replace to avoid keeping history)
            try {
                router.replace('/(tabs)/home');
            } catch {
                // ignore navigation errors
            }

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

    // Check for missing user or tokens and logout if any are missing
    useEffect(() => {
        if (!isLoading) {
            const checkAuth = async () => {
                const userData = await getItem('user');
                const accessToken = await getItem('accessToken');
                const refreshToken = await getItem('refreshToken');
                if (!userData || !accessToken || !refreshToken) {
                    await logout();
                }
            };
            checkAuth();
        }
    }, [isLoading, logout]);

    useEffect(() => {
        setGlobalLogout(logout);
    }, [logout]);

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
