/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    modularizeImports: {
        "react-icons/?(((\\w*)?/?)*)": {
            transform: "@react-icons/all-files/{{ matches.[1] }}/{{ member }}",
            skipDefaultConversion: true
        }
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                crypto: false,
            };
            // onnxruntime-web's ESM bundles (.mjs) use import.meta.url, which
            // Terser cannot minify. Alias to the CJS builds instead.
            // Using $ makes the main entry an exact match (not a prefix match)
            // so it doesn't accidentally intercept the /webgpu subpath import.
            config.resolve.alias = {
                ...config.resolve.alias,
                'onnxruntime-web$': path.resolve('./node_modules/onnxruntime-web/dist/ort.min.js'),
                'onnxruntime-web/webgpu': path.resolve('./node_modules/onnxruntime-web/dist/ort.webgpu.min.js'),
            };
        }
        // Prevent webpack from treating new URL("*.mjs", import.meta.url) inside
        // onnxruntime-web as static asset references — these would be emitted to
        // static/media/ as .mjs files and then fail Terser minification.
        config.module.rules.push({
            test: /node_modules[/\\]onnxruntime-web[/\\]dist[/\\].+\.mjs$/,
            parser: { url: false },
        });
        return config;
    },
}

module.exports = nextConfig
