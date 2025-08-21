# Hope & Failure Backend Test Suite

This comprehensive test suite ensures the reliability and stability of the PostgreSQL database integration and API endpoints.

## Test Structure

```
tests/
├── setup.js              # Global test configuration and helpers
├── unit/                  # Unit tests for individual components
│   ├── database.test.js   # Database connection and query tests
│   └── models.test.js     # Data model CRUD operation tests
├── api/                   # API endpoint tests
│   └── endpoints.test.js  # HTTP endpoint functionality tests
└── integration/           # End-to-end integration tests
    └── system.test.js     # Complete system workflow tests
```

## Test Categories

### 1. Database Tests (`tests/unit/database.test.js`)

-   **Connection Tests**: Verify database connectivity and health
-   **Schema Tests**: Ensure all tables exist and are accessible
-   **Performance Tests**: Check query response times and connection pooling
-   **Stress Tests**: Validate system behavior under concurrent load

### 2. Model Tests (`tests/unit/models.test.js`)

-   **CRUD Operations**: Test Create, Read, Update, Delete for all models
-   **Data Validation**: Ensure proper data handling and constraints
-   **Edge Cases**: Test boundary conditions and error scenarios
-   **Business Logic**: Verify model-specific logic (inventory decrements, etc.)

### 3. API Tests (`tests/api/endpoints.test.js`)

-   **Endpoint Functionality**: Test all API routes and methods
-   **Authentication**: Verify admin password protection
-   **Input Validation**: Test request validation and error handling
-   **Response Format**: Ensure consistent API response structure

### 4. Integration Tests (`tests/integration/system.test.js`)

-   **E-commerce Flows**: Complete purchase workflows
-   **Content Management**: Full admin CRUD workflows
-   **Data Consistency**: Multi-operation consistency checks
-   **System Recovery**: Error handling and stability tests

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Specific Test Categories

```bash
# Database tests only
npm run test:db

# API tests only
npm run test:api
```

### Individual Test Files

```bash
# Database connection tests
npx jest tests/unit/database.test.js

# Model tests
npx jest tests/unit/models.test.js

# API endpoint tests
npx jest tests/api/endpoints.test.js

# Integration tests
npx jest tests/integration/system.test.js
```

## Test Data Management

### Automatic Cleanup

-   Tests automatically clean up test data after each test
-   Test data is marked with "TEST" prefixes for easy identification
-   No interference with production data

### Test Helpers

The test suite includes helper functions for common operations:

```javascript
// Create test data
await global.testHelpers.createTestInventory();
await global.testHelpers.createTestEvent();
await global.testHelpers.createTestVideo();
await global.testHelpers.createTestLyrics();

// Clean up test data
await global.testHelpers.cleanupTestData();

// Utility functions
await global.testHelpers.wait(1000); // Wait 1 second
```

## Environment Configuration

Tests run in a separate test environment:

-   `NODE_ENV=test`
-   Uses the same database as development (with cleanup)
-   Reduced logging verbosity
-   Extended timeouts for database operations

## Test Coverage Goals

The test suite aims for comprehensive coverage:

-   **Database Layer**: 100% of database operations
-   **Model Layer**: 100% of CRUD operations and business logic
-   **API Layer**: 100% of endpoints and error scenarios
-   **Integration**: All critical user workflows

## Monitoring and Alerts

### Performance Benchmarks

Tests include performance assertions:

-   Database queries: < 2 seconds for complex operations
-   API responses: < 5 seconds for all endpoints
-   System load: Handle 15+ concurrent operations

### Error Detection

Tests catch common issues:

-   Database connection failures
-   Memory leaks in connection pooling
-   Race conditions in concurrent operations
-   Data consistency problems

## Adding New Tests

### For New Models

1. Add model tests to `tests/unit/models.test.js`
2. Add API tests to `tests/api/endpoints.test.js`
3. Add integration workflows to `tests/integration/system.test.js`

### For New Features

1. Create unit tests for the feature logic
2. Add API tests for new endpoints
3. Include the feature in integration workflows
4. Update test helpers if needed

### Test Naming Convention

-   Use descriptive test names: `should handle inventory decrement on purchase`
-   Group related tests in `describe` blocks
-   Use consistent patterns across test files

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

    ```
    Solution: Ensure Supabase database is accessible and .env is configured
    ```

2. **Test Timeouts**

    ```
    Solution: Increase timeout in jest.config.js or add await statements
    ```

3. **Port Conflicts**

    ```
    Solution: Ensure no other servers are running on port 3000
    ```

4. **Test Data Conflicts**
    ```
    Solution: Run cleanup manually: await global.testHelpers.cleanupTestData()
    ```

### Debug Mode

Run tests with debug output:

```bash
DEBUG=true npm test
```

### Verbose Logging

```bash
npm test -- --verbose
```

## Continuous Integration

This test suite is designed for CI/CD pipelines:

-   Fast execution (< 2 minutes for full suite)
-   Reliable cleanup and isolation
-   Clear pass/fail indicators
-   Detailed error reporting

## Security Considerations

-   Tests use the same admin password as development
-   Test data is clearly marked and cleaned up
-   No sensitive data is logged during tests
-   Database operations are isolated per test
