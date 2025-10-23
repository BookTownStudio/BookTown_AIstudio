
import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';

export type FontSize = 'sm' | 'md' | 'lg';
export type FontStyle = 'default' | 'dyslexic';

interface ReadingPreferencesContextType {
    fontSize: FontSize;
    fontStyle: FontStyle;
    setFontSize: (size: FontSize) => void;
    setFontStyle: (style: FontStyle) => void;
}

const ReadingPreferencesContext = createContext<ReadingPreferencesContextType | undefined>(undefined);

interface ReadingPreferencesProviderProps {
    children: ReactNode;
}

export const ReadingPreferencesProvider: React.FC<ReadingPreferencesProviderProps> = ({ children }) => {
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        return (localStorage.getItem('booktown-fontsize') as FontSize) || 'md';
    });
    const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
        return (localStorage.getItem('booktown-fontstyle') as FontStyle) || 'default';
    });

    useEffect(() => {
        localStorage.setItem('booktown-fontsize', fontSize);
    }, [fontSize]);
    
    useEffect(() => {
        localStorage.setItem('booktown-fontstyle', fontStyle);
        // In a real app, you would add a class to the body or root to apply the font style globally
        // e.g. document.body.classList.toggle('font-dyslexic', style === 'dyslexic');
    }, [fontStyle]);

    const value = useMemo(() => ({ 
        fontSize, 
        fontStyle,
        setFontSize,
        setFontStyle
    }), [fontSize, fontStyle]);

    return (
        <ReadingPreferencesContext.Provider value={value}>
            {children}
        </ReadingPreferencesContext.Provider>
    );
};

export const useReadingPreferences = (): ReadingPreferencesContextType => {
    const context = useContext(ReadingPreferencesContext);
    if (context === undefined) {
        throw new Error('useReadingPreferences must be used within a ReadingPreferencesProvider');
    }
    return context;
};
