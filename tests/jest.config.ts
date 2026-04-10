import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/public/(.*)$': '<rootDir>/public/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/index.{ts,tsx}',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.{ts,tsx}',
        '<rootDir>/src/**/*.test.{ts,tsx}',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json',
        }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}

export default createJestConfig(config)