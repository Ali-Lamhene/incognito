const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const zustandPath = path.resolve(__dirname, 'node_modules/zustand');

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Force zustand to use CJS versions on all platforms to avoid import.meta issue
    if (moduleName === 'zustand') {
        return {
            type: 'sourceFile',
            filePath: path.join(zustandPath, 'index.js'),
        };
    }
    if (moduleName === 'zustand/middleware') {
        return {
            type: 'sourceFile',
            filePath: path.join(zustandPath, 'middleware.js'),
        };
    }

    // Standard resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
