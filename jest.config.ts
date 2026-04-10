import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/public/(.*)$': '<rootDir>/public/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
        '^@/app/(.*)$': '<rootDir>/src/app/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/index.{ts,tsx}',
        '!src/app/api/**/*.{ts,tsx}',
        '!src/types/**/*.{ts,tsx}',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '<rootDir>/src/**/*.test.{ts,tsx}',
        '<rootDir>/tests/unit/**/*.test.{ts,tsx}',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: '<rootDir>/tsconfig.jest.json',
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(three|@react-three|@types/three)/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    verbose: true,
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/out/',
    ],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'test-results',
            outputName: 'junit.xml',
        }],
    ],
    snapshotSerializers: ['@emotion/jest/serializer'],
}

export default createJestConfig(config)