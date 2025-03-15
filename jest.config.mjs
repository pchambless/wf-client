export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { 
      rootMode: 'upward'  // This tells Babel to look up for config files
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageReporters: ['text', 'text-summary'],
  reporters: ['default'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime)/)'
  ]
};
