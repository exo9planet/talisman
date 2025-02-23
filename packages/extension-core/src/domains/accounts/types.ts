import type {
  AccountJson,
  RequestAccountCreateExternal,
  RequestAccountCreateHardware,
  RequestAccountSubscribe,
  ResponseAccountExport,
} from "@polkadot/extension-base/background/types"
import { KeyringPair$Json } from "@polkadot/keyring/types"
import { KeypairType } from "@polkadot/util-crypto/types"
import { TokenId } from "@talismn/chaindata-provider"
import { NsLookupType } from "@talismn/on-chain-id"

import { Address } from "../../types/base"
import type { RequestAccountsCatalogAction, Trees } from "./helpers.catalog"

export type { ResponseAccountExport, AccountJson, RequestAccountCreateExternal }
export type { RequestAccountsCatalogAction } from "./helpers.catalog"

export type {
  RequestAccountList,
  RequestAccountBatchExport,
  RequestAccountChangePassword,
  RequestAccountCreateSuri,
  RequestAccountEdit,
  RequestAccountShow,
  RequestAccountTie,
  RequestAccountValidate,
  ResponseJsonGetAccountInfo,
} from "@polkadot/extension-base/background/types"

// account types ----------------------------------

type AccountJsonHardwareSubstrateOwnProperties = {
  isHardware: true
  accountIndex: number
  addressOffset: number
}

export type AccountJsonHardwareSubstrate = AccountJson & AccountJsonHardwareSubstrateOwnProperties

type AccountJsonHardwareEthereumOwnProperties = {
  isHardware: true
  path: string
}

export type AccountJsonHardwareEthereum = AccountJson & AccountJsonHardwareEthereumOwnProperties

type AccountJsonQrOwnProperties = {
  isQr: true
}

export type AccountJsonQr = AccountJson & AccountJsonQrOwnProperties

type AccountJsonWatchedOwnProperties = {
  isPortfolio: boolean
}

export type AccountJsonWatched = AccountJson & AccountJsonWatchedOwnProperties

type AccountJsonDcentOwnProperties = {
  path: string
  tokenIds: TokenId[]
}

export type AccountJsonDcent = AccountJson & AccountJsonDcentOwnProperties

type AccountJsonSignetOwnProperties = {
  signetUrl: string
}

export type AccountJsonSignet = AccountJson & AccountJsonSignetOwnProperties

export type AccountJsonAny = (
  | AccountJsonHardwareEthereum
  | AccountJsonHardwareSubstrate
  | AccountJsonQr
  | AccountJsonWatched
  | AccountJsonDcent
  | AccountJson
  | AccountJsonSignet
) & { origin?: AccountType | undefined; derivedMnemonicId?: string; derivationPath?: string } & {
  folderId?: string
  folderName?: string
  sortOrder?: number
}

export type IdenticonType = "talisman-orb" | "polkadot-identicon"

export const AccountImportSources = {
  JSON: "json",
  PK: "pk",
} as const

export type AccountImportSource = {
  [K in keyof typeof AccountImportSources]: (typeof AccountImportSources)[K]
}[keyof typeof AccountImportSources]

export enum AccountType {
  Talisman = "TALISMAN", // mnemonic generated by Talisman
  Qr = "QR",
  Ledger = "LEDGER",
  Dcent = "DCENT",
  Watched = "WATCHED",
  Signet = "SIGNET",
}
export interface AccountMeta extends AccountJson {
  name: string
  origin: AccountType
  importSource?: AccountImportSource
}

export interface Account {
  address: Address
  meta: AccountMeta
}

export type AccountsList = Account[]

export type AccountAddressType = KeypairType // keep custom type, might want to add more later on

export interface RequestAccountCreateFromSuri {
  name: string
  suri: string
  type?: AccountAddressType
}

export interface RequestAccountCreateFromJson {
  unlockedPairs: KeyringPair$Json[]
}

export type RequestAccountCreateLedgerSubstrate = Omit<RequestAccountCreateHardware, "hardwareType">

export interface RequestAccountCreateLedgerEthereum {
  name: string
  address: string
  path: string
}
export interface RequestAccountCreateDcent {
  name: string
  address: string
  type: KeypairType
  path: string
  tokenIds: TokenId[]
}

export interface RequestAccountCreateWatched {
  name: string
  address: string
  isPortfolio: boolean
}

export type RequestAccountCreateSignet = {
  address: string
  name: string
  genesisHash: `0x${string}`
  signetUrl: string
}

export interface RequestAccountExternalSetIsPortfolio {
  address: string
  isPortfolio: boolean
}

export interface RequestAccountForget {
  address: string
}

export interface RequestAccountExport {
  address: string
  password: string
  exportPw: string
}

export interface RequestAccountExportPrivateKey {
  address: string
  password: string
}

export interface RequestAccountRename {
  address: string
  name: string
}

export type RequestAccountCreateOptionsNewMnemonic = {
  mnemonic: string
  confirmed: boolean
  derivationPath?: string
}

export type RequestAccountCreateOptionsExistingMnemonic = {
  mnemonicId: string
  derivationPath?: string
}

export type RequestAccountCreateOptions =
  | RequestAccountCreateOptionsExistingMnemonic
  | RequestAccountCreateOptionsNewMnemonic

export type RequestAccountCreate = {
  name: string
  type: AccountAddressType
} & RequestAccountCreateOptions

// wrap in a dedicated type because empty strings are changed to null by the message service
export type RequestValidateDerivationPath = {
  derivationPath: string
  type: AccountAddressType
}

export type RequestAddressLookupBySuri = {
  suri: string
  type: AccountAddressType
}
export type RequestAddressLookupByMnemonic = {
  mnemonicId: string
  derivationPath: string
  type: AccountAddressType
}
export type RequestAddressLookup = RequestAddressLookupBySuri | RequestAddressLookupByMnemonic

export type RequestNextDerivationPath = {
  mnemonicId: string
  type: AccountAddressType
}

export interface AccountsMessages {
  // account message signatures
  "pri(accounts.create)": [RequestAccountCreate, string]
  "pri(accounts.create.suri)": [RequestAccountCreateFromSuri, string]
  "pri(accounts.create.json)": [RequestAccountCreateFromJson, string[]]
  "pri(accounts.create.ledger.substrate)": [RequestAccountCreateLedgerSubstrate, string]
  "pri(accounts.create.ledger.ethereum)": [RequestAccountCreateLedgerEthereum, string]
  "pri(accounts.create.dcent)": [RequestAccountCreateDcent, string]
  "pri(accounts.create.qr.substrate)": [RequestAccountCreateExternal, string]
  "pri(accounts.create.watched)": [RequestAccountCreateWatched, string]
  "pri(accounts.create.signet)": [RequestAccountCreateSignet, string]
  "pri(accounts.forget)": [RequestAccountForget, boolean]
  "pri(accounts.export)": [RequestAccountExport, ResponseAccountExport]
  "pri(accounts.export.pk)": [RequestAccountExportPrivateKey, string]
  "pri(accounts.rename)": [RequestAccountRename, boolean]
  "pri(accounts.external.setIsPortfolio)": [RequestAccountExternalSetIsPortfolio, boolean]
  "pri(accounts.subscribe)": [RequestAccountSubscribe, boolean, AccountJson[]]
  "pri(accounts.catalog.subscribe)": [null, boolean, Trees]
  "pri(accounts.catalog.runActions)": [RequestAccountsCatalogAction[], boolean]
  "pri(accounts.validateDerivationPath)": [RequestValidateDerivationPath, boolean]
  "pri(accounts.address.lookup)": [RequestAddressLookup, string]
  "pri(accounts.derivationPath.next)": [RequestNextDerivationPath, string]
  "pri(accounts.onChainIds.resolveNames)": [string[], Record<string, [string, NsLookupType] | null>]
  "pri(accounts.onChainIds.lookupAddresses)": [string[], Record<string, string | null>]
}
