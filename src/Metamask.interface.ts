import { ethers } from 'ethers';

export type EthereumAddress = string;
export type TupleCortege = [number, string, boolean, string, number];

export enum EValueIndex {
    BOOLEAN = 1,
    BINARY = 2,
    INTEGER = 3,
    STRING = 0
}

export enum EAbiInputTypes {
    INT_64 = 'int64',
    STRING = 'string',
    BYTES = 'bytes',
    BOOL = 'bool',
    LIST_INT_64 = 'int64[]',
    LIST_STRING = 'string[]',
    LIST_BYTES = 'bytes[]',
    LIST_BOOL = 'bool[]',
    TUPLE = 'tuple[]',
}

export interface IAbiInput {
    name: string;
    type: EAbiInputTypes;
}

export interface IAbi {
    name: string;
    inputs: IAbiInput[];
}

export interface IContractMeta {
    contract: ethers.Contract;
    abi: IAbi;
}

/*
    https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
*/
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
