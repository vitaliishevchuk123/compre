// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite on web ships a SQLite-WASM worker; Metro must treat .wasm as an
// asset so it bundles instead of trying to resolve it as a module. (No effect
// on native iOS/Android, which use the built-in SQLite.)
config.resolver.assetExts.push('wasm');

module.exports = config;
