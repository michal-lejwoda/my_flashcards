import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExerciseContextType {
    shouldCheckAll: boolean;
    triggerCheckAll: () => void;
    resetCheckAll: () => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExerciseContext must be used within ExerciseProvider');
    }
    return context;
};

interface ExerciseProviderProps {
    children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ children }) => {
    const [shouldCheckAll, setShouldCheckAll] = useState(false);

    const triggerCheckAll = () => {
        setShouldCheckAll(true);
    };

    const resetCheckAll = () => {
        setShouldCheckAll(false);
    };

    return (
        <ExerciseContext.Provider value={{
            shouldCheckAll,
            triggerCheckAll,
            resetCheckAll
        }}>
            {children}
        </ExerciseContext.Provider>
    );
};
