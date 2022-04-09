/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@stores/(.*)$': '<rootDir>/src/stores/$1'
    }
};