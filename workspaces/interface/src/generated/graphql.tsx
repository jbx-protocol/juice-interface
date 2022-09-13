import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type DeployEtherc20ProjectPayerEvent = {
  __typename?: 'DeployETHERC20ProjectPayerEvent';
  address: Scalars['Bytes'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  directory: Scalars['Bytes'];
  id: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['Bytes']>;
  owner: Scalars['Bytes'];
  preferAddToBalance: Scalars['Boolean'];
  preferClaimedTokens: Scalars['Boolean'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type DeployEtherc20ProjectPayerEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  directory?: InputMaybe<Scalars['Bytes']>;
  directory_contains?: InputMaybe<Scalars['Bytes']>;
  directory_in?: InputMaybe<Array<Scalars['Bytes']>>;
  directory_not?: InputMaybe<Scalars['Bytes']>;
  directory_not_contains?: InputMaybe<Scalars['Bytes']>;
  directory_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['Bytes']>;
  metadata_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_not?: InputMaybe<Scalars['Bytes']>;
  metadata_not_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  preferAddToBalance?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferAddToBalance_not?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimedTokens?: InputMaybe<Scalars['Boolean']>;
  preferClaimedTokens_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimedTokens_not?: InputMaybe<Scalars['Boolean']>;
  preferClaimedTokens_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DeployEtherc20ProjectPayerEvent_OrderBy {
  Address = 'address',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  Directory = 'directory',
  Id = 'id',
  Memo = 'memo',
  Metadata = 'metadata',
  Owner = 'owner',
  PreferAddToBalance = 'preferAddToBalance',
  PreferClaimedTokens = 'preferClaimedTokens',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type DeployedErc20Event = {
  __typename?: 'DeployedERC20Event';
  address?: Maybe<Scalars['Bytes']>;
  cv: Scalars['String'];
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['Int'];
  symbol: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type DeployedErc20Event_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DeployedErc20Event_OrderBy {
  Address = 'address',
  Cv = 'cv',
  Id = 'id',
  Project = 'project',
  ProjectId = 'projectId',
  Symbol = 'symbol',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type DistributePayoutsEvent = {
  __typename?: 'DistributePayoutsEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  beneficiaryDistributionAmount: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  distributedAmount: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  fundingCycleConfiguration: Scalars['BigInt'];
  fundingCycleNumber: Scalars['Int'];
  id: Scalars['ID'];
  memo: Scalars['String'];
  project: Project;
  projectId: Scalars['Int'];
  splitDistributions: Array<DistributeToPayoutSplitEvent>;
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};


export type DistributePayoutsEventSplitDistributionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
};

export type DistributePayoutsEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiaryDistributionAmount?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_gt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_gte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiaryDistributionAmount_lt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_lte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_not?: InputMaybe<Scalars['BigInt']>;
  beneficiaryDistributionAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  distributedAmount?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_gt?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_gte?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  distributedAmount_lt?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_lte?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_not?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleConfiguration?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleConfiguration_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleNumber?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingCycleNumber_lt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_lte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  splitDistributions_?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributePayoutsEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  BeneficiaryDistributionAmount = 'beneficiaryDistributionAmount',
  Caller = 'caller',
  DistributedAmount = 'distributedAmount',
  Fee = 'fee',
  FundingCycleConfiguration = 'fundingCycleConfiguration',
  FundingCycleNumber = 'fundingCycleNumber',
  Id = 'id',
  Memo = 'memo',
  Project = 'project',
  ProjectId = 'projectId',
  SplitDistributions = 'splitDistributions',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type DistributeReservedTokensEvent = {
  __typename?: 'DistributeReservedTokensEvent';
  beneficiary: Scalars['Bytes'];
  beneficiaryTokenCount: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  fundingCycleNumber: Scalars['Int'];
  id: Scalars['ID'];
  memo: Scalars['String'];
  project: Project;
  projectId: Scalars['Int'];
  splitDistributions: Array<DistributeToReservedTokenSplitEvent>;
  timestamp: Scalars['Int'];
  tokenCount: Scalars['BigInt'];
  txHash: Scalars['Bytes'];
};


export type DistributeReservedTokensEventSplitDistributionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToReservedTokenSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
};

export type DistributeReservedTokensEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiaryTokenCount?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiaryTokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_not?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fundingCycleNumber?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingCycleNumber_lt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_lte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  splitDistributions_?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributeReservedTokensEvent_OrderBy {
  Beneficiary = 'beneficiary',
  BeneficiaryTokenCount = 'beneficiaryTokenCount',
  Caller = 'caller',
  FundingCycleNumber = 'fundingCycleNumber',
  Id = 'id',
  Memo = 'memo',
  Project = 'project',
  ProjectId = 'projectId',
  SplitDistributions = 'splitDistributions',
  Timestamp = 'timestamp',
  TokenCount = 'tokenCount',
  TxHash = 'txHash'
}

export type DistributeToPayoutModEvent = {
  __typename?: 'DistributeToPayoutModEvent';
  caller: Scalars['Bytes'];
  fundingCycleId: Scalars['BigInt'];
  id: Scalars['ID'];
  modAllocator: Scalars['Bytes'];
  modBeneficiary: Scalars['Bytes'];
  modCut: Scalars['BigInt'];
  modPreferUnstaked: Scalars['Boolean'];
  modProjectId: Scalars['Int'];
  project: Project;
  projectId: Scalars['Int'];
  tapEvent: TapEvent;
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type DistributeToPayoutModEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fundingCycleId?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleId_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  modAllocator?: InputMaybe<Scalars['Bytes']>;
  modAllocator_contains?: InputMaybe<Scalars['Bytes']>;
  modAllocator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modAllocator_not?: InputMaybe<Scalars['Bytes']>;
  modAllocator_not_contains?: InputMaybe<Scalars['Bytes']>;
  modAllocator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modBeneficiary?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modBeneficiary_not?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modCut?: InputMaybe<Scalars['BigInt']>;
  modCut_gt?: InputMaybe<Scalars['BigInt']>;
  modCut_gte?: InputMaybe<Scalars['BigInt']>;
  modCut_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modCut_lt?: InputMaybe<Scalars['BigInt']>;
  modCut_lte?: InputMaybe<Scalars['BigInt']>;
  modCut_not?: InputMaybe<Scalars['BigInt']>;
  modCut_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modPreferUnstaked?: InputMaybe<Scalars['Boolean']>;
  modPreferUnstaked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  modPreferUnstaked_not?: InputMaybe<Scalars['Boolean']>;
  modPreferUnstaked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  modProjectId?: InputMaybe<Scalars['Int']>;
  modProjectId_gt?: InputMaybe<Scalars['Int']>;
  modProjectId_gte?: InputMaybe<Scalars['Int']>;
  modProjectId_in?: InputMaybe<Array<Scalars['Int']>>;
  modProjectId_lt?: InputMaybe<Scalars['Int']>;
  modProjectId_lte?: InputMaybe<Scalars['Int']>;
  modProjectId_not?: InputMaybe<Scalars['Int']>;
  modProjectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent?: InputMaybe<Scalars['String']>;
  tapEvent_?: InputMaybe<TapEvent_Filter>;
  tapEvent_contains?: InputMaybe<Scalars['String']>;
  tapEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_ends_with?: InputMaybe<Scalars['String']>;
  tapEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_gt?: InputMaybe<Scalars['String']>;
  tapEvent_gte?: InputMaybe<Scalars['String']>;
  tapEvent_in?: InputMaybe<Array<Scalars['String']>>;
  tapEvent_lt?: InputMaybe<Scalars['String']>;
  tapEvent_lte?: InputMaybe<Scalars['String']>;
  tapEvent_not?: InputMaybe<Scalars['String']>;
  tapEvent_not_contains?: InputMaybe<Scalars['String']>;
  tapEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  tapEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  tapEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  tapEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_starts_with?: InputMaybe<Scalars['String']>;
  tapEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributeToPayoutModEvent_OrderBy {
  Caller = 'caller',
  FundingCycleId = 'fundingCycleId',
  Id = 'id',
  ModAllocator = 'modAllocator',
  ModBeneficiary = 'modBeneficiary',
  ModCut = 'modCut',
  ModPreferUnstaked = 'modPreferUnstaked',
  ModProjectId = 'modProjectId',
  Project = 'project',
  ProjectId = 'projectId',
  TapEvent = 'tapEvent',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type DistributeToPayoutSplitEvent = {
  __typename?: 'DistributeToPayoutSplitEvent';
  allocator: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  distributePayoutsEvent: DistributePayoutsEvent;
  domain: Scalars['BigInt'];
  group: Scalars['BigInt'];
  id: Scalars['ID'];
  lockedUntil: Scalars['Int'];
  percent: Scalars['Int'];
  preferAddToBalance: Scalars['Boolean'];
  preferClaimed: Scalars['Boolean'];
  project: Project;
  projectId: Scalars['Int'];
  splitProjectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type DistributeToPayoutSplitEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allocator?: InputMaybe<Scalars['Bytes']>;
  allocator_contains?: InputMaybe<Scalars['Bytes']>;
  allocator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  allocator_not?: InputMaybe<Scalars['Bytes']>;
  allocator_not_contains?: InputMaybe<Scalars['Bytes']>;
  allocator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  distributePayoutsEvent?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_?: InputMaybe<DistributePayoutsEvent_Filter>;
  distributePayoutsEvent_contains?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_gt?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_gte?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributePayoutsEvent_lt?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_lte?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributePayoutsEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['BigInt']>;
  domain_gt?: InputMaybe<Scalars['BigInt']>;
  domain_gte?: InputMaybe<Scalars['BigInt']>;
  domain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  domain_lt?: InputMaybe<Scalars['BigInt']>;
  domain_lte?: InputMaybe<Scalars['BigInt']>;
  domain_not?: InputMaybe<Scalars['BigInt']>;
  domain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  group?: InputMaybe<Scalars['BigInt']>;
  group_gt?: InputMaybe<Scalars['BigInt']>;
  group_gte?: InputMaybe<Scalars['BigInt']>;
  group_in?: InputMaybe<Array<Scalars['BigInt']>>;
  group_lt?: InputMaybe<Scalars['BigInt']>;
  group_lte?: InputMaybe<Scalars['BigInt']>;
  group_not?: InputMaybe<Scalars['BigInt']>;
  group_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  percent?: InputMaybe<Scalars['Int']>;
  percent_gt?: InputMaybe<Scalars['Int']>;
  percent_gte?: InputMaybe<Scalars['Int']>;
  percent_in?: InputMaybe<Array<Scalars['Int']>>;
  percent_lt?: InputMaybe<Scalars['Int']>;
  percent_lte?: InputMaybe<Scalars['Int']>;
  percent_not?: InputMaybe<Scalars['Int']>;
  percent_not_in?: InputMaybe<Array<Scalars['Int']>>;
  preferAddToBalance?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferAddToBalance_not?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimed?: InputMaybe<Scalars['Boolean']>;
  preferClaimed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimed_not?: InputMaybe<Scalars['Boolean']>;
  preferClaimed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  splitProjectId?: InputMaybe<Scalars['Int']>;
  splitProjectId_gt?: InputMaybe<Scalars['Int']>;
  splitProjectId_gte?: InputMaybe<Scalars['Int']>;
  splitProjectId_in?: InputMaybe<Array<Scalars['Int']>>;
  splitProjectId_lt?: InputMaybe<Scalars['Int']>;
  splitProjectId_lte?: InputMaybe<Scalars['Int']>;
  splitProjectId_not?: InputMaybe<Scalars['Int']>;
  splitProjectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributeToPayoutSplitEvent_OrderBy {
  Allocator = 'allocator',
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  DistributePayoutsEvent = 'distributePayoutsEvent',
  Domain = 'domain',
  Group = 'group',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Percent = 'percent',
  PreferAddToBalance = 'preferAddToBalance',
  PreferClaimed = 'preferClaimed',
  Project = 'project',
  ProjectId = 'projectId',
  SplitProjectId = 'splitProjectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type DistributeToReservedTokenSplitEvent = {
  __typename?: 'DistributeToReservedTokenSplitEvent';
  allocator: Scalars['Bytes'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  distributeReservedTokensEvent: DistributeReservedTokensEvent;
  id: Scalars['ID'];
  lockedUntil: Scalars['Int'];
  percent: Scalars['Int'];
  preferClaimed: Scalars['Boolean'];
  project: Project;
  projectId: Scalars['Int'];
  splitProjectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  tokenCount: Scalars['BigInt'];
  txHash: Scalars['Bytes'];
};

export type DistributeToReservedTokenSplitEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allocator?: InputMaybe<Scalars['Bytes']>;
  allocator_contains?: InputMaybe<Scalars['Bytes']>;
  allocator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  allocator_not?: InputMaybe<Scalars['Bytes']>;
  allocator_not_contains?: InputMaybe<Scalars['Bytes']>;
  allocator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  distributeReservedTokensEvent?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_?: InputMaybe<DistributeReservedTokensEvent_Filter>;
  distributeReservedTokensEvent_contains?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_gt?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_gte?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeReservedTokensEvent_lt?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_lte?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeReservedTokensEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  percent?: InputMaybe<Scalars['Int']>;
  percent_gt?: InputMaybe<Scalars['Int']>;
  percent_gte?: InputMaybe<Scalars['Int']>;
  percent_in?: InputMaybe<Array<Scalars['Int']>>;
  percent_lt?: InputMaybe<Scalars['Int']>;
  percent_lte?: InputMaybe<Scalars['Int']>;
  percent_not?: InputMaybe<Scalars['Int']>;
  percent_not_in?: InputMaybe<Array<Scalars['Int']>>;
  preferClaimed?: InputMaybe<Scalars['Boolean']>;
  preferClaimed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimed_not?: InputMaybe<Scalars['Boolean']>;
  preferClaimed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  splitProjectId?: InputMaybe<Scalars['Int']>;
  splitProjectId_gt?: InputMaybe<Scalars['Int']>;
  splitProjectId_gte?: InputMaybe<Scalars['Int']>;
  splitProjectId_in?: InputMaybe<Array<Scalars['Int']>>;
  splitProjectId_lt?: InputMaybe<Scalars['Int']>;
  splitProjectId_lte?: InputMaybe<Scalars['Int']>;
  splitProjectId_not?: InputMaybe<Scalars['Int']>;
  splitProjectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributeToReservedTokenSplitEvent_OrderBy {
  Allocator = 'allocator',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  DistributeReservedTokensEvent = 'distributeReservedTokensEvent',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Percent = 'percent',
  PreferClaimed = 'preferClaimed',
  Project = 'project',
  ProjectId = 'projectId',
  SplitProjectId = 'splitProjectId',
  Timestamp = 'timestamp',
  TokenCount = 'tokenCount',
  TxHash = 'txHash'
}

export type DistributeToTicketModEvent = {
  __typename?: 'DistributeToTicketModEvent';
  caller: Scalars['Bytes'];
  fundingCycleId: Scalars['BigInt'];
  id: Scalars['ID'];
  modBeneficiary: Scalars['Bytes'];
  modCut: Scalars['BigInt'];
  modPreferUnstaked: Scalars['Boolean'];
  printReservesEvent: PrintReservesEvent;
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type DistributeToTicketModEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fundingCycleId?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleId_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  modBeneficiary?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modBeneficiary_not?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  modBeneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  modCut?: InputMaybe<Scalars['BigInt']>;
  modCut_gt?: InputMaybe<Scalars['BigInt']>;
  modCut_gte?: InputMaybe<Scalars['BigInt']>;
  modCut_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modCut_lt?: InputMaybe<Scalars['BigInt']>;
  modCut_lte?: InputMaybe<Scalars['BigInt']>;
  modCut_not?: InputMaybe<Scalars['BigInt']>;
  modCut_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modPreferUnstaked?: InputMaybe<Scalars['Boolean']>;
  modPreferUnstaked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  modPreferUnstaked_not?: InputMaybe<Scalars['Boolean']>;
  modPreferUnstaked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  printReservesEvent?: InputMaybe<Scalars['String']>;
  printReservesEvent_?: InputMaybe<PrintReservesEvent_Filter>;
  printReservesEvent_contains?: InputMaybe<Scalars['String']>;
  printReservesEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_ends_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_gt?: InputMaybe<Scalars['String']>;
  printReservesEvent_gte?: InputMaybe<Scalars['String']>;
  printReservesEvent_in?: InputMaybe<Array<Scalars['String']>>;
  printReservesEvent_lt?: InputMaybe<Scalars['String']>;
  printReservesEvent_lte?: InputMaybe<Scalars['String']>;
  printReservesEvent_not?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_contains?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  printReservesEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_starts_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum DistributeToTicketModEvent_OrderBy {
  Caller = 'caller',
  FundingCycleId = 'fundingCycleId',
  Id = 'id',
  ModBeneficiary = 'modBeneficiary',
  ModCut = 'modCut',
  ModPreferUnstaked = 'modPreferUnstaked',
  PrintReservesEvent = 'printReservesEvent',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type EnsNode = {
  __typename?: 'ENSNode';
  id: Scalars['ID'];
  projectId?: Maybe<Scalars['Int']>;
};

export type EnsNode_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum EnsNode_OrderBy {
  Id = 'id',
  ProjectId = 'projectId'
}

export type Etherc20ProjectPayer = {
  __typename?: 'ETHERC20ProjectPayer';
  address: Scalars['Bytes'];
  beneficiary: Scalars['Bytes'];
  directory: Scalars['Bytes'];
  id: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['Bytes']>;
  owner: Scalars['Bytes'];
  preferAddToBalance: Scalars['Boolean'];
  preferClaimedTokens: Scalars['Boolean'];
  project: Project;
  projectId: Scalars['Int'];
};

export type Etherc20ProjectPayer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  directory?: InputMaybe<Scalars['Bytes']>;
  directory_contains?: InputMaybe<Scalars['Bytes']>;
  directory_in?: InputMaybe<Array<Scalars['Bytes']>>;
  directory_not?: InputMaybe<Scalars['Bytes']>;
  directory_not_contains?: InputMaybe<Scalars['Bytes']>;
  directory_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['Bytes']>;
  metadata_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_not?: InputMaybe<Scalars['Bytes']>;
  metadata_not_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  preferAddToBalance?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferAddToBalance_not?: InputMaybe<Scalars['Boolean']>;
  preferAddToBalance_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimedTokens?: InputMaybe<Scalars['Boolean']>;
  preferClaimedTokens_in?: InputMaybe<Array<Scalars['Boolean']>>;
  preferClaimedTokens_not?: InputMaybe<Scalars['Boolean']>;
  preferClaimedTokens_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Etherc20ProjectPayer_OrderBy {
  Address = 'address',
  Beneficiary = 'beneficiary',
  Directory = 'directory',
  Id = 'id',
  Memo = 'memo',
  Metadata = 'metadata',
  Owner = 'owner',
  PreferAddToBalance = 'preferAddToBalance',
  PreferClaimedTokens = 'preferClaimedTokens',
  Project = 'project',
  ProjectId = 'projectId'
}

export type MintTokensEvent = {
  __typename?: 'MintTokensEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  cv: Scalars['String'];
  id: Scalars['ID'];
  memo: Scalars['String'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type MintTokensEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum MintTokensEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  Cv = 'cv',
  Id = 'id',
  Memo = 'memo',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Participant = {
  __typename?: 'Participant';
  balance: Scalars['BigInt'];
  cv: Scalars['String'];
  id: Scalars['ID'];
  lastPaidTimestamp: Scalars['Int'];
  project: Project;
  projectId: Scalars['Int'];
  stakedBalance: Scalars['BigInt'];
  totalPaid: Scalars['BigInt'];
  unstakedBalance: Scalars['BigInt'];
  wallet: Scalars['Bytes'];
};

export type Participant_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastPaidTimestamp?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_gt?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_gte?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  lastPaidTimestamp_lt?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_lte?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_not?: InputMaybe<Scalars['Int']>;
  lastPaidTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stakedBalance?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_gt?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_gte?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakedBalance_lt?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_lte?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_not?: InputMaybe<Scalars['BigInt']>;
  stakedBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPaid?: InputMaybe<Scalars['BigInt']>;
  totalPaid_gt?: InputMaybe<Scalars['BigInt']>;
  totalPaid_gte?: InputMaybe<Scalars['BigInt']>;
  totalPaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPaid_lt?: InputMaybe<Scalars['BigInt']>;
  totalPaid_lte?: InputMaybe<Scalars['BigInt']>;
  totalPaid_not?: InputMaybe<Scalars['BigInt']>;
  totalPaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unstakedBalance?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_gt?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_gte?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unstakedBalance_lt?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_lte?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_not?: InputMaybe<Scalars['BigInt']>;
  unstakedBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  wallet?: InputMaybe<Scalars['Bytes']>;
  wallet_contains?: InputMaybe<Scalars['Bytes']>;
  wallet_in?: InputMaybe<Array<Scalars['Bytes']>>;
  wallet_not?: InputMaybe<Scalars['Bytes']>;
  wallet_not_contains?: InputMaybe<Scalars['Bytes']>;
  wallet_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Participant_OrderBy {
  Balance = 'balance',
  Cv = 'cv',
  Id = 'id',
  LastPaidTimestamp = 'lastPaidTimestamp',
  Project = 'project',
  ProjectId = 'projectId',
  StakedBalance = 'stakedBalance',
  TotalPaid = 'totalPaid',
  UnstakedBalance = 'unstakedBalance',
  Wallet = 'wallet'
}

export type PayEvent = {
  __typename?: 'PayEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  cv: Scalars['String'];
  feeFromV2Project?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  note: Scalars['String'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type PayEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feeFromV2Project?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_gt?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_gte?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_in?: InputMaybe<Array<Scalars['Int']>>;
  feeFromV2Project_lt?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_lte?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_not?: InputMaybe<Scalars['Int']>;
  feeFromV2Project_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  note?: InputMaybe<Scalars['String']>;
  note_contains?: InputMaybe<Scalars['String']>;
  note_contains_nocase?: InputMaybe<Scalars['String']>;
  note_ends_with?: InputMaybe<Scalars['String']>;
  note_ends_with_nocase?: InputMaybe<Scalars['String']>;
  note_gt?: InputMaybe<Scalars['String']>;
  note_gte?: InputMaybe<Scalars['String']>;
  note_in?: InputMaybe<Array<Scalars['String']>>;
  note_lt?: InputMaybe<Scalars['String']>;
  note_lte?: InputMaybe<Scalars['String']>;
  note_not?: InputMaybe<Scalars['String']>;
  note_not_contains?: InputMaybe<Scalars['String']>;
  note_not_contains_nocase?: InputMaybe<Scalars['String']>;
  note_not_ends_with?: InputMaybe<Scalars['String']>;
  note_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  note_not_in?: InputMaybe<Array<Scalars['String']>>;
  note_not_starts_with?: InputMaybe<Scalars['String']>;
  note_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  note_starts_with?: InputMaybe<Scalars['String']>;
  note_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum PayEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  Cv = 'cv',
  FeeFromV2Project = 'feeFromV2Project',
  Id = 'id',
  Note = 'note',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type PrintReservesEvent = {
  __typename?: 'PrintReservesEvent';
  beneficiary: Scalars['Bytes'];
  beneficiaryTicketAmount: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  count: Scalars['BigInt'];
  distributions: Array<DistributeToTicketModEvent>;
  fundingCycleId: Scalars['BigInt'];
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};


export type PrintReservesEventDistributionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToTicketModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToTicketModEvent_Filter>;
};

export type PrintReservesEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiaryTicketAmount?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_gt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_gte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiaryTicketAmount_lt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_lte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_not?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTicketAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  count?: InputMaybe<Scalars['BigInt']>;
  count_gt?: InputMaybe<Scalars['BigInt']>;
  count_gte?: InputMaybe<Scalars['BigInt']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']>>;
  count_lt?: InputMaybe<Scalars['BigInt']>;
  count_lte?: InputMaybe<Scalars['BigInt']>;
  count_not?: InputMaybe<Scalars['BigInt']>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  distributions_?: InputMaybe<DistributeToTicketModEvent_Filter>;
  fundingCycleId?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleId_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum PrintReservesEvent_OrderBy {
  Beneficiary = 'beneficiary',
  BeneficiaryTicketAmount = 'beneficiaryTicketAmount',
  Caller = 'caller',
  Count = 'count',
  Distributions = 'distributions',
  FundingCycleId = 'fundingCycleId',
  Id = 'id',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['BigInt'];
  currentBalance: Scalars['BigInt'];
  cv: Scalars['String'];
  deployedERC20Events: Array<DeployedErc20Event>;
  deployedERC20s: Array<DeployedErc20Event>;
  distributePayoutsEvents: Array<DistributePayoutsEvent>;
  distributeReservedTokensEvents: Array<DistributeReservedTokensEvent>;
  distributeToPayoutModEvents: Array<DistributeToPayoutModEvent>;
  distributeToPayoutSplitEvents: Array<DistributeToPayoutSplitEvent>;
  distributeToReservedTokenSplitEvents: Array<DistributeToReservedTokenSplitEvent>;
  distributeToTicketModEvents: Array<DistributeToTicketModEvent>;
  ethErc20ProjectPayers: Array<Etherc20ProjectPayer>;
  handle?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadataDomain?: Maybe<Scalars['BigInt']>;
  metadataUri?: Maybe<Scalars['String']>;
  mintTokensEvents: Array<MintTokensEvent>;
  owner: Scalars['Bytes'];
  participants: Array<Participant>;
  payEvents: Array<PayEvent>;
  printReservesEvents: Array<PrintReservesEvent>;
  projectEvents: Array<ProjectEvent>;
  projectId: Scalars['Int'];
  redeemEvents: Array<RedeemEvent>;
  tapEvents: Array<TapEvent>;
  terminal?: Maybe<Scalars['Bytes']>;
  totalPaid: Scalars['BigInt'];
  totalRedeemed: Scalars['BigInt'];
  useAllowanceEvents: Array<UseAllowanceEvent>;
};


export type ProjectDeployedErc20EventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployedErc20Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DeployedErc20Event_Filter>;
};


export type ProjectDeployedErc20sArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployedErc20Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DeployedErc20Event_Filter>;
};


export type ProjectDistributePayoutsEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributePayoutsEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributePayoutsEvent_Filter>;
};


export type ProjectDistributeReservedTokensEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeReservedTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeReservedTokensEvent_Filter>;
};


export type ProjectDistributeToPayoutModEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToPayoutModEvent_Filter>;
};


export type ProjectDistributeToPayoutSplitEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
};


export type ProjectDistributeToReservedTokenSplitEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToReservedTokenSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
};


export type ProjectDistributeToTicketModEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToTicketModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToTicketModEvent_Filter>;
};


export type ProjectEthErc20ProjectPayersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Etherc20ProjectPayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Etherc20ProjectPayer_Filter>;
};


export type ProjectMintTokensEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MintTokensEvent_Filter>;
};


export type ProjectParticipantsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Participant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Participant_Filter>;
};


export type ProjectPayEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PayEvent_Filter>;
};


export type ProjectPrintReservesEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PrintReservesEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PrintReservesEvent_Filter>;
};


export type ProjectProjectEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProjectEvent_Filter>;
};


export type ProjectRedeemEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RedeemEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RedeemEvent_Filter>;
};


export type ProjectTapEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TapEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TapEvent_Filter>;
};


export type ProjectUseAllowanceEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UseAllowanceEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UseAllowanceEvent_Filter>;
};

export type ProjectCreateEvent = {
  __typename?: 'ProjectCreateEvent';
  caller: Scalars['Bytes'];
  cv: Scalars['String'];
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type ProjectCreateEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ProjectCreateEvent_OrderBy {
  Caller = 'caller',
  Cv = 'cv',
  Id = 'id',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type ProjectEvent = {
  __typename?: 'ProjectEvent';
  cv: Scalars['String'];
  deployETHERC20ProjectPayerEvent?: Maybe<DeployEtherc20ProjectPayerEvent>;
  deployedERC20Event?: Maybe<DeployedErc20Event>;
  distributePayoutsEvent?: Maybe<DistributePayoutsEvent>;
  distributeReservedTokensEvent?: Maybe<DistributeReservedTokensEvent>;
  distributeToPayoutModEvent?: Maybe<DistributeToPayoutModEvent>;
  distributeToPayoutSplitEvent?: Maybe<DistributeToPayoutSplitEvent>;
  distributeToReservedTokenSplitEvent?: Maybe<DistributeToReservedTokenSplitEvent>;
  distributeToTicketModEvent?: Maybe<DistributeToTicketModEvent>;
  id: Scalars['ID'];
  mintTokensEvent?: Maybe<MintTokensEvent>;
  payEvent?: Maybe<PayEvent>;
  printReservesEvent?: Maybe<PrintReservesEvent>;
  project: Project;
  projectCreateEvent?: Maybe<ProjectCreateEvent>;
  projectId: Scalars['Int'];
  redeemEvent?: Maybe<RedeemEvent>;
  tapEvent?: Maybe<TapEvent>;
  timestamp: Scalars['Int'];
  useAllowanceEvent?: Maybe<UseAllowanceEvent>;
};

export type ProjectEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_?: InputMaybe<DeployEtherc20ProjectPayerEvent_Filter>;
  deployETHERC20ProjectPayerEvent_contains?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_ends_with?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_gt?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_gte?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_in?: InputMaybe<Array<Scalars['String']>>;
  deployETHERC20ProjectPayerEvent_lt?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_lte?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_contains?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  deployETHERC20ProjectPayerEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_starts_with?: InputMaybe<Scalars['String']>;
  deployETHERC20ProjectPayerEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event?: InputMaybe<Scalars['String']>;
  deployedERC20Event_?: InputMaybe<DeployedErc20Event_Filter>;
  deployedERC20Event_contains?: InputMaybe<Scalars['String']>;
  deployedERC20Event_contains_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event_ends_with?: InputMaybe<Scalars['String']>;
  deployedERC20Event_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event_gt?: InputMaybe<Scalars['String']>;
  deployedERC20Event_gte?: InputMaybe<Scalars['String']>;
  deployedERC20Event_in?: InputMaybe<Array<Scalars['String']>>;
  deployedERC20Event_lt?: InputMaybe<Scalars['String']>;
  deployedERC20Event_lte?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_contains?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_ends_with?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_in?: InputMaybe<Array<Scalars['String']>>;
  deployedERC20Event_not_starts_with?: InputMaybe<Scalars['String']>;
  deployedERC20Event_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Event_starts_with?: InputMaybe<Scalars['String']>;
  deployedERC20Event_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_?: InputMaybe<DistributePayoutsEvent_Filter>;
  distributePayoutsEvent_contains?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_gt?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_gte?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributePayoutsEvent_lt?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_lte?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributePayoutsEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributePayoutsEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_?: InputMaybe<DistributeReservedTokensEvent_Filter>;
  distributeReservedTokensEvent_contains?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_gt?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_gte?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeReservedTokensEvent_lt?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_lte?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeReservedTokensEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeReservedTokensEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_?: InputMaybe<DistributeToPayoutModEvent_Filter>;
  distributeToPayoutModEvent_contains?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_gt?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_gte?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToPayoutModEvent_lt?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_lte?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToPayoutModEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutModEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
  distributeToPayoutSplitEvent_contains?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_gt?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_gte?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToPayoutSplitEvent_lt?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_lte?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToPayoutSplitEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeToPayoutSplitEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
  distributeToReservedTokenSplitEvent_contains?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_gt?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_gte?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToReservedTokenSplitEvent_lt?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_lte?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToReservedTokenSplitEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeToReservedTokenSplitEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_?: InputMaybe<DistributeToTicketModEvent_Filter>;
  distributeToTicketModEvent_contains?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_ends_with?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_gt?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_gte?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToTicketModEvent_lt?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_lte?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_contains?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  distributeToTicketModEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_starts_with?: InputMaybe<Scalars['String']>;
  distributeToTicketModEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  mintTokensEvent?: InputMaybe<Scalars['String']>;
  mintTokensEvent_?: InputMaybe<MintTokensEvent_Filter>;
  mintTokensEvent_contains?: InputMaybe<Scalars['String']>;
  mintTokensEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvent_ends_with?: InputMaybe<Scalars['String']>;
  mintTokensEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvent_gt?: InputMaybe<Scalars['String']>;
  mintTokensEvent_gte?: InputMaybe<Scalars['String']>;
  mintTokensEvent_in?: InputMaybe<Array<Scalars['String']>>;
  mintTokensEvent_lt?: InputMaybe<Scalars['String']>;
  mintTokensEvent_lte?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_contains?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  mintTokensEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  mintTokensEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvent_starts_with?: InputMaybe<Scalars['String']>;
  mintTokensEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  payEvent?: InputMaybe<Scalars['String']>;
  payEvent_?: InputMaybe<PayEvent_Filter>;
  payEvent_contains?: InputMaybe<Scalars['String']>;
  payEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  payEvent_ends_with?: InputMaybe<Scalars['String']>;
  payEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  payEvent_gt?: InputMaybe<Scalars['String']>;
  payEvent_gte?: InputMaybe<Scalars['String']>;
  payEvent_in?: InputMaybe<Array<Scalars['String']>>;
  payEvent_lt?: InputMaybe<Scalars['String']>;
  payEvent_lte?: InputMaybe<Scalars['String']>;
  payEvent_not?: InputMaybe<Scalars['String']>;
  payEvent_not_contains?: InputMaybe<Scalars['String']>;
  payEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  payEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  payEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  payEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  payEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  payEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  payEvent_starts_with?: InputMaybe<Scalars['String']>;
  payEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent?: InputMaybe<Scalars['String']>;
  printReservesEvent_?: InputMaybe<PrintReservesEvent_Filter>;
  printReservesEvent_contains?: InputMaybe<Scalars['String']>;
  printReservesEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_ends_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_gt?: InputMaybe<Scalars['String']>;
  printReservesEvent_gte?: InputMaybe<Scalars['String']>;
  printReservesEvent_in?: InputMaybe<Array<Scalars['String']>>;
  printReservesEvent_lt?: InputMaybe<Scalars['String']>;
  printReservesEvent_lte?: InputMaybe<Scalars['String']>;
  printReservesEvent_not?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_contains?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  printReservesEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  printReservesEvent_starts_with?: InputMaybe<Scalars['String']>;
  printReservesEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  projectCreateEvent?: InputMaybe<Scalars['String']>;
  projectCreateEvent_?: InputMaybe<ProjectCreateEvent_Filter>;
  projectCreateEvent_contains?: InputMaybe<Scalars['String']>;
  projectCreateEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  projectCreateEvent_ends_with?: InputMaybe<Scalars['String']>;
  projectCreateEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  projectCreateEvent_gt?: InputMaybe<Scalars['String']>;
  projectCreateEvent_gte?: InputMaybe<Scalars['String']>;
  projectCreateEvent_in?: InputMaybe<Array<Scalars['String']>>;
  projectCreateEvent_lt?: InputMaybe<Scalars['String']>;
  projectCreateEvent_lte?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_contains?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  projectCreateEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  projectCreateEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  projectCreateEvent_starts_with?: InputMaybe<Scalars['String']>;
  projectCreateEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent?: InputMaybe<Scalars['String']>;
  redeemEvent_?: InputMaybe<RedeemEvent_Filter>;
  redeemEvent_contains?: InputMaybe<Scalars['String']>;
  redeemEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent_ends_with?: InputMaybe<Scalars['String']>;
  redeemEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent_gt?: InputMaybe<Scalars['String']>;
  redeemEvent_gte?: InputMaybe<Scalars['String']>;
  redeemEvent_in?: InputMaybe<Array<Scalars['String']>>;
  redeemEvent_lt?: InputMaybe<Scalars['String']>;
  redeemEvent_lte?: InputMaybe<Scalars['String']>;
  redeemEvent_not?: InputMaybe<Scalars['String']>;
  redeemEvent_not_contains?: InputMaybe<Scalars['String']>;
  redeemEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  redeemEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  redeemEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  redeemEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  redeemEvent_starts_with?: InputMaybe<Scalars['String']>;
  redeemEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent?: InputMaybe<Scalars['String']>;
  tapEvent_?: InputMaybe<TapEvent_Filter>;
  tapEvent_contains?: InputMaybe<Scalars['String']>;
  tapEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_ends_with?: InputMaybe<Scalars['String']>;
  tapEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_gt?: InputMaybe<Scalars['String']>;
  tapEvent_gte?: InputMaybe<Scalars['String']>;
  tapEvent_in?: InputMaybe<Array<Scalars['String']>>;
  tapEvent_lt?: InputMaybe<Scalars['String']>;
  tapEvent_lte?: InputMaybe<Scalars['String']>;
  tapEvent_not?: InputMaybe<Scalars['String']>;
  tapEvent_not_contains?: InputMaybe<Scalars['String']>;
  tapEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  tapEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  tapEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  tapEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tapEvent_starts_with?: InputMaybe<Scalars['String']>;
  tapEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  useAllowanceEvent?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_?: InputMaybe<UseAllowanceEvent_Filter>;
  useAllowanceEvent_contains?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_contains_nocase?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_ends_with?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_ends_with_nocase?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_gt?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_gte?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_in?: InputMaybe<Array<Scalars['String']>>;
  useAllowanceEvent_lt?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_lte?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_contains?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_contains_nocase?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_ends_with?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_in?: InputMaybe<Array<Scalars['String']>>;
  useAllowanceEvent_not_starts_with?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_starts_with?: InputMaybe<Scalars['String']>;
  useAllowanceEvent_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProjectEvent_OrderBy {
  Cv = 'cv',
  DeployEtherc20ProjectPayerEvent = 'deployETHERC20ProjectPayerEvent',
  DeployedErc20Event = 'deployedERC20Event',
  DistributePayoutsEvent = 'distributePayoutsEvent',
  DistributeReservedTokensEvent = 'distributeReservedTokensEvent',
  DistributeToPayoutModEvent = 'distributeToPayoutModEvent',
  DistributeToPayoutSplitEvent = 'distributeToPayoutSplitEvent',
  DistributeToReservedTokenSplitEvent = 'distributeToReservedTokenSplitEvent',
  DistributeToTicketModEvent = 'distributeToTicketModEvent',
  Id = 'id',
  MintTokensEvent = 'mintTokensEvent',
  PayEvent = 'payEvent',
  PrintReservesEvent = 'printReservesEvent',
  Project = 'project',
  ProjectCreateEvent = 'projectCreateEvent',
  ProjectId = 'projectId',
  RedeemEvent = 'redeemEvent',
  TapEvent = 'tapEvent',
  Timestamp = 'timestamp',
  UseAllowanceEvent = 'useAllowanceEvent'
}

export type Project_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdAt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentBalance?: InputMaybe<Scalars['BigInt']>;
  currentBalance_gt?: InputMaybe<Scalars['BigInt']>;
  currentBalance_gte?: InputMaybe<Scalars['BigInt']>;
  currentBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentBalance_lt?: InputMaybe<Scalars['BigInt']>;
  currentBalance_lte?: InputMaybe<Scalars['BigInt']>;
  currentBalance_not?: InputMaybe<Scalars['BigInt']>;
  currentBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deployedERC20Events_?: InputMaybe<DeployedErc20Event_Filter>;
  deployedERC20s_?: InputMaybe<DeployedErc20Event_Filter>;
  distributePayoutsEvents_?: InputMaybe<DistributePayoutsEvent_Filter>;
  distributeReservedTokensEvents_?: InputMaybe<DistributeReservedTokensEvent_Filter>;
  distributeToPayoutModEvents_?: InputMaybe<DistributeToPayoutModEvent_Filter>;
  distributeToPayoutSplitEvents_?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
  distributeToReservedTokenSplitEvents_?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
  distributeToTicketModEvents_?: InputMaybe<DistributeToTicketModEvent_Filter>;
  ethErc20ProjectPayers_?: InputMaybe<Etherc20ProjectPayer_Filter>;
  handle?: InputMaybe<Scalars['String']>;
  handle_contains?: InputMaybe<Scalars['String']>;
  handle_contains_nocase?: InputMaybe<Scalars['String']>;
  handle_ends_with?: InputMaybe<Scalars['String']>;
  handle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  handle_gt?: InputMaybe<Scalars['String']>;
  handle_gte?: InputMaybe<Scalars['String']>;
  handle_in?: InputMaybe<Array<Scalars['String']>>;
  handle_lt?: InputMaybe<Scalars['String']>;
  handle_lte?: InputMaybe<Scalars['String']>;
  handle_not?: InputMaybe<Scalars['String']>;
  handle_not_contains?: InputMaybe<Scalars['String']>;
  handle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  handle_not_ends_with?: InputMaybe<Scalars['String']>;
  handle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  handle_not_in?: InputMaybe<Array<Scalars['String']>>;
  handle_not_starts_with?: InputMaybe<Scalars['String']>;
  handle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  handle_starts_with?: InputMaybe<Scalars['String']>;
  handle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  metadataDomain?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_gt?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_gte?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadataDomain_lt?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_lte?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_not?: InputMaybe<Scalars['BigInt']>;
  metadataDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadataUri?: InputMaybe<Scalars['String']>;
  metadataUri_contains?: InputMaybe<Scalars['String']>;
  metadataUri_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataUri_ends_with?: InputMaybe<Scalars['String']>;
  metadataUri_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataUri_gt?: InputMaybe<Scalars['String']>;
  metadataUri_gte?: InputMaybe<Scalars['String']>;
  metadataUri_in?: InputMaybe<Array<Scalars['String']>>;
  metadataUri_lt?: InputMaybe<Scalars['String']>;
  metadataUri_lte?: InputMaybe<Scalars['String']>;
  metadataUri_not?: InputMaybe<Scalars['String']>;
  metadataUri_not_contains?: InputMaybe<Scalars['String']>;
  metadataUri_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataUri_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataUri_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataUri_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataUri_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataUri_starts_with?: InputMaybe<Scalars['String']>;
  metadataUri_starts_with_nocase?: InputMaybe<Scalars['String']>;
  mintTokensEvents_?: InputMaybe<MintTokensEvent_Filter>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  participants_?: InputMaybe<Participant_Filter>;
  payEvents_?: InputMaybe<PayEvent_Filter>;
  printReservesEvents_?: InputMaybe<PrintReservesEvent_Filter>;
  projectEvents_?: InputMaybe<ProjectEvent_Filter>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemEvents_?: InputMaybe<RedeemEvent_Filter>;
  tapEvents_?: InputMaybe<TapEvent_Filter>;
  terminal?: InputMaybe<Scalars['Bytes']>;
  terminal_contains?: InputMaybe<Scalars['Bytes']>;
  terminal_in?: InputMaybe<Array<Scalars['Bytes']>>;
  terminal_not?: InputMaybe<Scalars['Bytes']>;
  terminal_not_contains?: InputMaybe<Scalars['Bytes']>;
  terminal_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  totalPaid?: InputMaybe<Scalars['BigInt']>;
  totalPaid_gt?: InputMaybe<Scalars['BigInt']>;
  totalPaid_gte?: InputMaybe<Scalars['BigInt']>;
  totalPaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPaid_lt?: InputMaybe<Scalars['BigInt']>;
  totalPaid_lte?: InputMaybe<Scalars['BigInt']>;
  totalPaid_not?: InputMaybe<Scalars['BigInt']>;
  totalPaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRedeemed?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_gt?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_gte?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRedeemed_lt?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_lte?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_not?: InputMaybe<Scalars['BigInt']>;
  totalRedeemed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  useAllowanceEvents_?: InputMaybe<UseAllowanceEvent_Filter>;
};

export enum Project_OrderBy {
  CreatedAt = 'createdAt',
  CurrentBalance = 'currentBalance',
  Cv = 'cv',
  DeployedErc20Events = 'deployedERC20Events',
  DeployedErc20s = 'deployedERC20s',
  DistributePayoutsEvents = 'distributePayoutsEvents',
  DistributeReservedTokensEvents = 'distributeReservedTokensEvents',
  DistributeToPayoutModEvents = 'distributeToPayoutModEvents',
  DistributeToPayoutSplitEvents = 'distributeToPayoutSplitEvents',
  DistributeToReservedTokenSplitEvents = 'distributeToReservedTokenSplitEvents',
  DistributeToTicketModEvents = 'distributeToTicketModEvents',
  EthErc20ProjectPayers = 'ethErc20ProjectPayers',
  Handle = 'handle',
  Id = 'id',
  MetadataDomain = 'metadataDomain',
  MetadataUri = 'metadataUri',
  MintTokensEvents = 'mintTokensEvents',
  Owner = 'owner',
  Participants = 'participants',
  PayEvents = 'payEvents',
  PrintReservesEvents = 'printReservesEvents',
  ProjectEvents = 'projectEvents',
  ProjectId = 'projectId',
  RedeemEvents = 'redeemEvents',
  TapEvents = 'tapEvents',
  Terminal = 'terminal',
  TotalPaid = 'totalPaid',
  TotalRedeemed = 'totalRedeemed',
  UseAllowanceEvents = 'useAllowanceEvents'
}

export type ProtocolLog = {
  __typename?: 'ProtocolLog';
  erc20Count: Scalars['Int'];
  id: Scalars['ID'];
  paymentsCount: Scalars['Int'];
  projectsCount: Scalars['Int'];
  redeemCount: Scalars['Int'];
  v1?: Maybe<ProtocolV1Log>;
  v2?: Maybe<ProtocolV2Log>;
  volumePaid: Scalars['BigInt'];
  volumeRedeemed: Scalars['BigInt'];
};

export type ProtocolLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  erc20Count?: InputMaybe<Scalars['Int']>;
  erc20Count_gt?: InputMaybe<Scalars['Int']>;
  erc20Count_gte?: InputMaybe<Scalars['Int']>;
  erc20Count_in?: InputMaybe<Array<Scalars['Int']>>;
  erc20Count_lt?: InputMaybe<Scalars['Int']>;
  erc20Count_lte?: InputMaybe<Scalars['Int']>;
  erc20Count_not?: InputMaybe<Scalars['Int']>;
  erc20Count_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  paymentsCount?: InputMaybe<Scalars['Int']>;
  paymentsCount_gt?: InputMaybe<Scalars['Int']>;
  paymentsCount_gte?: InputMaybe<Scalars['Int']>;
  paymentsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  paymentsCount_lt?: InputMaybe<Scalars['Int']>;
  paymentsCount_lte?: InputMaybe<Scalars['Int']>;
  paymentsCount_not?: InputMaybe<Scalars['Int']>;
  paymentsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount?: InputMaybe<Scalars['Int']>;
  projectsCount_gt?: InputMaybe<Scalars['Int']>;
  projectsCount_gte?: InputMaybe<Scalars['Int']>;
  projectsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount_lt?: InputMaybe<Scalars['Int']>;
  projectsCount_lte?: InputMaybe<Scalars['Int']>;
  projectsCount_not?: InputMaybe<Scalars['Int']>;
  projectsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount?: InputMaybe<Scalars['Int']>;
  redeemCount_gt?: InputMaybe<Scalars['Int']>;
  redeemCount_gte?: InputMaybe<Scalars['Int']>;
  redeemCount_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount_lt?: InputMaybe<Scalars['Int']>;
  redeemCount_lte?: InputMaybe<Scalars['Int']>;
  redeemCount_not?: InputMaybe<Scalars['Int']>;
  redeemCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  v1_?: InputMaybe<ProtocolV1Log_Filter>;
  v2_?: InputMaybe<ProtocolV2Log_Filter>;
  volumePaid?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumePaid_lt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_lte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed_lt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_lte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum ProtocolLog_OrderBy {
  Erc20Count = 'erc20Count',
  Id = 'id',
  PaymentsCount = 'paymentsCount',
  ProjectsCount = 'projectsCount',
  RedeemCount = 'redeemCount',
  V1 = 'v1',
  V2 = 'v2',
  VolumePaid = 'volumePaid',
  VolumeRedeemed = 'volumeRedeemed'
}

export type ProtocolV1Log = {
  __typename?: 'ProtocolV1Log';
  erc20Count: Scalars['Int'];
  id: Scalars['ID'];
  log: ProtocolLog;
  paymentsCount: Scalars['Int'];
  projectsCount: Scalars['Int'];
  redeemCount: Scalars['Int'];
  volumePaid: Scalars['BigInt'];
  volumeRedeemed: Scalars['BigInt'];
};

export type ProtocolV1Log_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  erc20Count?: InputMaybe<Scalars['Int']>;
  erc20Count_gt?: InputMaybe<Scalars['Int']>;
  erc20Count_gte?: InputMaybe<Scalars['Int']>;
  erc20Count_in?: InputMaybe<Array<Scalars['Int']>>;
  erc20Count_lt?: InputMaybe<Scalars['Int']>;
  erc20Count_lte?: InputMaybe<Scalars['Int']>;
  erc20Count_not?: InputMaybe<Scalars['Int']>;
  erc20Count_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  log?: InputMaybe<Scalars['String']>;
  log_?: InputMaybe<ProtocolLog_Filter>;
  log_contains?: InputMaybe<Scalars['String']>;
  log_contains_nocase?: InputMaybe<Scalars['String']>;
  log_ends_with?: InputMaybe<Scalars['String']>;
  log_ends_with_nocase?: InputMaybe<Scalars['String']>;
  log_gt?: InputMaybe<Scalars['String']>;
  log_gte?: InputMaybe<Scalars['String']>;
  log_in?: InputMaybe<Array<Scalars['String']>>;
  log_lt?: InputMaybe<Scalars['String']>;
  log_lte?: InputMaybe<Scalars['String']>;
  log_not?: InputMaybe<Scalars['String']>;
  log_not_contains?: InputMaybe<Scalars['String']>;
  log_not_contains_nocase?: InputMaybe<Scalars['String']>;
  log_not_ends_with?: InputMaybe<Scalars['String']>;
  log_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  log_not_in?: InputMaybe<Array<Scalars['String']>>;
  log_not_starts_with?: InputMaybe<Scalars['String']>;
  log_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  log_starts_with?: InputMaybe<Scalars['String']>;
  log_starts_with_nocase?: InputMaybe<Scalars['String']>;
  paymentsCount?: InputMaybe<Scalars['Int']>;
  paymentsCount_gt?: InputMaybe<Scalars['Int']>;
  paymentsCount_gte?: InputMaybe<Scalars['Int']>;
  paymentsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  paymentsCount_lt?: InputMaybe<Scalars['Int']>;
  paymentsCount_lte?: InputMaybe<Scalars['Int']>;
  paymentsCount_not?: InputMaybe<Scalars['Int']>;
  paymentsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount?: InputMaybe<Scalars['Int']>;
  projectsCount_gt?: InputMaybe<Scalars['Int']>;
  projectsCount_gte?: InputMaybe<Scalars['Int']>;
  projectsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount_lt?: InputMaybe<Scalars['Int']>;
  projectsCount_lte?: InputMaybe<Scalars['Int']>;
  projectsCount_not?: InputMaybe<Scalars['Int']>;
  projectsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount?: InputMaybe<Scalars['Int']>;
  redeemCount_gt?: InputMaybe<Scalars['Int']>;
  redeemCount_gte?: InputMaybe<Scalars['Int']>;
  redeemCount_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount_lt?: InputMaybe<Scalars['Int']>;
  redeemCount_lte?: InputMaybe<Scalars['Int']>;
  redeemCount_not?: InputMaybe<Scalars['Int']>;
  redeemCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  volumePaid?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumePaid_lt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_lte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed_lt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_lte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum ProtocolV1Log_OrderBy {
  Erc20Count = 'erc20Count',
  Id = 'id',
  Log = 'log',
  PaymentsCount = 'paymentsCount',
  ProjectsCount = 'projectsCount',
  RedeemCount = 'redeemCount',
  VolumePaid = 'volumePaid',
  VolumeRedeemed = 'volumeRedeemed'
}

export type ProtocolV2Log = {
  __typename?: 'ProtocolV2Log';
  erc20Count: Scalars['Int'];
  id: Scalars['ID'];
  log: ProtocolLog;
  paymentsCount: Scalars['Int'];
  projectsCount: Scalars['Int'];
  redeemCount: Scalars['Int'];
  volumePaid: Scalars['BigInt'];
  volumeRedeemed: Scalars['BigInt'];
};

export type ProtocolV2Log_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  erc20Count?: InputMaybe<Scalars['Int']>;
  erc20Count_gt?: InputMaybe<Scalars['Int']>;
  erc20Count_gte?: InputMaybe<Scalars['Int']>;
  erc20Count_in?: InputMaybe<Array<Scalars['Int']>>;
  erc20Count_lt?: InputMaybe<Scalars['Int']>;
  erc20Count_lte?: InputMaybe<Scalars['Int']>;
  erc20Count_not?: InputMaybe<Scalars['Int']>;
  erc20Count_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  log?: InputMaybe<Scalars['String']>;
  log_?: InputMaybe<ProtocolLog_Filter>;
  log_contains?: InputMaybe<Scalars['String']>;
  log_contains_nocase?: InputMaybe<Scalars['String']>;
  log_ends_with?: InputMaybe<Scalars['String']>;
  log_ends_with_nocase?: InputMaybe<Scalars['String']>;
  log_gt?: InputMaybe<Scalars['String']>;
  log_gte?: InputMaybe<Scalars['String']>;
  log_in?: InputMaybe<Array<Scalars['String']>>;
  log_lt?: InputMaybe<Scalars['String']>;
  log_lte?: InputMaybe<Scalars['String']>;
  log_not?: InputMaybe<Scalars['String']>;
  log_not_contains?: InputMaybe<Scalars['String']>;
  log_not_contains_nocase?: InputMaybe<Scalars['String']>;
  log_not_ends_with?: InputMaybe<Scalars['String']>;
  log_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  log_not_in?: InputMaybe<Array<Scalars['String']>>;
  log_not_starts_with?: InputMaybe<Scalars['String']>;
  log_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  log_starts_with?: InputMaybe<Scalars['String']>;
  log_starts_with_nocase?: InputMaybe<Scalars['String']>;
  paymentsCount?: InputMaybe<Scalars['Int']>;
  paymentsCount_gt?: InputMaybe<Scalars['Int']>;
  paymentsCount_gte?: InputMaybe<Scalars['Int']>;
  paymentsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  paymentsCount_lt?: InputMaybe<Scalars['Int']>;
  paymentsCount_lte?: InputMaybe<Scalars['Int']>;
  paymentsCount_not?: InputMaybe<Scalars['Int']>;
  paymentsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount?: InputMaybe<Scalars['Int']>;
  projectsCount_gt?: InputMaybe<Scalars['Int']>;
  projectsCount_gte?: InputMaybe<Scalars['Int']>;
  projectsCount_in?: InputMaybe<Array<Scalars['Int']>>;
  projectsCount_lt?: InputMaybe<Scalars['Int']>;
  projectsCount_lte?: InputMaybe<Scalars['Int']>;
  projectsCount_not?: InputMaybe<Scalars['Int']>;
  projectsCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount?: InputMaybe<Scalars['Int']>;
  redeemCount_gt?: InputMaybe<Scalars['Int']>;
  redeemCount_gte?: InputMaybe<Scalars['Int']>;
  redeemCount_in?: InputMaybe<Array<Scalars['Int']>>;
  redeemCount_lt?: InputMaybe<Scalars['Int']>;
  redeemCount_lte?: InputMaybe<Scalars['Int']>;
  redeemCount_not?: InputMaybe<Scalars['Int']>;
  redeemCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  volumePaid?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_gte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumePaid_lt?: InputMaybe<Scalars['BigInt']>;
  volumePaid_lte?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not?: InputMaybe<Scalars['BigInt']>;
  volumePaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_gte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeRedeemed_lt?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_lte?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not?: InputMaybe<Scalars['BigInt']>;
  volumeRedeemed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum ProtocolV2Log_OrderBy {
  Erc20Count = 'erc20Count',
  Id = 'id',
  Log = 'log',
  PaymentsCount = 'paymentsCount',
  ProjectsCount = 'projectsCount',
  RedeemCount = 'redeemCount',
  VolumePaid = 'volumePaid',
  VolumeRedeemed = 'volumeRedeemed'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  deployETHERC20ProjectPayerEvent?: Maybe<DeployEtherc20ProjectPayerEvent>;
  deployETHERC20ProjectPayerEvents: Array<DeployEtherc20ProjectPayerEvent>;
  deployedERC20Event?: Maybe<DeployedErc20Event>;
  deployedERC20Events: Array<DeployedErc20Event>;
  distributePayoutsEvent?: Maybe<DistributePayoutsEvent>;
  distributePayoutsEvents: Array<DistributePayoutsEvent>;
  distributeReservedTokensEvent?: Maybe<DistributeReservedTokensEvent>;
  distributeReservedTokensEvents: Array<DistributeReservedTokensEvent>;
  distributeToPayoutModEvent?: Maybe<DistributeToPayoutModEvent>;
  distributeToPayoutModEvents: Array<DistributeToPayoutModEvent>;
  distributeToPayoutSplitEvent?: Maybe<DistributeToPayoutSplitEvent>;
  distributeToPayoutSplitEvents: Array<DistributeToPayoutSplitEvent>;
  distributeToReservedTokenSplitEvent?: Maybe<DistributeToReservedTokenSplitEvent>;
  distributeToReservedTokenSplitEvents: Array<DistributeToReservedTokenSplitEvent>;
  distributeToTicketModEvent?: Maybe<DistributeToTicketModEvent>;
  distributeToTicketModEvents: Array<DistributeToTicketModEvent>;
  ensnode?: Maybe<EnsNode>;
  ensnodes: Array<EnsNode>;
  etherc20ProjectPayer?: Maybe<Etherc20ProjectPayer>;
  etherc20ProjectPayers: Array<Etherc20ProjectPayer>;
  mintTokensEvent?: Maybe<MintTokensEvent>;
  mintTokensEvents: Array<MintTokensEvent>;
  participant?: Maybe<Participant>;
  participants: Array<Participant>;
  payEvent?: Maybe<PayEvent>;
  payEvents: Array<PayEvent>;
  printReservesEvent?: Maybe<PrintReservesEvent>;
  printReservesEvents: Array<PrintReservesEvent>;
  project?: Maybe<Project>;
  projectCreateEvent?: Maybe<ProjectCreateEvent>;
  projectCreateEvents: Array<ProjectCreateEvent>;
  projectEvent?: Maybe<ProjectEvent>;
  projectEvents: Array<ProjectEvent>;
  projectSearch: Array<Project>;
  projects: Array<Project>;
  protocolLog?: Maybe<ProtocolLog>;
  protocolLogs: Array<ProtocolLog>;
  protocolV1Log?: Maybe<ProtocolV1Log>;
  protocolV1Logs: Array<ProtocolV1Log>;
  protocolV2Log?: Maybe<ProtocolV2Log>;
  protocolV2Logs: Array<ProtocolV2Log>;
  redeemEvent?: Maybe<RedeemEvent>;
  redeemEvents: Array<RedeemEvent>;
  tapEvent?: Maybe<TapEvent>;
  tapEvents: Array<TapEvent>;
  useAllowanceEvent?: Maybe<UseAllowanceEvent>;
  useAllowanceEvents: Array<UseAllowanceEvent>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDeployEtherc20ProjectPayerEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDeployEtherc20ProjectPayerEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployEtherc20ProjectPayerEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DeployEtherc20ProjectPayerEvent_Filter>;
};


export type QueryDeployedErc20EventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDeployedErc20EventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployedErc20Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DeployedErc20Event_Filter>;
};


export type QueryDistributePayoutsEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributePayoutsEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributePayoutsEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributePayoutsEvent_Filter>;
};


export type QueryDistributeReservedTokensEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributeReservedTokensEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeReservedTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeReservedTokensEvent_Filter>;
};


export type QueryDistributeToPayoutModEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributeToPayoutModEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToPayoutModEvent_Filter>;
};


export type QueryDistributeToPayoutSplitEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributeToPayoutSplitEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
};


export type QueryDistributeToReservedTokenSplitEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributeToReservedTokenSplitEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToReservedTokenSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
};


export type QueryDistributeToTicketModEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDistributeToTicketModEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToTicketModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToTicketModEvent_Filter>;
};


export type QueryEnsnodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEnsnodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EnsNode_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<EnsNode_Filter>;
};


export type QueryEtherc20ProjectPayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEtherc20ProjectPayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Etherc20ProjectPayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Etherc20ProjectPayer_Filter>;
};


export type QueryMintTokensEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintTokensEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintTokensEvent_Filter>;
};


export type QueryParticipantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryParticipantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Participant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Participant_Filter>;
};


export type QueryPayEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPayEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayEvent_Filter>;
};


export type QueryPrintReservesEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPrintReservesEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PrintReservesEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrintReservesEvent_Filter>;
};


export type QueryProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectCreateEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectCreateEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectCreateEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectCreateEvent_Filter>;
};


export type QueryProjectEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectEvent_Filter>;
};


export type QueryProjectSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String'];
};


export type QueryProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type QueryProtocolLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolLog_Filter>;
};


export type QueryProtocolV1LogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolV1LogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolV1Log_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolV1Log_Filter>;
};


export type QueryProtocolV2LogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolV2LogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolV2Log_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolV2Log_Filter>;
};


export type QueryRedeemEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRedeemEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RedeemEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedeemEvent_Filter>;
};


export type QueryTapEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTapEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TapEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TapEvent_Filter>;
};


export type QueryUseAllowanceEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUseAllowanceEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UseAllowanceEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UseAllowanceEvent_Filter>;
};

export type RedeemEvent = {
  __typename?: 'RedeemEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  cv: Scalars['String'];
  holder: Scalars['Bytes'];
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['Int'];
  returnAmount: Scalars['BigInt'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type RedeemEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  cv?: InputMaybe<Scalars['String']>;
  cv_contains?: InputMaybe<Scalars['String']>;
  cv_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_ends_with?: InputMaybe<Scalars['String']>;
  cv_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_gt?: InputMaybe<Scalars['String']>;
  cv_gte?: InputMaybe<Scalars['String']>;
  cv_in?: InputMaybe<Array<Scalars['String']>>;
  cv_lt?: InputMaybe<Scalars['String']>;
  cv_lte?: InputMaybe<Scalars['String']>;
  cv_not?: InputMaybe<Scalars['String']>;
  cv_not_contains?: InputMaybe<Scalars['String']>;
  cv_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cv_not_ends_with?: InputMaybe<Scalars['String']>;
  cv_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cv_not_in?: InputMaybe<Array<Scalars['String']>>;
  cv_not_starts_with?: InputMaybe<Scalars['String']>;
  cv_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cv_starts_with?: InputMaybe<Scalars['String']>;
  cv_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder?: InputMaybe<Scalars['Bytes']>;
  holder_contains?: InputMaybe<Scalars['Bytes']>;
  holder_in?: InputMaybe<Array<Scalars['Bytes']>>;
  holder_not?: InputMaybe<Scalars['Bytes']>;
  holder_not_contains?: InputMaybe<Scalars['Bytes']>;
  holder_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  returnAmount?: InputMaybe<Scalars['BigInt']>;
  returnAmount_gt?: InputMaybe<Scalars['BigInt']>;
  returnAmount_gte?: InputMaybe<Scalars['BigInt']>;
  returnAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  returnAmount_lt?: InputMaybe<Scalars['BigInt']>;
  returnAmount_lte?: InputMaybe<Scalars['BigInt']>;
  returnAmount_not?: InputMaybe<Scalars['BigInt']>;
  returnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum RedeemEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  Cv = 'cv',
  Holder = 'holder',
  Id = 'id',
  Project = 'project',
  ProjectId = 'projectId',
  ReturnAmount = 'returnAmount',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  deployETHERC20ProjectPayerEvent?: Maybe<DeployEtherc20ProjectPayerEvent>;
  deployETHERC20ProjectPayerEvents: Array<DeployEtherc20ProjectPayerEvent>;
  deployedERC20Event?: Maybe<DeployedErc20Event>;
  deployedERC20Events: Array<DeployedErc20Event>;
  distributePayoutsEvent?: Maybe<DistributePayoutsEvent>;
  distributePayoutsEvents: Array<DistributePayoutsEvent>;
  distributeReservedTokensEvent?: Maybe<DistributeReservedTokensEvent>;
  distributeReservedTokensEvents: Array<DistributeReservedTokensEvent>;
  distributeToPayoutModEvent?: Maybe<DistributeToPayoutModEvent>;
  distributeToPayoutModEvents: Array<DistributeToPayoutModEvent>;
  distributeToPayoutSplitEvent?: Maybe<DistributeToPayoutSplitEvent>;
  distributeToPayoutSplitEvents: Array<DistributeToPayoutSplitEvent>;
  distributeToReservedTokenSplitEvent?: Maybe<DistributeToReservedTokenSplitEvent>;
  distributeToReservedTokenSplitEvents: Array<DistributeToReservedTokenSplitEvent>;
  distributeToTicketModEvent?: Maybe<DistributeToTicketModEvent>;
  distributeToTicketModEvents: Array<DistributeToTicketModEvent>;
  ensnode?: Maybe<EnsNode>;
  ensnodes: Array<EnsNode>;
  etherc20ProjectPayer?: Maybe<Etherc20ProjectPayer>;
  etherc20ProjectPayers: Array<Etherc20ProjectPayer>;
  mintTokensEvent?: Maybe<MintTokensEvent>;
  mintTokensEvents: Array<MintTokensEvent>;
  participant?: Maybe<Participant>;
  participants: Array<Participant>;
  payEvent?: Maybe<PayEvent>;
  payEvents: Array<PayEvent>;
  printReservesEvent?: Maybe<PrintReservesEvent>;
  printReservesEvents: Array<PrintReservesEvent>;
  project?: Maybe<Project>;
  projectCreateEvent?: Maybe<ProjectCreateEvent>;
  projectCreateEvents: Array<ProjectCreateEvent>;
  projectEvent?: Maybe<ProjectEvent>;
  projectEvents: Array<ProjectEvent>;
  projects: Array<Project>;
  protocolLog?: Maybe<ProtocolLog>;
  protocolLogs: Array<ProtocolLog>;
  protocolV1Log?: Maybe<ProtocolV1Log>;
  protocolV1Logs: Array<ProtocolV1Log>;
  protocolV2Log?: Maybe<ProtocolV2Log>;
  protocolV2Logs: Array<ProtocolV2Log>;
  redeemEvent?: Maybe<RedeemEvent>;
  redeemEvents: Array<RedeemEvent>;
  tapEvent?: Maybe<TapEvent>;
  tapEvents: Array<TapEvent>;
  useAllowanceEvent?: Maybe<UseAllowanceEvent>;
  useAllowanceEvents: Array<UseAllowanceEvent>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDeployEtherc20ProjectPayerEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDeployEtherc20ProjectPayerEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployEtherc20ProjectPayerEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DeployEtherc20ProjectPayerEvent_Filter>;
};


export type SubscriptionDeployedErc20EventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDeployedErc20EventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeployedErc20Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DeployedErc20Event_Filter>;
};


export type SubscriptionDistributePayoutsEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributePayoutsEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributePayoutsEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributePayoutsEvent_Filter>;
};


export type SubscriptionDistributeReservedTokensEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributeReservedTokensEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeReservedTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeReservedTokensEvent_Filter>;
};


export type SubscriptionDistributeToPayoutModEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributeToPayoutModEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToPayoutModEvent_Filter>;
};


export type SubscriptionDistributeToPayoutSplitEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributeToPayoutSplitEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToPayoutSplitEvent_Filter>;
};


export type SubscriptionDistributeToReservedTokenSplitEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributeToReservedTokenSplitEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToReservedTokenSplitEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToReservedTokenSplitEvent_Filter>;
};


export type SubscriptionDistributeToTicketModEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDistributeToTicketModEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToTicketModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeToTicketModEvent_Filter>;
};


export type SubscriptionEnsnodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEnsnodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EnsNode_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<EnsNode_Filter>;
};


export type SubscriptionEtherc20ProjectPayerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEtherc20ProjectPayersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Etherc20ProjectPayer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Etherc20ProjectPayer_Filter>;
};


export type SubscriptionMintTokensEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintTokensEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintTokensEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintTokensEvent_Filter>;
};


export type SubscriptionParticipantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionParticipantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Participant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Participant_Filter>;
};


export type SubscriptionPayEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPayEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayEvent_Filter>;
};


export type SubscriptionPrintReservesEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPrintReservesEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PrintReservesEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrintReservesEvent_Filter>;
};


export type SubscriptionProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectCreateEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectCreateEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectCreateEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectCreateEvent_Filter>;
};


export type SubscriptionProjectEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectEvent_Filter>;
};


export type SubscriptionProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type SubscriptionProtocolLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProtocolLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolLog_Filter>;
};


export type SubscriptionProtocolV1LogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProtocolV1LogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolV1Log_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolV1Log_Filter>;
};


export type SubscriptionProtocolV2LogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProtocolV2LogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolV2Log_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolV2Log_Filter>;
};


export type SubscriptionRedeemEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRedeemEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RedeemEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedeemEvent_Filter>;
};


export type SubscriptionTapEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTapEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TapEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TapEvent_Filter>;
};


export type SubscriptionUseAllowanceEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUseAllowanceEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UseAllowanceEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UseAllowanceEvent_Filter>;
};

export type TapEvent = {
  __typename?: 'TapEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  beneficiaryTransferAmount: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  currency: Scalars['BigInt'];
  distributions: Array<DistributeToPayoutModEvent>;
  fundingCycleId: Scalars['BigInt'];
  govFeeAmount: Scalars['BigInt'];
  id: Scalars['ID'];
  netTransferAmount: Scalars['BigInt'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};


export type TapEventDistributionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeToPayoutModEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeToPayoutModEvent_Filter>;
};

export type TapEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiaryTransferAmount?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_gt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_gte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiaryTransferAmount_lt?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_lte?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_not?: InputMaybe<Scalars['BigInt']>;
  beneficiaryTransferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currency?: InputMaybe<Scalars['BigInt']>;
  currency_gt?: InputMaybe<Scalars['BigInt']>;
  currency_gte?: InputMaybe<Scalars['BigInt']>;
  currency_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currency_lt?: InputMaybe<Scalars['BigInt']>;
  currency_lte?: InputMaybe<Scalars['BigInt']>;
  currency_not?: InputMaybe<Scalars['BigInt']>;
  currency_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  distributions_?: InputMaybe<DistributeToPayoutModEvent_Filter>;
  fundingCycleId?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleId_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  govFeeAmount?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_gt?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_gte?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  govFeeAmount_lt?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_lte?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_not?: InputMaybe<Scalars['BigInt']>;
  govFeeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  netTransferAmount?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_gt?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_gte?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  netTransferAmount_lt?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_lte?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_not?: InputMaybe<Scalars['BigInt']>;
  netTransferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum TapEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  BeneficiaryTransferAmount = 'beneficiaryTransferAmount',
  Caller = 'caller',
  Currency = 'currency',
  Distributions = 'distributions',
  FundingCycleId = 'fundingCycleId',
  GovFeeAmount = 'govFeeAmount',
  Id = 'id',
  NetTransferAmount = 'netTransferAmount',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type UseAllowanceEvent = {
  __typename?: 'UseAllowanceEvent';
  amount: Scalars['BigInt'];
  beneficiary: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  distributedAmount: Scalars['BigInt'];
  fundingCycleConfiguration: Scalars['BigInt'];
  fundingCycleNumber: Scalars['Int'];
  id: Scalars['ID'];
  memo: Scalars['String'];
  netDistributedamount: Scalars['BigInt'];
  project: Project;
  projectId: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
};

export type UseAllowanceEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  distributedAmount?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_gt?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_gte?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  distributedAmount_lt?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_lte?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_not?: InputMaybe<Scalars['BigInt']>;
  distributedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleConfiguration?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_gt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_gte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleConfiguration_lt?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_lte?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_not?: InputMaybe<Scalars['BigInt']>;
  fundingCycleConfiguration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingCycleNumber?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_gte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingCycleNumber_lt?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_lte?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not?: InputMaybe<Scalars['Int']>;
  fundingCycleNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  memo?: InputMaybe<Scalars['String']>;
  memo_contains?: InputMaybe<Scalars['String']>;
  memo_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_ends_with?: InputMaybe<Scalars['String']>;
  memo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_gt?: InputMaybe<Scalars['String']>;
  memo_gte?: InputMaybe<Scalars['String']>;
  memo_in?: InputMaybe<Array<Scalars['String']>>;
  memo_lt?: InputMaybe<Scalars['String']>;
  memo_lte?: InputMaybe<Scalars['String']>;
  memo_not?: InputMaybe<Scalars['String']>;
  memo_not_contains?: InputMaybe<Scalars['String']>;
  memo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  memo_not_ends_with?: InputMaybe<Scalars['String']>;
  memo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  memo_not_in?: InputMaybe<Array<Scalars['String']>>;
  memo_not_starts_with?: InputMaybe<Scalars['String']>;
  memo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  memo_starts_with?: InputMaybe<Scalars['String']>;
  memo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  netDistributedamount?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_gt?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_gte?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  netDistributedamount_lt?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_lte?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_not?: InputMaybe<Scalars['BigInt']>;
  netDistributedamount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  project?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['Int']>;
  projectId_gt?: InputMaybe<Scalars['Int']>;
  projectId_gte?: InputMaybe<Scalars['Int']>;
  projectId_in?: InputMaybe<Array<Scalars['Int']>>;
  projectId_lt?: InputMaybe<Scalars['Int']>;
  projectId_lte?: InputMaybe<Scalars['Int']>;
  projectId_not?: InputMaybe<Scalars['Int']>;
  projectId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']>;
  project_contains_nocase?: InputMaybe<Scalars['String']>;
  project_ends_with?: InputMaybe<Scalars['String']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_gt?: InputMaybe<Scalars['String']>;
  project_gte?: InputMaybe<Scalars['String']>;
  project_in?: InputMaybe<Array<Scalars['String']>>;
  project_lt?: InputMaybe<Scalars['String']>;
  project_lte?: InputMaybe<Scalars['String']>;
  project_not?: InputMaybe<Scalars['String']>;
  project_not_contains?: InputMaybe<Scalars['String']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']>;
  project_not_ends_with?: InputMaybe<Scalars['String']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  project_not_in?: InputMaybe<Array<Scalars['String']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  project_starts_with?: InputMaybe<Scalars['String']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UseAllowanceEvent_OrderBy {
  Amount = 'amount',
  Beneficiary = 'beneficiary',
  Caller = 'caller',
  DistributedAmount = 'distributedAmount',
  FundingCycleConfiguration = 'fundingCycleConfiguration',
  FundingCycleNumber = 'fundingCycleNumber',
  Id = 'id',
  Memo = 'memo',
  NetDistributedamount = 'netDistributedamount',
  Project = 'project',
  ProjectId = 'projectId',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Timestamp of the block if available, format depends on the chain */
  timestamp?: Maybe<Scalars['String']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type ProjectsQueryVariables = Exact<{
  where?: InputMaybe<Project_Filter>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', projectId: number, metadataUri?: string | null, handle?: string | null }> };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_Height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  DeployETHERC20ProjectPayerEvent: ResolverTypeWrapper<DeployEtherc20ProjectPayerEvent>;
  DeployETHERC20ProjectPayerEvent_filter: DeployEtherc20ProjectPayerEvent_Filter;
  DeployETHERC20ProjectPayerEvent_orderBy: DeployEtherc20ProjectPayerEvent_OrderBy;
  DeployedERC20Event: ResolverTypeWrapper<DeployedErc20Event>;
  DeployedERC20Event_filter: DeployedErc20Event_Filter;
  DeployedERC20Event_orderBy: DeployedErc20Event_OrderBy;
  DistributePayoutsEvent: ResolverTypeWrapper<DistributePayoutsEvent>;
  DistributePayoutsEvent_filter: DistributePayoutsEvent_Filter;
  DistributePayoutsEvent_orderBy: DistributePayoutsEvent_OrderBy;
  DistributeReservedTokensEvent: ResolverTypeWrapper<DistributeReservedTokensEvent>;
  DistributeReservedTokensEvent_filter: DistributeReservedTokensEvent_Filter;
  DistributeReservedTokensEvent_orderBy: DistributeReservedTokensEvent_OrderBy;
  DistributeToPayoutModEvent: ResolverTypeWrapper<DistributeToPayoutModEvent>;
  DistributeToPayoutModEvent_filter: DistributeToPayoutModEvent_Filter;
  DistributeToPayoutModEvent_orderBy: DistributeToPayoutModEvent_OrderBy;
  DistributeToPayoutSplitEvent: ResolverTypeWrapper<DistributeToPayoutSplitEvent>;
  DistributeToPayoutSplitEvent_filter: DistributeToPayoutSplitEvent_Filter;
  DistributeToPayoutSplitEvent_orderBy: DistributeToPayoutSplitEvent_OrderBy;
  DistributeToReservedTokenSplitEvent: ResolverTypeWrapper<DistributeToReservedTokenSplitEvent>;
  DistributeToReservedTokenSplitEvent_filter: DistributeToReservedTokenSplitEvent_Filter;
  DistributeToReservedTokenSplitEvent_orderBy: DistributeToReservedTokenSplitEvent_OrderBy;
  DistributeToTicketModEvent: ResolverTypeWrapper<DistributeToTicketModEvent>;
  DistributeToTicketModEvent_filter: DistributeToTicketModEvent_Filter;
  DistributeToTicketModEvent_orderBy: DistributeToTicketModEvent_OrderBy;
  ENSNode: ResolverTypeWrapper<EnsNode>;
  ENSNode_filter: EnsNode_Filter;
  ENSNode_orderBy: EnsNode_OrderBy;
  ETHERC20ProjectPayer: ResolverTypeWrapper<Etherc20ProjectPayer>;
  ETHERC20ProjectPayer_filter: Etherc20ProjectPayer_Filter;
  ETHERC20ProjectPayer_orderBy: Etherc20ProjectPayer_OrderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MintTokensEvent: ResolverTypeWrapper<MintTokensEvent>;
  MintTokensEvent_filter: MintTokensEvent_Filter;
  MintTokensEvent_orderBy: MintTokensEvent_OrderBy;
  OrderDirection: OrderDirection;
  Participant: ResolverTypeWrapper<Participant>;
  Participant_filter: Participant_Filter;
  Participant_orderBy: Participant_OrderBy;
  PayEvent: ResolverTypeWrapper<PayEvent>;
  PayEvent_filter: PayEvent_Filter;
  PayEvent_orderBy: PayEvent_OrderBy;
  PrintReservesEvent: ResolverTypeWrapper<PrintReservesEvent>;
  PrintReservesEvent_filter: PrintReservesEvent_Filter;
  PrintReservesEvent_orderBy: PrintReservesEvent_OrderBy;
  Project: ResolverTypeWrapper<Project>;
  ProjectCreateEvent: ResolverTypeWrapper<ProjectCreateEvent>;
  ProjectCreateEvent_filter: ProjectCreateEvent_Filter;
  ProjectCreateEvent_orderBy: ProjectCreateEvent_OrderBy;
  ProjectEvent: ResolverTypeWrapper<ProjectEvent>;
  ProjectEvent_filter: ProjectEvent_Filter;
  ProjectEvent_orderBy: ProjectEvent_OrderBy;
  Project_filter: Project_Filter;
  Project_orderBy: Project_OrderBy;
  ProtocolLog: ResolverTypeWrapper<ProtocolLog>;
  ProtocolLog_filter: ProtocolLog_Filter;
  ProtocolLog_orderBy: ProtocolLog_OrderBy;
  ProtocolV1Log: ResolverTypeWrapper<ProtocolV1Log>;
  ProtocolV1Log_filter: ProtocolV1Log_Filter;
  ProtocolV1Log_orderBy: ProtocolV1Log_OrderBy;
  ProtocolV2Log: ResolverTypeWrapper<ProtocolV2Log>;
  ProtocolV2Log_filter: ProtocolV2Log_Filter;
  ProtocolV2Log_orderBy: ProtocolV2Log_OrderBy;
  Query: ResolverTypeWrapper<{}>;
  RedeemEvent: ResolverTypeWrapper<RedeemEvent>;
  RedeemEvent_filter: RedeemEvent_Filter;
  RedeemEvent_orderBy: RedeemEvent_OrderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  TapEvent: ResolverTypeWrapper<TapEvent>;
  TapEvent_filter: TapEvent_Filter;
  TapEvent_orderBy: TapEvent_OrderBy;
  UseAllowanceEvent: ResolverTypeWrapper<UseAllowanceEvent>;
  UseAllowanceEvent_filter: UseAllowanceEvent_Filter;
  UseAllowanceEvent_orderBy: UseAllowanceEvent_OrderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_Height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  DeployETHERC20ProjectPayerEvent: DeployEtherc20ProjectPayerEvent;
  DeployETHERC20ProjectPayerEvent_filter: DeployEtherc20ProjectPayerEvent_Filter;
  DeployedERC20Event: DeployedErc20Event;
  DeployedERC20Event_filter: DeployedErc20Event_Filter;
  DistributePayoutsEvent: DistributePayoutsEvent;
  DistributePayoutsEvent_filter: DistributePayoutsEvent_Filter;
  DistributeReservedTokensEvent: DistributeReservedTokensEvent;
  DistributeReservedTokensEvent_filter: DistributeReservedTokensEvent_Filter;
  DistributeToPayoutModEvent: DistributeToPayoutModEvent;
  DistributeToPayoutModEvent_filter: DistributeToPayoutModEvent_Filter;
  DistributeToPayoutSplitEvent: DistributeToPayoutSplitEvent;
  DistributeToPayoutSplitEvent_filter: DistributeToPayoutSplitEvent_Filter;
  DistributeToReservedTokenSplitEvent: DistributeToReservedTokenSplitEvent;
  DistributeToReservedTokenSplitEvent_filter: DistributeToReservedTokenSplitEvent_Filter;
  DistributeToTicketModEvent: DistributeToTicketModEvent;
  DistributeToTicketModEvent_filter: DistributeToTicketModEvent_Filter;
  ENSNode: EnsNode;
  ENSNode_filter: EnsNode_Filter;
  ETHERC20ProjectPayer: Etherc20ProjectPayer;
  ETHERC20ProjectPayer_filter: Etherc20ProjectPayer_Filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  MintTokensEvent: MintTokensEvent;
  MintTokensEvent_filter: MintTokensEvent_Filter;
  Participant: Participant;
  Participant_filter: Participant_Filter;
  PayEvent: PayEvent;
  PayEvent_filter: PayEvent_Filter;
  PrintReservesEvent: PrintReservesEvent;
  PrintReservesEvent_filter: PrintReservesEvent_Filter;
  Project: Project;
  ProjectCreateEvent: ProjectCreateEvent;
  ProjectCreateEvent_filter: ProjectCreateEvent_Filter;
  ProjectEvent: ProjectEvent;
  ProjectEvent_filter: ProjectEvent_Filter;
  Project_filter: Project_Filter;
  ProtocolLog: ProtocolLog;
  ProtocolLog_filter: ProtocolLog_Filter;
  ProtocolV1Log: ProtocolV1Log;
  ProtocolV1Log_filter: ProtocolV1Log_Filter;
  ProtocolV2Log: ProtocolV2Log;
  ProtocolV2Log_filter: ProtocolV2Log_Filter;
  Query: {};
  RedeemEvent: RedeemEvent;
  RedeemEvent_filter: RedeemEvent_Filter;
  String: Scalars['String'];
  Subscription: {};
  TapEvent: TapEvent;
  TapEvent_filter: TapEvent_Filter;
  UseAllowanceEvent: UseAllowanceEvent;
  UseAllowanceEvent_filter: UseAllowanceEvent_Filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
};

export type DerivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type DerivedFromDirectiveResolver<Result, Parent, ContextType = any, Args = DerivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = { };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SubgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type SubgraphIdDirectiveResolver<Result, Parent, ContextType = any, Args = SubgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type DeployEtherc20ProjectPayerEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeployETHERC20ProjectPayerEvent'] = ResolversParentTypes['DeployETHERC20ProjectPayerEvent']> = {
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  directory?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  preferAddToBalance?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  preferClaimedTokens?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeployedErc20EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeployedERC20Event'] = ResolversParentTypes['DeployedERC20Event']> = {
  address?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributePayoutsEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributePayoutsEvent'] = ResolversParentTypes['DistributePayoutsEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiaryDistributionAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  distributedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fundingCycleConfiguration?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fundingCycleNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  splitDistributions?: Resolver<Array<ResolversTypes['DistributeToPayoutSplitEvent']>, ParentType, ContextType, RequireFields<DistributePayoutsEventSplitDistributionsArgs, 'first' | 'skip'>>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributeReservedTokensEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributeReservedTokensEvent'] = ResolversParentTypes['DistributeReservedTokensEvent']> = {
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiaryTokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  fundingCycleNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  splitDistributions?: Resolver<Array<ResolversTypes['DistributeToReservedTokenSplitEvent']>, ParentType, ContextType, RequireFields<DistributeReservedTokensEventSplitDistributionsArgs, 'first' | 'skip'>>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributeToPayoutModEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributeToPayoutModEvent'] = ResolversParentTypes['DistributeToPayoutModEvent']> = {
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  fundingCycleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modAllocator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  modBeneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  modCut?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  modPreferUnstaked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  modProjectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tapEvent?: Resolver<ResolversTypes['TapEvent'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributeToPayoutSplitEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributeToPayoutSplitEvent'] = ResolversParentTypes['DistributeToPayoutSplitEvent']> = {
  allocator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  distributePayoutsEvent?: Resolver<ResolversTypes['DistributePayoutsEvent'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  group?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lockedUntil?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  preferAddToBalance?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  preferClaimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  splitProjectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributeToReservedTokenSplitEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributeToReservedTokenSplitEvent'] = ResolversParentTypes['DistributeToReservedTokenSplitEvent']> = {
  allocator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  distributeReservedTokensEvent?: Resolver<ResolversTypes['DistributeReservedTokensEvent'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lockedUntil?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  preferClaimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  splitProjectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DistributeToTicketModEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DistributeToTicketModEvent'] = ResolversParentTypes['DistributeToTicketModEvent']> = {
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  fundingCycleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modBeneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  modCut?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  modPreferUnstaked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  printReservesEvent?: Resolver<ResolversTypes['PrintReservesEvent'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnsNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ENSNode'] = ResolversParentTypes['ENSNode']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Etherc20ProjectPayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ETHERC20ProjectPayer'] = ResolversParentTypes['ETHERC20ProjectPayer']> = {
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  directory?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  preferAddToBalance?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  preferClaimedTokens?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MintTokensEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['MintTokensEvent'] = ResolversParentTypes['MintTokensEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParticipantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Participant'] = ResolversParentTypes['Participant']> = {
  balance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastPaidTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stakedBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalPaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  unstakedBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  wallet?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PayEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PayEvent'] = ResolversParentTypes['PayEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feeFromV2Project?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PrintReservesEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PrintReservesEvent'] = ResolversParentTypes['PrintReservesEvent']> = {
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiaryTicketAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  distributions?: Resolver<Array<ResolversTypes['DistributeToTicketModEvent']>, ParentType, ContextType, RequireFields<PrintReservesEventDistributionsArgs, 'first' | 'skip'>>;
  fundingCycleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  currentBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deployedERC20Events?: Resolver<Array<ResolversTypes['DeployedERC20Event']>, ParentType, ContextType, RequireFields<ProjectDeployedErc20EventsArgs, 'first' | 'skip'>>;
  deployedERC20s?: Resolver<Array<ResolversTypes['DeployedERC20Event']>, ParentType, ContextType, RequireFields<ProjectDeployedErc20sArgs, 'first' | 'skip'>>;
  distributePayoutsEvents?: Resolver<Array<ResolversTypes['DistributePayoutsEvent']>, ParentType, ContextType, RequireFields<ProjectDistributePayoutsEventsArgs, 'first' | 'skip'>>;
  distributeReservedTokensEvents?: Resolver<Array<ResolversTypes['DistributeReservedTokensEvent']>, ParentType, ContextType, RequireFields<ProjectDistributeReservedTokensEventsArgs, 'first' | 'skip'>>;
  distributeToPayoutModEvents?: Resolver<Array<ResolversTypes['DistributeToPayoutModEvent']>, ParentType, ContextType, RequireFields<ProjectDistributeToPayoutModEventsArgs, 'first' | 'skip'>>;
  distributeToPayoutSplitEvents?: Resolver<Array<ResolversTypes['DistributeToPayoutSplitEvent']>, ParentType, ContextType, RequireFields<ProjectDistributeToPayoutSplitEventsArgs, 'first' | 'skip'>>;
  distributeToReservedTokenSplitEvents?: Resolver<Array<ResolversTypes['DistributeToReservedTokenSplitEvent']>, ParentType, ContextType, RequireFields<ProjectDistributeToReservedTokenSplitEventsArgs, 'first' | 'skip'>>;
  distributeToTicketModEvents?: Resolver<Array<ResolversTypes['DistributeToTicketModEvent']>, ParentType, ContextType, RequireFields<ProjectDistributeToTicketModEventsArgs, 'first' | 'skip'>>;
  ethErc20ProjectPayers?: Resolver<Array<ResolversTypes['ETHERC20ProjectPayer']>, ParentType, ContextType, RequireFields<ProjectEthErc20ProjectPayersArgs, 'first' | 'skip'>>;
  handle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadataDomain?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  metadataUri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mintTokensEvents?: Resolver<Array<ResolversTypes['MintTokensEvent']>, ParentType, ContextType, RequireFields<ProjectMintTokensEventsArgs, 'first' | 'skip'>>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<ProjectParticipantsArgs, 'first' | 'skip'>>;
  payEvents?: Resolver<Array<ResolversTypes['PayEvent']>, ParentType, ContextType, RequireFields<ProjectPayEventsArgs, 'first' | 'skip'>>;
  printReservesEvents?: Resolver<Array<ResolversTypes['PrintReservesEvent']>, ParentType, ContextType, RequireFields<ProjectPrintReservesEventsArgs, 'first' | 'skip'>>;
  projectEvents?: Resolver<Array<ResolversTypes['ProjectEvent']>, ParentType, ContextType, RequireFields<ProjectProjectEventsArgs, 'first' | 'skip'>>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  redeemEvents?: Resolver<Array<ResolversTypes['RedeemEvent']>, ParentType, ContextType, RequireFields<ProjectRedeemEventsArgs, 'first' | 'skip'>>;
  tapEvents?: Resolver<Array<ResolversTypes['TapEvent']>, ParentType, ContextType, RequireFields<ProjectTapEventsArgs, 'first' | 'skip'>>;
  terminal?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  totalPaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalRedeemed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  useAllowanceEvents?: Resolver<Array<ResolversTypes['UseAllowanceEvent']>, ParentType, ContextType, RequireFields<ProjectUseAllowanceEventsArgs, 'first' | 'skip'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectCreateEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectCreateEvent'] = ResolversParentTypes['ProjectCreateEvent']> = {
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectEvent'] = ResolversParentTypes['ProjectEvent']> = {
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deployETHERC20ProjectPayerEvent?: Resolver<Maybe<ResolversTypes['DeployETHERC20ProjectPayerEvent']>, ParentType, ContextType>;
  deployedERC20Event?: Resolver<Maybe<ResolversTypes['DeployedERC20Event']>, ParentType, ContextType>;
  distributePayoutsEvent?: Resolver<Maybe<ResolversTypes['DistributePayoutsEvent']>, ParentType, ContextType>;
  distributeReservedTokensEvent?: Resolver<Maybe<ResolversTypes['DistributeReservedTokensEvent']>, ParentType, ContextType>;
  distributeToPayoutModEvent?: Resolver<Maybe<ResolversTypes['DistributeToPayoutModEvent']>, ParentType, ContextType>;
  distributeToPayoutSplitEvent?: Resolver<Maybe<ResolversTypes['DistributeToPayoutSplitEvent']>, ParentType, ContextType>;
  distributeToReservedTokenSplitEvent?: Resolver<Maybe<ResolversTypes['DistributeToReservedTokenSplitEvent']>, ParentType, ContextType>;
  distributeToTicketModEvent?: Resolver<Maybe<ResolversTypes['DistributeToTicketModEvent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mintTokensEvent?: Resolver<Maybe<ResolversTypes['MintTokensEvent']>, ParentType, ContextType>;
  payEvent?: Resolver<Maybe<ResolversTypes['PayEvent']>, ParentType, ContextType>;
  printReservesEvent?: Resolver<Maybe<ResolversTypes['PrintReservesEvent']>, ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectCreateEvent?: Resolver<Maybe<ResolversTypes['ProjectCreateEvent']>, ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  redeemEvent?: Resolver<Maybe<ResolversTypes['RedeemEvent']>, ParentType, ContextType>;
  tapEvent?: Resolver<Maybe<ResolversTypes['TapEvent']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  useAllowanceEvent?: Resolver<Maybe<ResolversTypes['UseAllowanceEvent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProtocolLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProtocolLog'] = ResolversParentTypes['ProtocolLog']> = {
  erc20Count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  redeemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  v1?: Resolver<Maybe<ResolversTypes['ProtocolV1Log']>, ParentType, ContextType>;
  v2?: Resolver<Maybe<ResolversTypes['ProtocolV2Log']>, ParentType, ContextType>;
  volumePaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeRedeemed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProtocolV1LogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProtocolV1Log'] = ResolversParentTypes['ProtocolV1Log']> = {
  erc20Count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  log?: Resolver<ResolversTypes['ProtocolLog'], ParentType, ContextType>;
  paymentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  redeemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volumePaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeRedeemed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProtocolV2LogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProtocolV2Log'] = ResolversParentTypes['ProtocolV2Log']> = {
  erc20Count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  log?: Resolver<ResolversTypes['ProtocolLog'], ParentType, ContextType>;
  paymentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  redeemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volumePaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeRedeemed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_MetaArgs>>;
  deployETHERC20ProjectPayerEvent?: Resolver<Maybe<ResolversTypes['DeployETHERC20ProjectPayerEvent']>, ParentType, ContextType, RequireFields<QueryDeployEtherc20ProjectPayerEventArgs, 'id' | 'subgraphError'>>;
  deployETHERC20ProjectPayerEvents?: Resolver<Array<ResolversTypes['DeployETHERC20ProjectPayerEvent']>, ParentType, ContextType, RequireFields<QueryDeployEtherc20ProjectPayerEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  deployedERC20Event?: Resolver<Maybe<ResolversTypes['DeployedERC20Event']>, ParentType, ContextType, RequireFields<QueryDeployedErc20EventArgs, 'id' | 'subgraphError'>>;
  deployedERC20Events?: Resolver<Array<ResolversTypes['DeployedERC20Event']>, ParentType, ContextType, RequireFields<QueryDeployedErc20EventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributePayoutsEvent?: Resolver<Maybe<ResolversTypes['DistributePayoutsEvent']>, ParentType, ContextType, RequireFields<QueryDistributePayoutsEventArgs, 'id' | 'subgraphError'>>;
  distributePayoutsEvents?: Resolver<Array<ResolversTypes['DistributePayoutsEvent']>, ParentType, ContextType, RequireFields<QueryDistributePayoutsEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeReservedTokensEvent?: Resolver<Maybe<ResolversTypes['DistributeReservedTokensEvent']>, ParentType, ContextType, RequireFields<QueryDistributeReservedTokensEventArgs, 'id' | 'subgraphError'>>;
  distributeReservedTokensEvents?: Resolver<Array<ResolversTypes['DistributeReservedTokensEvent']>, ParentType, ContextType, RequireFields<QueryDistributeReservedTokensEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToPayoutModEvent?: Resolver<Maybe<ResolversTypes['DistributeToPayoutModEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToPayoutModEventArgs, 'id' | 'subgraphError'>>;
  distributeToPayoutModEvents?: Resolver<Array<ResolversTypes['DistributeToPayoutModEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToPayoutModEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToPayoutSplitEvent?: Resolver<Maybe<ResolversTypes['DistributeToPayoutSplitEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToPayoutSplitEventArgs, 'id' | 'subgraphError'>>;
  distributeToPayoutSplitEvents?: Resolver<Array<ResolversTypes['DistributeToPayoutSplitEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToPayoutSplitEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToReservedTokenSplitEvent?: Resolver<Maybe<ResolversTypes['DistributeToReservedTokenSplitEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToReservedTokenSplitEventArgs, 'id' | 'subgraphError'>>;
  distributeToReservedTokenSplitEvents?: Resolver<Array<ResolversTypes['DistributeToReservedTokenSplitEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToReservedTokenSplitEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToTicketModEvent?: Resolver<Maybe<ResolversTypes['DistributeToTicketModEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToTicketModEventArgs, 'id' | 'subgraphError'>>;
  distributeToTicketModEvents?: Resolver<Array<ResolversTypes['DistributeToTicketModEvent']>, ParentType, ContextType, RequireFields<QueryDistributeToTicketModEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  ensnode?: Resolver<Maybe<ResolversTypes['ENSNode']>, ParentType, ContextType, RequireFields<QueryEnsnodeArgs, 'id' | 'subgraphError'>>;
  ensnodes?: Resolver<Array<ResolversTypes['ENSNode']>, ParentType, ContextType, RequireFields<QueryEnsnodesArgs, 'first' | 'skip' | 'subgraphError'>>;
  etherc20ProjectPayer?: Resolver<Maybe<ResolversTypes['ETHERC20ProjectPayer']>, ParentType, ContextType, RequireFields<QueryEtherc20ProjectPayerArgs, 'id' | 'subgraphError'>>;
  etherc20ProjectPayers?: Resolver<Array<ResolversTypes['ETHERC20ProjectPayer']>, ParentType, ContextType, RequireFields<QueryEtherc20ProjectPayersArgs, 'first' | 'skip' | 'subgraphError'>>;
  mintTokensEvent?: Resolver<Maybe<ResolversTypes['MintTokensEvent']>, ParentType, ContextType, RequireFields<QueryMintTokensEventArgs, 'id' | 'subgraphError'>>;
  mintTokensEvents?: Resolver<Array<ResolversTypes['MintTokensEvent']>, ParentType, ContextType, RequireFields<QueryMintTokensEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  participant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<QueryParticipantArgs, 'id' | 'subgraphError'>>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<QueryParticipantsArgs, 'first' | 'skip' | 'subgraphError'>>;
  payEvent?: Resolver<Maybe<ResolversTypes['PayEvent']>, ParentType, ContextType, RequireFields<QueryPayEventArgs, 'id' | 'subgraphError'>>;
  payEvents?: Resolver<Array<ResolversTypes['PayEvent']>, ParentType, ContextType, RequireFields<QueryPayEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  printReservesEvent?: Resolver<Maybe<ResolversTypes['PrintReservesEvent']>, ParentType, ContextType, RequireFields<QueryPrintReservesEventArgs, 'id' | 'subgraphError'>>;
  printReservesEvents?: Resolver<Array<ResolversTypes['PrintReservesEvent']>, ParentType, ContextType, RequireFields<QueryPrintReservesEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id' | 'subgraphError'>>;
  projectCreateEvent?: Resolver<Maybe<ResolversTypes['ProjectCreateEvent']>, ParentType, ContextType, RequireFields<QueryProjectCreateEventArgs, 'id' | 'subgraphError'>>;
  projectCreateEvents?: Resolver<Array<ResolversTypes['ProjectCreateEvent']>, ParentType, ContextType, RequireFields<QueryProjectCreateEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  projectEvent?: Resolver<Maybe<ResolversTypes['ProjectEvent']>, ParentType, ContextType, RequireFields<QueryProjectEventArgs, 'id' | 'subgraphError'>>;
  projectEvents?: Resolver<Array<ResolversTypes['ProjectEvent']>, ParentType, ContextType, RequireFields<QueryProjectEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  projectSearch?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectSearchArgs, 'first' | 'skip' | 'subgraphError' | 'text'>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolLog?: Resolver<Maybe<ResolversTypes['ProtocolLog']>, ParentType, ContextType, RequireFields<QueryProtocolLogArgs, 'id' | 'subgraphError'>>;
  protocolLogs?: Resolver<Array<ResolversTypes['ProtocolLog']>, ParentType, ContextType, RequireFields<QueryProtocolLogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolV1Log?: Resolver<Maybe<ResolversTypes['ProtocolV1Log']>, ParentType, ContextType, RequireFields<QueryProtocolV1LogArgs, 'id' | 'subgraphError'>>;
  protocolV1Logs?: Resolver<Array<ResolversTypes['ProtocolV1Log']>, ParentType, ContextType, RequireFields<QueryProtocolV1LogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolV2Log?: Resolver<Maybe<ResolversTypes['ProtocolV2Log']>, ParentType, ContextType, RequireFields<QueryProtocolV2LogArgs, 'id' | 'subgraphError'>>;
  protocolV2Logs?: Resolver<Array<ResolversTypes['ProtocolV2Log']>, ParentType, ContextType, RequireFields<QueryProtocolV2LogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  redeemEvent?: Resolver<Maybe<ResolversTypes['RedeemEvent']>, ParentType, ContextType, RequireFields<QueryRedeemEventArgs, 'id' | 'subgraphError'>>;
  redeemEvents?: Resolver<Array<ResolversTypes['RedeemEvent']>, ParentType, ContextType, RequireFields<QueryRedeemEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  tapEvent?: Resolver<Maybe<ResolversTypes['TapEvent']>, ParentType, ContextType, RequireFields<QueryTapEventArgs, 'id' | 'subgraphError'>>;
  tapEvents?: Resolver<Array<ResolversTypes['TapEvent']>, ParentType, ContextType, RequireFields<QueryTapEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  useAllowanceEvent?: Resolver<Maybe<ResolversTypes['UseAllowanceEvent']>, ParentType, ContextType, RequireFields<QueryUseAllowanceEventArgs, 'id' | 'subgraphError'>>;
  useAllowanceEvents?: Resolver<Array<ResolversTypes['UseAllowanceEvent']>, ParentType, ContextType, RequireFields<QueryUseAllowanceEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
};

export type RedeemEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['RedeemEvent'] = ResolversParentTypes['RedeemEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  cv?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  holder?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  returnAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_MetaArgs>>;
  deployETHERC20ProjectPayerEvent?: SubscriptionResolver<Maybe<ResolversTypes['DeployETHERC20ProjectPayerEvent']>, "deployETHERC20ProjectPayerEvent", ParentType, ContextType, RequireFields<SubscriptionDeployEtherc20ProjectPayerEventArgs, 'id' | 'subgraphError'>>;
  deployETHERC20ProjectPayerEvents?: SubscriptionResolver<Array<ResolversTypes['DeployETHERC20ProjectPayerEvent']>, "deployETHERC20ProjectPayerEvents", ParentType, ContextType, RequireFields<SubscriptionDeployEtherc20ProjectPayerEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  deployedERC20Event?: SubscriptionResolver<Maybe<ResolversTypes['DeployedERC20Event']>, "deployedERC20Event", ParentType, ContextType, RequireFields<SubscriptionDeployedErc20EventArgs, 'id' | 'subgraphError'>>;
  deployedERC20Events?: SubscriptionResolver<Array<ResolversTypes['DeployedERC20Event']>, "deployedERC20Events", ParentType, ContextType, RequireFields<SubscriptionDeployedErc20EventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributePayoutsEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributePayoutsEvent']>, "distributePayoutsEvent", ParentType, ContextType, RequireFields<SubscriptionDistributePayoutsEventArgs, 'id' | 'subgraphError'>>;
  distributePayoutsEvents?: SubscriptionResolver<Array<ResolversTypes['DistributePayoutsEvent']>, "distributePayoutsEvents", ParentType, ContextType, RequireFields<SubscriptionDistributePayoutsEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeReservedTokensEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributeReservedTokensEvent']>, "distributeReservedTokensEvent", ParentType, ContextType, RequireFields<SubscriptionDistributeReservedTokensEventArgs, 'id' | 'subgraphError'>>;
  distributeReservedTokensEvents?: SubscriptionResolver<Array<ResolversTypes['DistributeReservedTokensEvent']>, "distributeReservedTokensEvents", ParentType, ContextType, RequireFields<SubscriptionDistributeReservedTokensEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToPayoutModEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributeToPayoutModEvent']>, "distributeToPayoutModEvent", ParentType, ContextType, RequireFields<SubscriptionDistributeToPayoutModEventArgs, 'id' | 'subgraphError'>>;
  distributeToPayoutModEvents?: SubscriptionResolver<Array<ResolversTypes['DistributeToPayoutModEvent']>, "distributeToPayoutModEvents", ParentType, ContextType, RequireFields<SubscriptionDistributeToPayoutModEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToPayoutSplitEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributeToPayoutSplitEvent']>, "distributeToPayoutSplitEvent", ParentType, ContextType, RequireFields<SubscriptionDistributeToPayoutSplitEventArgs, 'id' | 'subgraphError'>>;
  distributeToPayoutSplitEvents?: SubscriptionResolver<Array<ResolversTypes['DistributeToPayoutSplitEvent']>, "distributeToPayoutSplitEvents", ParentType, ContextType, RequireFields<SubscriptionDistributeToPayoutSplitEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToReservedTokenSplitEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributeToReservedTokenSplitEvent']>, "distributeToReservedTokenSplitEvent", ParentType, ContextType, RequireFields<SubscriptionDistributeToReservedTokenSplitEventArgs, 'id' | 'subgraphError'>>;
  distributeToReservedTokenSplitEvents?: SubscriptionResolver<Array<ResolversTypes['DistributeToReservedTokenSplitEvent']>, "distributeToReservedTokenSplitEvents", ParentType, ContextType, RequireFields<SubscriptionDistributeToReservedTokenSplitEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  distributeToTicketModEvent?: SubscriptionResolver<Maybe<ResolversTypes['DistributeToTicketModEvent']>, "distributeToTicketModEvent", ParentType, ContextType, RequireFields<SubscriptionDistributeToTicketModEventArgs, 'id' | 'subgraphError'>>;
  distributeToTicketModEvents?: SubscriptionResolver<Array<ResolversTypes['DistributeToTicketModEvent']>, "distributeToTicketModEvents", ParentType, ContextType, RequireFields<SubscriptionDistributeToTicketModEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  ensnode?: SubscriptionResolver<Maybe<ResolversTypes['ENSNode']>, "ensnode", ParentType, ContextType, RequireFields<SubscriptionEnsnodeArgs, 'id' | 'subgraphError'>>;
  ensnodes?: SubscriptionResolver<Array<ResolversTypes['ENSNode']>, "ensnodes", ParentType, ContextType, RequireFields<SubscriptionEnsnodesArgs, 'first' | 'skip' | 'subgraphError'>>;
  etherc20ProjectPayer?: SubscriptionResolver<Maybe<ResolversTypes['ETHERC20ProjectPayer']>, "etherc20ProjectPayer", ParentType, ContextType, RequireFields<SubscriptionEtherc20ProjectPayerArgs, 'id' | 'subgraphError'>>;
  etherc20ProjectPayers?: SubscriptionResolver<Array<ResolversTypes['ETHERC20ProjectPayer']>, "etherc20ProjectPayers", ParentType, ContextType, RequireFields<SubscriptionEtherc20ProjectPayersArgs, 'first' | 'skip' | 'subgraphError'>>;
  mintTokensEvent?: SubscriptionResolver<Maybe<ResolversTypes['MintTokensEvent']>, "mintTokensEvent", ParentType, ContextType, RequireFields<SubscriptionMintTokensEventArgs, 'id' | 'subgraphError'>>;
  mintTokensEvents?: SubscriptionResolver<Array<ResolversTypes['MintTokensEvent']>, "mintTokensEvents", ParentType, ContextType, RequireFields<SubscriptionMintTokensEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  participant?: SubscriptionResolver<Maybe<ResolversTypes['Participant']>, "participant", ParentType, ContextType, RequireFields<SubscriptionParticipantArgs, 'id' | 'subgraphError'>>;
  participants?: SubscriptionResolver<Array<ResolversTypes['Participant']>, "participants", ParentType, ContextType, RequireFields<SubscriptionParticipantsArgs, 'first' | 'skip' | 'subgraphError'>>;
  payEvent?: SubscriptionResolver<Maybe<ResolversTypes['PayEvent']>, "payEvent", ParentType, ContextType, RequireFields<SubscriptionPayEventArgs, 'id' | 'subgraphError'>>;
  payEvents?: SubscriptionResolver<Array<ResolversTypes['PayEvent']>, "payEvents", ParentType, ContextType, RequireFields<SubscriptionPayEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  printReservesEvent?: SubscriptionResolver<Maybe<ResolversTypes['PrintReservesEvent']>, "printReservesEvent", ParentType, ContextType, RequireFields<SubscriptionPrintReservesEventArgs, 'id' | 'subgraphError'>>;
  printReservesEvents?: SubscriptionResolver<Array<ResolversTypes['PrintReservesEvent']>, "printReservesEvents", ParentType, ContextType, RequireFields<SubscriptionPrintReservesEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  project?: SubscriptionResolver<Maybe<ResolversTypes['Project']>, "project", ParentType, ContextType, RequireFields<SubscriptionProjectArgs, 'id' | 'subgraphError'>>;
  projectCreateEvent?: SubscriptionResolver<Maybe<ResolversTypes['ProjectCreateEvent']>, "projectCreateEvent", ParentType, ContextType, RequireFields<SubscriptionProjectCreateEventArgs, 'id' | 'subgraphError'>>;
  projectCreateEvents?: SubscriptionResolver<Array<ResolversTypes['ProjectCreateEvent']>, "projectCreateEvents", ParentType, ContextType, RequireFields<SubscriptionProjectCreateEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  projectEvent?: SubscriptionResolver<Maybe<ResolversTypes['ProjectEvent']>, "projectEvent", ParentType, ContextType, RequireFields<SubscriptionProjectEventArgs, 'id' | 'subgraphError'>>;
  projectEvents?: SubscriptionResolver<Array<ResolversTypes['ProjectEvent']>, "projectEvents", ParentType, ContextType, RequireFields<SubscriptionProjectEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  projects?: SubscriptionResolver<Array<ResolversTypes['Project']>, "projects", ParentType, ContextType, RequireFields<SubscriptionProjectsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolLog?: SubscriptionResolver<Maybe<ResolversTypes['ProtocolLog']>, "protocolLog", ParentType, ContextType, RequireFields<SubscriptionProtocolLogArgs, 'id' | 'subgraphError'>>;
  protocolLogs?: SubscriptionResolver<Array<ResolversTypes['ProtocolLog']>, "protocolLogs", ParentType, ContextType, RequireFields<SubscriptionProtocolLogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolV1Log?: SubscriptionResolver<Maybe<ResolversTypes['ProtocolV1Log']>, "protocolV1Log", ParentType, ContextType, RequireFields<SubscriptionProtocolV1LogArgs, 'id' | 'subgraphError'>>;
  protocolV1Logs?: SubscriptionResolver<Array<ResolversTypes['ProtocolV1Log']>, "protocolV1Logs", ParentType, ContextType, RequireFields<SubscriptionProtocolV1LogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  protocolV2Log?: SubscriptionResolver<Maybe<ResolversTypes['ProtocolV2Log']>, "protocolV2Log", ParentType, ContextType, RequireFields<SubscriptionProtocolV2LogArgs, 'id' | 'subgraphError'>>;
  protocolV2Logs?: SubscriptionResolver<Array<ResolversTypes['ProtocolV2Log']>, "protocolV2Logs", ParentType, ContextType, RequireFields<SubscriptionProtocolV2LogsArgs, 'first' | 'skip' | 'subgraphError'>>;
  redeemEvent?: SubscriptionResolver<Maybe<ResolversTypes['RedeemEvent']>, "redeemEvent", ParentType, ContextType, RequireFields<SubscriptionRedeemEventArgs, 'id' | 'subgraphError'>>;
  redeemEvents?: SubscriptionResolver<Array<ResolversTypes['RedeemEvent']>, "redeemEvents", ParentType, ContextType, RequireFields<SubscriptionRedeemEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  tapEvent?: SubscriptionResolver<Maybe<ResolversTypes['TapEvent']>, "tapEvent", ParentType, ContextType, RequireFields<SubscriptionTapEventArgs, 'id' | 'subgraphError'>>;
  tapEvents?: SubscriptionResolver<Array<ResolversTypes['TapEvent']>, "tapEvents", ParentType, ContextType, RequireFields<SubscriptionTapEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  useAllowanceEvent?: SubscriptionResolver<Maybe<ResolversTypes['UseAllowanceEvent']>, "useAllowanceEvent", ParentType, ContextType, RequireFields<SubscriptionUseAllowanceEventArgs, 'id' | 'subgraphError'>>;
  useAllowanceEvents?: SubscriptionResolver<Array<ResolversTypes['UseAllowanceEvent']>, "useAllowanceEvents", ParentType, ContextType, RequireFields<SubscriptionUseAllowanceEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
};

export type TapEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['TapEvent'] = ResolversParentTypes['TapEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  beneficiaryTransferAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  distributions?: Resolver<Array<ResolversTypes['DistributeToPayoutModEvent']>, ParentType, ContextType, RequireFields<TapEventDistributionsArgs, 'first' | 'skip'>>;
  fundingCycleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  govFeeAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  netTransferAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UseAllowanceEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['UseAllowanceEvent'] = ResolversParentTypes['UseAllowanceEvent']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  distributedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fundingCycleConfiguration?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fundingCycleNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  netDistributedamount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Block_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = {
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Meta_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = {
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  DeployETHERC20ProjectPayerEvent?: DeployEtherc20ProjectPayerEventResolvers<ContextType>;
  DeployedERC20Event?: DeployedErc20EventResolvers<ContextType>;
  DistributePayoutsEvent?: DistributePayoutsEventResolvers<ContextType>;
  DistributeReservedTokensEvent?: DistributeReservedTokensEventResolvers<ContextType>;
  DistributeToPayoutModEvent?: DistributeToPayoutModEventResolvers<ContextType>;
  DistributeToPayoutSplitEvent?: DistributeToPayoutSplitEventResolvers<ContextType>;
  DistributeToReservedTokenSplitEvent?: DistributeToReservedTokenSplitEventResolvers<ContextType>;
  DistributeToTicketModEvent?: DistributeToTicketModEventResolvers<ContextType>;
  ENSNode?: EnsNodeResolvers<ContextType>;
  ETHERC20ProjectPayer?: Etherc20ProjectPayerResolvers<ContextType>;
  MintTokensEvent?: MintTokensEventResolvers<ContextType>;
  Participant?: ParticipantResolvers<ContextType>;
  PayEvent?: PayEventResolvers<ContextType>;
  PrintReservesEvent?: PrintReservesEventResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectCreateEvent?: ProjectCreateEventResolvers<ContextType>;
  ProjectEvent?: ProjectEventResolvers<ContextType>;
  ProtocolLog?: ProtocolLogResolvers<ContextType>;
  ProtocolV1Log?: ProtocolV1LogResolvers<ContextType>;
  ProtocolV2Log?: ProtocolV2LogResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RedeemEvent?: RedeemEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TapEvent?: TapEventResolvers<ContextType>;
  UseAllowanceEvent?: UseAllowanceEventResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  derivedFrom?: DerivedFromDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  subgraphId?: SubgraphIdDirectiveResolver<any, any, ContextType>;
};


export const ProjectsDocument = gql`
    query Projects($where: Project_filter, $first: Int, $skip: Int) {
  projects(where: $where, first: $first, skip: $skip) {
    projectId
    metadataUri
    handle
  }
}
    `;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
      }
export function useProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
        }
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<typeof useProjectsLazyQuery>;
export type ProjectsQueryResult = Apollo.QueryResult<ProjectsQuery, ProjectsQueryVariables>;