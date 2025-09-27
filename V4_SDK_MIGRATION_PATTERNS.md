# V4 SDK Migration Patterns

## Overview
Migration guide for upgrading juice-interface v4 code to use latest juice-sdk-react (5.0.1) and juice-sdk-core (2.1.0).

## Key Breaking Changes
1. All auto-generated hooks (`useRead*`, `useWrite*`) have been removed
2. ABIs moved from `juice-sdk-react` to `juice-sdk-core`
3. Contract addresses now accessed via `jbContractAddress` object
4. JBProjectProvider requires `version` and `bendystraw` props

## Import Changes

### ABIs (now from juice-sdk-core)
```typescript
// OLD
import { jbControllerAbi } from 'juice-sdk-react'

// NEW
import { jbControllerAbi } from 'juice-sdk-core'
```

Common ABIs:
- `jbMultiTerminalAbi`
- `jbControllerAbi`
- `jbController4_1Abi`
- `jbDirectoryAbi`
- `jbTokensAbi`
- `jbSplitsAbi`
- `jbProjectsAbi`
- `jb721TiersHookAbi`
- `jb721TiersHookStoreAbi`
- `jb721TiersHookProjectDeployerAbi`
- `jbTerminalStoreAbi`
- `jbFundAccessLimitsAbi`
- `jbPermissionsAbi`
- `jbRulesetsAbi`

### Contract Enums (from juice-sdk-core)
```typescript
import { JBCoreContracts, JB721HookContracts, JBOmnichainDeployerContracts } from 'juice-sdk-core'
```

## Read Contract Patterns

### Pattern 1: Inside JBProjectProvider (has access to context)
```typescript
// OLD
import { useReadJbMultiTerminalFee } from 'juice-sdk-react'
const { data } = useReadJbMultiTerminalFee()

// NEW
import { useJBContractContext } from 'juice-sdk-react'
import { jbMultiTerminalAbi, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'

const { contractAddress } = useJBContractContext()
const { data } = useReadContract({
  abi: jbMultiTerminalAbi,
  address: contractAddress(JBCoreContracts.JBMultiTerminal),
  functionName: 'FEE', // Note: Check ABI for exact casing
})
```

### Pattern 2: Outside JBProjectProvider (no context access)
```typescript
// OLD
import { jbProjectDeploymentAddresses } from 'juice-sdk-core'
const address = jbProjectDeploymentAddresses.JBController4_1[chainId]

// NEW
import { jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
const address = jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]
```

### Pattern 3: Direct Contract Reads (async)
```typescript
// OLD
import { readJb721TiersHookStoreTiersOf } from 'juice-sdk-core'
const tiers = await readJb721TiersHookStoreTiersOf(config, { ... })

// NEW
import { readContract } from 'wagmi/actions'
import { jb721TiersHookStoreAbi } from 'juice-sdk-core'

const tiers = await readContract(config, {
  abi: jb721TiersHookStoreAbi,
  address: dataSourceAddress,
  functionName: 'tiersOf',
  args: [...],
  chainId
})
```

## Write Contract Patterns

### Pattern 1: Standard Write
```typescript
// OLD
import { useWriteJbMultiTerminalPay } from 'juice-sdk-react'
const { writeAsync } = useWriteJbMultiTerminalPay()
await writeAsync({ args: [...], value: amount })

// NEW
import { useWriteContract } from 'wagmi'
import { jbMultiTerminalAbi } from 'juice-sdk-core'

const { writeContractAsync } = useWriteContract()
await writeContractAsync({
  address: terminalAddress,
  abi: jbMultiTerminalAbi,
  functionName: 'pay',
  args: [...],
  value: amount,
  chainId
})
```

### Pattern 2: Write with Contract Context
```typescript
// OLD
const { writeAsync } = useWriteJbControllerSetUriOf()
await writeAsync({ address: controller, args })

// NEW
const { writeContractAsync } = useWriteContract()
await writeContractAsync({
  address: contracts.controller.data,
  abi: jbControllerAbi,
  functionName: 'setUriOf',
  args,
  chainId
})
```

## Provider Updates

### JBProjectProvider Props
```typescript
// OLD
<JBProjectProvider
  chainId={chainId}
  projectId={projectId}
  ctxProps={{ ... }}
>

// NEW
<JBProjectProvider
  chainId={chainId}
  projectId={projectId}
  version={4}  // Required: specify version as number
  bendystraw={{ apiKey: '' }}  // Required: bendystraw config
  ctxProps={{ ... }}
>
```

## Common Hook Replacements

| Old Hook | Contract | Function Name |
|----------|----------|---------------|
| `useReadJbMultiTerminalFee` | JBMultiTerminal | `FEE` |
| `useReadJbTokensTotalBalanceOf` | JBTokens | `totalBalanceOf` |
| `useReadJbTokensCreditBalanceOf` | JBTokens | `creditBalanceOf` |
| `useReadJbTokensTokenOf` | JBTokens | `tokenOf` |
| `useReadJbControllerPendingReservedTokenBalanceOf` | JBController | `pendingReservedTokenBalanceOf` |
| `useReadJbDirectoryControllerOf` | JBDirectory | `controllerOf` |
| `useReadJbDirectoryPrimaryTerminalOf` | JBDirectory | `primaryTerminalOf` |
| `useReadJbSplitsSplitsOf` | JBSplits | `splitsOf` |
| `useReadJbProjectsOwnerOf` | JBProjects | `ownerOf` |
| `useWriteJbMultiTerminalPay` | JBMultiTerminal | `pay` |
| `useWriteJbMultiTerminalCashOutTokensOf` | JBMultiTerminal | `cashOutTokensOf` |
| `useWriteJbControllerMintTokensOf` | JBController | `mintTokensOf` |
| `useWriteJbControllerClaimTokensFor` | JBController | `claimTokensFor` |

## Migration Checklist

1. ✅ Update imports - move ABIs from `juice-sdk-react` to `juice-sdk-core`
2. ✅ Replace deprecated read hooks with `useReadContract`
3. ✅ Replace deprecated write hooks with `useWriteContract`
4. ✅ Update contract address access patterns
5. ✅ Add required props to JBProjectProvider
6. ✅ Handle type issues with explicit typing where needed
7. ✅ Test critical user flows after migration

## Notes

- Function names in ABIs are case-sensitive (e.g., `FEE` not `fee`)
- Always include `chainId` in read/write operations
- For cross-chain operations, ensure correct chain-specific addresses
- Some complex types may need explicit `any` typing in select functions
- When in doubt, check the ABI for exact function signatures

## Error Resolution

### Common Errors and Fixes

1. **"Module has no exported member"** - Move import from `juice-sdk-react` to `juice-sdk-core`
2. **"Type 'string' is not assignable to type 'JBVersion'"** - Use `version={4}` not `version="4"`
3. **"Object literal may only specify known properties"** - Check bendystraw config: `{ apiKey: '' }`
4. **Undefined chainId** - Add null check or default: `chainId ?? 1`