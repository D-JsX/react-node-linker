import React, { PropsWithChildren } from 'react';
import { BoxRefsProvider } from './BoxRefsContext';
import { ConnectionsProvider } from './ConnectionsContext';
import ConnectionContainerInner from '../components/ConnectionContainerInner';

const ConnectionContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <BoxRefsProvider>
      <ConnectionsProvider>
        <ConnectionContainerInner>{children}</ConnectionContainerInner>
      </ConnectionsProvider>
    </BoxRefsProvider>
  );
};

export default ConnectionContainer;
