import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ['react', 'lucide-react'],
  onSuccess: async () => {
    // Prepend 'use client' directive to the built output
    const { readFileSync, writeFileSync } = await import('fs');
    const path = 'dist/index.js';
    const content = readFileSync(path, 'utf8');
    writeFileSync(path, `"use client";\n${content}`);
  },
});
