import dotenv from 'dotenv';
import { VitePluginNode } from 'vite-plugin-node';
dotenv.config();

const config = () => {
    return {
        server: {
            port: process.env.PORT,
        },
        plugins: [
            ...VitePluginNode({
                adapter: 'express',
                appPath: './src/app.ts',
                exportName: 'viteNodeApp',
                tsCompiler: 'esbuild',
                swcOptions: {},
            }),
        ],
        optimizeDeps: {},
    };
};

export default config;