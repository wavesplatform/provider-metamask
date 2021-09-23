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