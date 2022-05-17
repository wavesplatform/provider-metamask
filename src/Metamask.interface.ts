import { ethers } from 'ethers';
import { EPriceMode } from './ProviderMetamask.interface';

export type EthereumAddress = string;
export type TupleCortege = any[];
export type MetamaskSign = string;

export enum EInvokeArgType {
	BINARY = 'binary',
	BOOLEAN = 'boolean',
	INTEGER = 'integer',
	STRING = 'string',
}

// https://docs.soliditylang.org/en/develop/abi-spec.html
export enum EAbiInputTypes {
	ADDRESS = 'address',
	BOOL = 'bool',
	BYTES = 'bytes',
	INT_32 = 'int32',
	INT_64 = 'int64',
	STRING = 'string',
	TUPLE = 'tuple',
	UINT_256 = 'uint256',
	LIST_INT_64 = 'int64[]',
	LIST_STRING = 'string[]',
	LIST_BYTES = 'bytes[]',
	LIST_BOOL = 'bool[]',
	LIST_TUPLE = 'tuple[]',
}

export type AbiInputTypesIndexMap = { [key in EAbiInputTypes]?: number };

export interface IAbiInput {
	name: string;
	type: EAbiInputTypes;
	components?: IAbiInput[];
}

export interface IAbi {
	name: string;
	inputs: IAbiInput[];
}

export interface IContractMeta {
	contract: ethers.Contract;
	abi: IAbi[];
}

export interface IMMTypedData {
	type: string;
	name: string;
	value: string;
}

// https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
export interface AddEthereumChainParameter {
	chainId: string; // A 0x-prefixed hexadecimal string
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string; // 2-6 characters long
		decimals: 18; //MetaMask does not yet support chains with native currencies that do not have 18 decimals, but may do so in the future.
	};
	rpcUrls: string[];
	blockExplorerUrls?: string[];
	iconUrls?: string[]; // Currently ignored.
};

export enum EMetamaskError {
	REJECT_REQUEST = 4001, // 'User rejected the request.'
	CHAIN_NOT_ADDED = 4902, // This error code indicates that the chain has not been added to MetaMask.
}

export interface IOrderModel {
	types: {
		EIP712Domain: IAbiInput[];
		Order: IAbiInput[];
	};
	primaryType: 'Order';
	domain: {
		name: string;
		version: string;
		chainId: number;
		verifyingContract: string;
	};
	message: {
		version: number;
		orderType: string;
		matcherPublicKey: string;
		matcherFeeAssetId: string;
		amountAsset: string;
		priceAsset: string;
		matcherFee: number;
		amount: number;
		price: number;
		timestamp: number;
		expiration: number;
		priceMode: EPriceMode;
	}
}
