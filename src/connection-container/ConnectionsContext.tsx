import React, { PropsWithChildren, createContext, useContext, useState } from "react";
import { Connection } from "..";

interface ConnectionsContextType {
    connections: Connection[];
    currentConnection: Connection | null;
    selectedConnection: number | null;
    setCurrentConnection: (connection: Connection | null) => void;
    selectConnection: (index: number | null) => void;
    displayMode: boolean;
}

const ConnectionsContext = createContext<ConnectionsContextType | null>(null);

type ConnectionsProviderProps = {
    connections: Connection[];
    displayMode?: boolean;
};

export const ConnectionsProvider: React.FC<PropsWithChildren & ConnectionsProviderProps> = ({
    children,
    connections,
    displayMode = false
}) => {
    // const [connections, setConnections] = useState<Connection[]>(_connections || []);
    const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);
    const [selectedConnection, setSelectedConnection] = useState<number | null>(null);

    return (
        <ConnectionsContext.Provider
            value={{
                connections,
                currentConnection,
                selectedConnection,
                setCurrentConnection,
                selectConnection: setSelectedConnection,
                displayMode
            }}>
            {children}
        </ConnectionsContext.Provider>
    );
};

export const useConnections = () => {
    const context = useContext(ConnectionsContext);
    if (!context) {
        throw new Error("useConnections must be used within a ConnectionsProvider");
    }
    return context;
};
