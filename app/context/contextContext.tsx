import React, { createContext, useContext, useState, ReactNode } from 'react';

type ContentContextType = {
    content: string;
    setContent: (content: string) => void;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode })=> {
    const [content, setContent] = useState('Dashboard');

    return (
        <ContentContext.Provider value={{ content, setContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
