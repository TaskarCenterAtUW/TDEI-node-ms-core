import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset:'ts-jest',
    testEnvironment: 'node',
    collectCoverage:true,
    // testMatch: ['**/+(*.)+(unit|test).+(ts|js)?(x)'],
    // collectCoverageFrom: ['./src/**/*.{ts,js}','./lib/**/*.{ts,js}'],
    testMatch: ["**/test/?(*.)+(unit|integration).[tj]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    testPathIgnorePatterns: ["/node_modules/", "/lib/", "/src/test.ts"],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest'
    },
    reporters: [
      "default",
      ["./node_modules/jest-html-reporter", {
        "pageTitle": "Test Report",
        "includeFailureMsg": true
      }]
    ]

  };
};
