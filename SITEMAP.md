# Juice Interface Sitemap & Route Structure

## 🗺️ Route Hierarchy

### 🏠 Static Routes

```
/                           # Home page
├── /about                  # About page
├── /projects              # Projects discovery page
├── /activity              # Activity feed
├── /create                # Create new project
├── /contact               # Contact form
├── /legal                 # Legal information
├── /privacy               # Privacy policy
└── /experimental/flags    # Feature flags (experimental)
```

### 📖 Success Stories
```
/success-stories/
├── constitutiondao        # ConstitutionDAO case study
├── moondao               # MoonDAO case study
├── sharkdao              # SharkDAO case study
└── studiodao             # StudioDAO case study
```

### 👤 Account Routes
```
/account/
└── [addressOrEnsName]/    # Dynamic: User profile by address or ENS
    ├── (index)            # View profile
    └── edit               # Edit profile
```

### 🎯 Project Routes (by Handle)
```
/p/
└── [handle]/              # Dynamic: Project by handle
    ├── (index)            # Project dashboard
    └── safe/              # Safe (multi-sig) interface
```

### 📊 V2/V3 Project Routes
```
/v2/p/
└── [projectId]/           # Dynamic: V2/V3 project by ID
    ├── (index)            # Project dashboard
    ├── safe/              # Safe interface
    ├── contracts/         # Contract information
    └── settings/          # Settings dashboard
        └── [settingsPage] # Dynamic settings pages
```

### 🚀 V4 Project Routes
```
/v4/
└── [jbUrn]/              # Dynamic: V4 project URN format (chainId:projectId)
    ├── (index)           # Project dashboard
    └── settings/         # Settings dashboard
        ├── (index)       # Settings overview
        └── [settingsPage] # Dynamic settings pages
```

### 🆕 V5 Project Routes
```
/v5/
└── [jbUrn]/              # Dynamic: V5 project URN format (chainId:projectId)
    ├── (index)           # Project dashboard
    └── settings/         # Settings dashboard
        ├── (index)       # Settings overview
        └── [settingsPage] # Dynamic settings pages
```

## 🔌 API Routes Structure

### Authentication & Account
```
/api/
├── auth/
│   ├── challenge-message   # Get auth challenge
│   └── wallet-sign-in      # Wallet authentication
├── account/
│   ├── [address]           # Get account details
│   ├── update-details      # Update account info
│   └── update-email        # Update email
```

### Juicebox Core APIs
```
/api/juicebox/
├── project/
│   └── [projectHandle]     # Get project by handle
├── projectHandle/
│   └── [projectId]         # Get handle by project ID
├── prices/
│   └── ethusd              # ETH/USD price feed
├── jb-721-delegate/
│   └── [dataSourceAddress] # NFT delegate info
├── pv/[pv]/project/[projectId]/
│   ├── logo                # Project logo
│   └── refreshMetadata     # Refresh metadata
└── v4/
    ├── project/[projectId]/
    │   └── sucker-pairs    # Sucker pairs info
    └── terminal/[terminalAddress]/
        └── jb-terminal-store # Terminal store data
```

### Projects Discovery
```
/api/projects/
├── (index)                # List projects
├── health                 # Health check
├── tag-counts            # Tag statistics
├── trending              # Trending projects
├── update                # Update project data
└── update-retry-ipfs     # Retry IPFS updates
```

### Utility APIs
```
/api/
├── ens/resolve/[address]  # Resolve ENS names
├── ipfs/
│   ├── [cid]              # Get IPFS content
│   └── pinJSON            # Pin JSON to IPFS
├── image/[url]            # Image proxy
├── discord/contact        # Discord notifications
├── ofac/validate/[address] # OFAC compliance check
└── nextjs/revalidate-project # Revalidate cache
```

### Event Webhooks
```
/api/events/
├── on-pay                 # Payment events
├── on-payout-distributed  # Payout events
└── on-user-update         # User update events
```

## 🔗 URL Formats

### Project URN Format (v4/v5)
```
/v4/{chain}:{projectId}
/v5/{chain}:{projectId}

Examples:
- /v4/ethereum:123        # Ethereum mainnet project 123
- /v5/sepolia:456         # Sepolia testnet project 456
- /v4/optimism:789        # Optimism project 789
```

### Supported Chains
- `ethereum` (mainnet)
- `sepolia` (testnet)
- `optimism`
- `optimism-sepolia`
- `base`
- `base-sepolia`
- `arbitrum`
- `arbitrum-sepolia`

## 🔄 Route Versioning

The app supports multiple protocol versions:

1. **V2/V3**: Legacy projects at `/v2/p/[projectId]`
2. **V4**: Current stable at `/v4/[jbUrn]`
3. **V5**: Latest version at `/v5/[jbUrn]`
4. **Handle-based**: Version-agnostic at `/p/[handle]`

## 📝 Settings Pages

Common settings pages (available for v2/v3, v4, and v5):
- General settings
- Funding cycle configuration
- Token settings
- NFT rewards
- Payouts & reserved tokens
- Transfer ownership
- Archive project

## 🌐 Sitemap Access

The sitemap.xml is automatically generated and available at:
```
https://juicebox.money/sitemap.xml
```

## 🔍 Navigation Patterns

1. **Project Discovery**: `/projects` → `/v4/[jbUrn]` or `/v5/[jbUrn]`
2. **Direct Access**: Use handle (`/p/[handle]`) or URN (`/v4/[jbUrn]`)
3. **Settings Flow**: Project page → Settings → Specific setting page
4. **Account Flow**: `/account/[address]` → `/account/[address]/edit`

## 🎯 Key User Journeys

1. **Create Project**: Home → `/create` → Deploy → `/v5/[jbUrn]`
2. **Discover Projects**: Home → `/projects` → Filter/Search → Project page
3. **Manage Project**: Project page → Settings → Configure → Save
4. **View Activity**: `/activity` → Transaction details
5. **User Profile**: `/account/[address]` → View projects/contributions