import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface SearchResult {
    material: any;
    folder: any;
}

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchResults: SearchResult[];
    setSearchResults: (results: SearchResult[]) => void;
    isSearchActive: boolean;
    setIsSearchActive: (active: boolean) => void;
    clearSearch: () => void;
    currentSearchIndex: number;
    setCurrentSearchIndex: (index: number) => void;
    prevClassId: string | undefined;
    setPrevClassId: (id: string | undefined) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [prevClassId, setPrevClassId] = useState<string | undefined>(undefined);
    const [searchTerm, _setSearchTerm] = useState('');
    const [searchResults, _setSearchResults] = useState<SearchResult[]>([]);
    const [isSearchActive, _setIsSearchActive] = useState(false);
    const [currentSearchIndex, _setCurrentSearchIndex] = useState(-1);

    // Debug setters
    const setSearchTerm = (term: string) => {
        _setSearchTerm(term);
    };
    const setSearchResults = (results: SearchResult[]) => {
        _setSearchResults(results);
    };
    const setIsSearchActive = (active: boolean) => {
        _setIsSearchActive(active);
    };
    const setCurrentSearchIndex = (index: number) => {
        _setCurrentSearchIndex(index);
    };

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchActive(false);
        setCurrentSearchIndex(-1);
    }, []);

    const memoizedSetSearchResults = useCallback((results: SearchResult[]) => {
        setSearchResults(results);
    }, []);

    const memoizedSetIsSearchActive = useCallback((active: boolean) => {
        setIsSearchActive(active);
    }, []);

    const memoizedSetCurrentSearchIndex = useCallback((index: number) => {
        setCurrentSearchIndex(index);
    }, []);

    return (
        <SearchContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                searchResults,
                setSearchResults: memoizedSetSearchResults,
                isSearchActive,
                setIsSearchActive: memoizedSetIsSearchActive,
                clearSearch,
                currentSearchIndex,
                setCurrentSearchIndex: memoizedSetCurrentSearchIndex,
                prevClassId,
                setPrevClassId,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
