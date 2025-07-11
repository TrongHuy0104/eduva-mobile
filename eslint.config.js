const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = defineConfig([
    ...expoConfig,
    {
        ignores: ['dist/*', 'node_modules/*'],
        plugins: {
            'react-native': reactNativePlugin,
        },
        rules: {
            // React Native plugin rules
            'react-native/no-inline-styles': 'off',
            'react-native/no-unused-styles': 'warn',
            'react-native/split-platform-components': 'warn',
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
    },
]);
