module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:jsdoc/recommended"
    ],
    plugins: ['jsdoc'],
    rules: {
        'jsdoc/require-property-description': 0,
        'jsdoc/require-description': 1,
        'jsdoc/require-param-description': 0,
        'jsdoc/require-returns-description': 0,
        '@typescript-eslint/no-explicit-any': 'off'
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
};
