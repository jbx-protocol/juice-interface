// Mock for multiformats CID functionality
// Used in tests to avoid ES module import issues

module.exports = {
  CID: {
    parse: jest.fn((cidString) => {
      // Simple mock that handles the conversion logic used in ipfs.ts
      const isV0 = cidString.startsWith('Qm')
      const isV1 = cidString.startsWith('baf')
      
      return {
        toV1: jest.fn(() => ({
          toString: jest.fn(() => {
            // Mock v0 to v1 conversion
            // Real conversion is complex, but for tests we just need consistent output
            if (isV0) {
              // Convert Qm... to bafybei... (mock conversion)
              return 'bafybei' + cidString.slice(2).toLowerCase()
            }
            // Already v1, return as-is
            return cidString
          })
        })),
        toString: jest.fn(() => cidString),
        version: isV0 ? 0 : 1
      }
    })
  }
}