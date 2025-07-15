// Mock for juice-sdk-react ES module
module.exports = {
  useJBProjectId: jest.fn(() => ({
    data: 1n, // BigInt project ID
    isLoading: false,
    error: null
  })),
  useJBRuleset: jest.fn(() => ({
    data: {
      id: 1n,
      cycleNumber: 1n,
      weight: 1000000000000000000n,
      decayPercent: 0n,
      approvalHook: '0x0000000000000000000000000000000000000000',
      metadata: {
        reservedPercent: 0n,
        redemptionRate: 5000n,
        baseCurrency: 1n,
        pausePay: false,
        pauseDistributions: false,
        pauseRedeem: false,
        pauseBurn: false,
        allowMinting: false,
        allowTerminalMigration: false,
        allowSetTerminals: false,
        allowControllerMigration: false,
        allowSetController: false,
        holdFees: false,
        useTotalOverflowForRedemptions: false,
        useDataSourceForPay: false,
        useDataSourceForRedeem: false,
        dataSource: '0x0000000000000000000000000000000000000000',
        metadata: 0n
      },
      start: 1640995200n,
      duration: 604800n
    },
    isLoading: false,
    error: null
  }))
}