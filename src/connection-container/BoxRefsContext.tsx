import React, { createContext, useContext, useRef, useCallback, PropsWithChildren } from "react";

interface BoxRefs {
    leftRef: React.RefObject<HTMLDivElement>;
    rightRef: React.RefObject<HTMLDivElement>;
}

interface BoxRefsContextType {
    registerRef: (id: string, refs: BoxRefs) => void;
    getRef: (id: string) => BoxRefs | undefined;
    refs: React.MutableRefObject<Record<string, BoxRefs>>;
}

const BoxRefsContext = createContext<BoxRefsContextType | null>(null);

export const BoxRefsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const refsMap = useRef<Record<string, BoxRefs>>({});

    const registerRef = useCallback((id: string, refs: BoxRefs) => {
        refsMap.current[id] = refs;
    }, []);

    const getRef = useCallback((id: string) => {
        return refsMap.current[id];
    }, []);

    return <BoxRefsContext.Provider value={{ registerRef, getRef, refs: refsMap }}>{children}</BoxRefsContext.Provider>;
};

export const useBoxRefs = () => {
    const context = useContext(BoxRefsContext);
    if (!context) {
        throw new Error("useBoxRefs must be used within a BoxRefsProvider");
    }
    return context;
};
