import './index.css';
import { ConnectionContainer } from './connection-container';
import Box from "./box"

export { Box, ConnectionContainer };

export type ConnectionContainerProps = {
    connections: Connection[];
    onConnectionAdded?: (fromId: string, toId: string) => void;
    onClickLink?: (fromId: string, toId: string) => void;
    displayMode?: boolean;
};

export interface Point {
    id: string;
    position: "left" | "right";
}

export interface Connection {
    from: Point;
    to: Point | { x: number; y: number };
}
