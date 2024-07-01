import React, { createContext, useContext, useState, useCallback } from 'react';

interface Point {
  id: string;
  position: 'left' | 'right';
}

interface Connection {
  from: Point;
  to: Point | { x: number; y: number };
}

interface ConnectionsContextType {
  connections: Connection[];
  currentConnection: Connection | null;
  selectedConnection: number | null;
  setCurrentConnection: (connection: Connection | null) => void;
  addConnection: (connection: Connection) => void;
  selectConnection: (index: number | null) => void;
  removeConnection: (index: number) => void;
}

const ConnectionsContext = createContext<ConnectionsContextType | null>(null);

export const ConnectionsProvider: React.FC = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const addConnection = useCallback((connection: Connection) => {
    setConnections((prev) => [...prev, connection]);
  }, []);

  const removeConnection = useCallback((index: number) => {
    setConnections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        currentConnection,
        selectedConnection,
        setCurrentConnection,
        addConnection,
        selectConnection: setSelectedConnection,
        removeConnection,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }
  return context;
};
