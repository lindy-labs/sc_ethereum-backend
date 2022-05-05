export const abi = [
  {
    inputs: [
      {
        internalType: 'contract IERC20Metadata',
        name: '_underlying',
        type: 'address',
      },
      { internalType: 'uint64', name: '_minLockPeriod', type: 'uint64' },
      { internalType: 'uint16', name: '_investPct', type: 'uint16' },
      { internalType: 'address', name: '_treasury', type: 'address' },
      { internalType: 'address', name: '_owner', type: 'address' },
      { internalType: 'uint16', name: '_perfFeePct', type: 'uint16' },
      {
        internalType: 'uint16',
        name: '_investmentFeeEstimatePct',
        type: 'uint16',
      },
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'address', name: 'pool', type: 'address' },
          { internalType: 'int128', name: 'tokenI', type: 'int128' },
          { internalType: 'int128', name: 'underlyingI', type: 'int128' },
        ],
        internalType: 'struct CurveSwapper.SwapPoolParam[]',
        name: '_swapPools',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'StrategyAmountZero', type: 'error' },
  { inputs: [], name: 'StrategyCallerNotManager', type: 'error' },
  { inputs: [], name: 'StrategyInvalidAUSTRate', type: 'error' },
  { inputs: [], name: 'StrategyNoAUSTReturned', type: 'error' },
  { inputs: [], name: 'StrategyNoUST', type: 'error' },
  { inputs: [], name: 'StrategyNotIVault', type: 'error' },
  { inputs: [], name: 'StrategyNotRunning', type: 'error' },
  { inputs: [], name: 'StrategyNothingRedeemed', type: 'error' },
  { inputs: [], name: 'StrategyOwnerCannotBe0Address', type: 'error' },
  { inputs: [], name: 'StrategyRouterCannotBe0Address', type: 'error' },
  { inputs: [], name: 'StrategyUnderlyingCannotBe0Address', type: 'error' },
  { inputs: [], name: 'StrategyYieldTokenCannotBe0Address', type: 'error' },
  { inputs: [], name: 'VaultAmountDoesNotMatchParams', type: 'error' },
  { inputs: [], name: 'VaultAmountLocked', type: 'error' },
  { inputs: [], name: 'VaultAmountTooLarge', type: 'error' },
  {
    inputs: [],
    name: 'VaultCannotComputeSharesWithoutPrincipal',
    type: 'error',
  },
  { inputs: [], name: 'VaultCannotDeposit0', type: 'error' },
  { inputs: [], name: 'VaultCannotDepositWhenYieldNegative', type: 'error' },
  { inputs: [], name: 'VaultCannotSponsor0', type: 'error' },
  { inputs: [], name: 'VaultCannotWithdrawMoreThanAvailable', type: 'error' },
  { inputs: [], name: 'VaultClaimPercentageCannotBe0', type: 'error' },
  { inputs: [], name: 'VaultClaimsDontAddUp', type: 'error' },
  { inputs: [], name: 'VaultDepositLocked', type: 'error' },
  { inputs: [], name: 'VaultDestinationCannotBe0Address', type: 'error' },
  { inputs: [], name: 'VaultInvalidInvestmentFee', type: 'error' },
  { inputs: [], name: 'VaultInvalidInvestpct', type: 'error' },
  { inputs: [], name: 'VaultInvalidLockPeriod', type: 'error' },
  { inputs: [], name: 'VaultInvalidMinLockPeriod', type: 'error' },
  { inputs: [], name: 'VaultInvalidPerformanceFee', type: 'error' },
  { inputs: [], name: 'VaultInvalidVault', type: 'error' },
  { inputs: [], name: 'VaultNoPerformanceFee', type: 'error' },
  { inputs: [], name: 'VaultNotAllowed', type: 'error' },
  { inputs: [], name: 'VaultNotDeposit', type: 'error' },
  { inputs: [], name: 'VaultNotEnoughFunds', type: 'error' },
  { inputs: [], name: 'VaultNotEnoughToRebalance', type: 'error' },
  { inputs: [], name: 'VaultNotOwnerOfDeposit', type: 'error' },
  { inputs: [], name: 'VaultNotSponsor', type: 'error' },
  { inputs: [], name: 'VaultNothingToDo', type: 'error' },
  { inputs: [], name: 'VaultOwnerCannotBe0Address', type: 'error' },
  { inputs: [], name: 'VaultStrategyHasInvestedFunds', type: 'error' },
  { inputs: [], name: 'VaultStrategyNotSet', type: 'error' },
  { inputs: [], name: 'VaultTreasuryCannotBe0Address', type: 'error' },
  { inputs: [], name: 'VaultUnderlyingCannotBe0Address', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      {
        indexed: false,
        internalType: 'int128',
        name: 'tokenI',
        type: 'int128',
      },
      {
        indexed: false,
        internalType: 'int128',
        name: 'underlyingI',
        type: 'int128',
      },
    ],
    name: 'CurveSwapPoolAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'CurveSwapPoolRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'claimerId',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'lockedUntil',
        type: 'uint64',
      },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
    ],
    name: 'DepositMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'burned', type: 'bool' },
    ],
    name: 'DepositWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Disinvested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'FeeWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'percentage',
        type: 'uint256',
      },
    ],
    name: 'InvestPctUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Invested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint16', name: 'pct', type: 'uint16' },
    ],
    name: 'InvestmentFeeEstimatePctUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint16', name: 'pct', type: 'uint16' },
    ],
    name: 'PerfFeePctUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lockedUntil',
        type: 'uint256',
      },
    ],
    name: 'Sponsored',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'strategy',
        type: 'address',
      },
    ],
    name: 'StrategyUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'fromToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fromAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'toAmount',
        type: 'uint256',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'treasury',
        type: 'address',
      },
    ],
    name: 'TreasuryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'Unsponsored',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'claimerId',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'burnedShares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'perfFee',
        type: 'uint256',
      },
    ],
    name: 'YieldClaimed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INVESTOR_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_DEPOSIT_LOCK_DURATION',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SPONSOR_LOCK_DURATION',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_SPONSOR_LOCK_DURATION',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SETTINGS_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SHARES_MULTIPLIER',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SLIPPAGE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SPONSOR_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'accumulatedPerfFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'address', name: 'pool', type: 'address' },
          { internalType: 'int128', name: 'tokenI', type: 'int128' },
          { internalType: 'int128', name: 'underlyingI', type: 'int128' },
        ],
        internalType: 'struct CurveSwapper.SwapPoolParam',
        name: '_param',
        type: 'tuple',
      },
    ],
    name: 'addPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_to', type: 'address' }],
    name: 'claimYield',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'claimer',
    outputs: [
      { internalType: 'uint256', name: 'totalPrincipal', type: 'uint256' },
      { internalType: 'uint256', name: 'totalShares', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'inputToken', type: 'address' },
          { internalType: 'uint64', name: 'lockDuration', type: 'uint64' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          {
            components: [
              { internalType: 'uint16', name: 'pct', type: 'uint16' },
              { internalType: 'address', name: 'beneficiary', type: 'address' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct IVault.ClaimParams[]',
            name: 'claims',
            type: 'tuple[]',
          },
          { internalType: 'string', name: 'name', type: 'string' },
        ],
        internalType: 'struct IVault.DepositParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'deposit',
    outputs: [
      { internalType: 'uint256[]', name: 'depositIds', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositors',
    outputs: [
      { internalType: 'contract Depositors', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'deposits',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'claimerId', type: 'address' },
      { internalType: 'uint256', name: 'lockedUntil', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256[]', name: '_ids', type: 'uint256[]' },
    ],
    name: 'forceWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnderlying',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'investPct',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'investState',
    outputs: [
      { internalType: 'uint256', name: 'maxInvestableAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'alreadyInvested', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'investmentFeeEstimatePct',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minLockPeriod',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256[]', name: '_ids', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
    ],
    name: 'partialWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'perfFeePct',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'claimerId', type: 'address' }],
    name: 'principalOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_inputToken', type: 'address' }],
    name: 'removePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_investPct', type: 'uint16' }],
    name: 'setInvestPct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: 'pct', type: 'uint16' }],
    name: 'setInvestmentFeeEstimatePct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_perfFeePct', type: 'uint16' }],
    name: 'setPerfFeePct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
    name: 'setStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_treasury', type: 'address' }],
    name: 'setTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'claimerId', type: 'address' }],
    name: 'sharesOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_inputToken', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_lockDuration', type: 'uint256' },
    ],
    name: 'sponsor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strategy',
    outputs: [
      { internalType: 'contract IStrategy', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'swappers',
    outputs: [
      { internalType: 'contract ICurve', name: 'pool', type: 'address' },
      { internalType: 'uint8', name: 'tokenDecimals', type: 'uint8' },
      { internalType: 'uint8', name: 'underlyingDecimals', type: 'uint8' },
      { internalType: 'int128', name: 'tokenI', type: 'int128' },
      { internalType: 'int128', name: 'underlyingI', type: 'int128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalPrincipal',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalShares',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSponsored',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalUnderlying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalUnderlyingMinusSponsored',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlying',
    outputs: [
      { internalType: 'contract IERC20Metadata', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256[]', name: '_ids', type: 'uint256[]' },
    ],
    name: 'unsponsor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateInvested',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256[]', name: '_ids', type: 'uint256[]' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawPerformanceFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_to', type: 'address' }],
    name: 'yieldFor',
    outputs: [
      { internalType: 'uint256', name: 'claimableYield', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'uint256', name: 'perfFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
