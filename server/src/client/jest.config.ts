export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
        '~/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['./jest.setup.ts']
};
