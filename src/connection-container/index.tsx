import { PropsWithChildren } from "react";
import ConnectionContainerInner from "../components/ConnectionContainerInner";
import { ConnectionsProvider } from "./ConnectionsContext";
import { BoxRefsProvider } from "./BoxRefsContext";
import { ConnectionContainerProps } from "..";

export const ConnectionContainer: React.FC<PropsWithChildren<ConnectionContainerProps>> = ({
    children,
    connections,
    onConnectionAdded,
    onClickLink,
    displayMode
}) => {
    return (
        <BoxRefsProvider>
            <ConnectionsProvider displayMode={displayMode} connections={connections}>
                <ConnectionContainerInner onConnectionAdded={onConnectionAdded} onClickLink={onClickLink}>
                    {children}
                </ConnectionContainerInner>
            </ConnectionsProvider>
        </BoxRefsProvider>
    );
};

