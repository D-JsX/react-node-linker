# react-node-linker

## Description

`react-node-linker` is a React library that allows you to link items in a React application by automatically placing circles between each item. Users can also drag and drop to link the items.

## Installation

You can install this library via npm:

```bash
npm install react-node-linker
```

## Usage

Here is an example of how you can use `react-node-linker` in your React application:

```javascript
import React from 'react';
import { ConnectionContainer, Box } from 'react-node-linker';

const App = () => {
  return (
    <div style={{ margin: '3rem' }}>
      <ConnectionContainer>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <div>
            <Box id="box1">
              <div
                style={{
                  width: '200px',
                  height: '100px',
                  border: '1px solid black',
                }}
              >
                Box 1
              </div>
            </Box>
          </div>

          <Box id="box2">
            <div
              style={{
                width: '200px',
                height: '100px',
                border: '1px solid black',
              }}
            >
              Box 2
            </div>
          </Box>
        </div>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <Box id="box3">
            <div
              style={{
                width: '200px',
                height: '100px',
                border: '1px solid black',
              }}
            >
              Box 3
            </div>
          </Box>
          <Box id="box4">
            <div
              style={{
                width: '200px',
                height: '100px',
                border: '1px solid black',
              }}
            >
              Box 4
            </div>
          </Box>
        </div>
      </ConnectionContainer>
    </div>
  );
};

export default App;
```

## API

### `ConnectionContainer`

A container component that manages the linking of items. Wrap your items with this component.

#### Props

- None

### `Box`

A component representing an item that can be linked. Each `Box` should have a unique `id`.

#### Props

- `id` (string): A unique identifier for the box.

## Contributing

If you would like to contribute to this library, please feel free to submit a pull request or open an issue on GitHub.
