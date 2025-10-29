import { build, defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const componentDir = path.resolve(rootDir, 'src', 'components');

const entries: Record<string, string> = {};
fs.readdirSync(componentDir).forEach((file) => {
    if (file.includes('WC.tsx')) {
        const entryPath = path.join(componentDir, file);
        if (fs.existsSync(entryPath)) {
            const relativePath = path.relative(path.resolve(rootDir, 'src'), entryPath);
            // Add the file to the entries object, converting .tsx to .js in the output
            entries[relativePath.replace(/\.tsx$/, '.js')] = entryPath;
        }
    }
});

const componentBuild = defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext',
        outDir: path.resolve(rootDir, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: entries,
            preserveEntrySignatures: 'strict',
            output: {
                preserveModules: true,
                preserveModulesRoot: path.resolve(rootDir, 'src'),
                format: 'es',
                entryFileNames: '[name].js',
                chunkFileNames: 'shared/[name]-[hash].js',
                assetFileNames: '[name][extname]'
            }
        }
    }
});

async function runBuilds() {
    console.log('🔧 Building individual components...');
    await build(componentBuild);
    console.log('📦 Building bundled file...');
}

runBuilds().catch((err) => {
    console.error(err);
    process.exit(1);
});
