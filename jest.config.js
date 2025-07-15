module.exports = {
  rootDir: './src/',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  verbose: true,
  setupFilesAfterEnv: ['../jest.setup.ts'],
  testEnvironment: 'jsdom',
  // Map uuid to use CommonJS version in tests
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
}
