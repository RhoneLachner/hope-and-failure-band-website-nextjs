module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test file patterns
    testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],

    // Coverage settings
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/generated/**',
        '!src/server.js', // Exclude main server file from coverage
    ],

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Module path mapping
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Test timeout (important for database operations)
    testTimeout: 30000,

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Force exit after tests complete
    forceExit: true,

    // Detect open handles (useful for database connections)
    detectOpenHandles: true,
};
