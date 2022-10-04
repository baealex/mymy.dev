import type { Config } from 'jest'

export default {
    preset: 'ts-jest',
    moduleNameMapper: {
        '~/(.*)$': '<rootDir>/src/$1'
    },
    testPathIgnorePatterns: ['/src/client/', '/dist/'],
} as Config
