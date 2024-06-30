// store.ts
import { create } from 'zustand';

interface Point {
  id: string;
  position: 'left' | 'right';
}

interface Connection {
  from: Point;
  to: Point;
}

interface CanvasState {
  connections: Connection[];
  currentConnection: { from: Point; to: { x: number; y: number } } | null;
  selectedConnection: number | null; // index of the selected connection
  setCurrentConnection: (
    connection: { from: Point; to: { x: number; y: number } } | null,
  ) => void;
  addConnection: (connection: Connection) => void;
  selectConnection: (index: number | null) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  connections: [],
  currentConnection: null,
  selectedConnection: null,
  setCurrentConnection: (connection) => set({ currentConnection: connection }),
  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),
  selectConnection: (index) => {
    if (index !== null) {
      console.log(index);
      get().connections.splice(index, 1);
    }
    set({ selectedConnection: index });
  },
}));
