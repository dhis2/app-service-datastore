const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    parser: "@typescript-eslint/parser",
    plugins: ['react-hooks'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
}
