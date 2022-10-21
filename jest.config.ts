import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset:'ts-jest',
    testEnvironment: 'node',
    // testMatch: ['./src/**/+(*.)+.(test|unit).+(ts|js)?(x)'],
    collectCoverageFrom: ['./src/**/*.{ts,js}'],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    }

  };
};