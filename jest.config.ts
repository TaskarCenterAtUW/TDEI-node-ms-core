import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset:'ts-jest',
    testEnvironment: 'node',
    collectCoverage:true,
    // testMatch: ['**/+(*.)+(unit|test).+(ts|js)?(x)'],
    // collectCoverageFrom: ['./src/**/*.{ts,js}','./lib/**/*.{ts,js}'],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    }

  };
};