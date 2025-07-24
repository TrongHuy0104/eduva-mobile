import { FoldersLessonMaterialsResponse } from '@/types/responses/folders-lesson-materials-response';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';

interface LessonDataContextType {
    folders: FoldersLessonMaterialsResponse[];
    setFolders: (folders: FoldersLessonMaterialsResponse[]) => void;
    clearFolders: () => void;
}

const LessonDataContext = createContext<LessonDataContextType | undefined>(
    undefined
);

export const LessonDataProvider = ({ children }: { children: ReactNode }) => {
    const [folders, setFoldersState] = useState<
        FoldersLessonMaterialsResponse[]
    >([]);

    const setFolders = useCallback(
        (folders: FoldersLessonMaterialsResponse[]) => {
            setFoldersState(folders);
        },
        []
    );

    const clearFolders = useCallback(() => {
        setFoldersState([]);
    }, []);

    return (
        <LessonDataContext.Provider
            value={{ folders, setFolders, clearFolders }}
        >
            {children}
        </LessonDataContext.Provider>
    );
};

export const useLessonData = () => {
    const context = useContext(LessonDataContext);
    if (!context) {
        throw new Error(
            'useLessonData must be used within a LessonDataProvider'
        );
    }
    return context;
};
