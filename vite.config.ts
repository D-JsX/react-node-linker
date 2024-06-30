import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({ insertTypesEntry: true }),
	],
	build: {
		lib: {
			entry: {
				'forms': path.resolve(__dirname, 'src/forms/'),
				'': path.resolve(__dirname, 'src/index.ts'),
			},
			name: 'react-node-linker',
			formats: [ 'es', 'cjs' ],
			fileName: (format, entryName) => `${ entryName ? entryName + '/' : '' }react-node-linker.${ format }.js`,
		},
		rollupOptions: {
			external: [ 'react', 'react-dom' ],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
});