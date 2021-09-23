import { AddEthereumChainParameter } from './Metamask.interface';
import { IWavesConfig, IProviderMetamaskConfig } from './ProviderMetamask.interface';

export const DEFAULT_WAVES_CONFIG: IWavesConfig = {
    chainId: 87,
    nodeUrl: 'https://nodes.wavesnodes.com',
};

export const DEFAULT_PROVIDER_CONFIG: IProviderMetamaskConfig = {
    debug: false,
    wavesConfig: DEFAULT_WAVES_CONFIG,
}

export const METAMASK_NETWORK_CONFIG_WAVES_DEVNET: AddEthereumChainParameter = {
    chainId: '0x' + (67).toString(16), // A 0x-prefixed hexadecimal string
    chainName: 'Waves devnet',
    nativeCurrency: {
        name: 'WAVES',
        symbol: 'WAVES', // 2-6 characters long
        decimals: 18,
    },
    rpcUrls: ['https://devnet1-htz-nbg1-4.wavesnodes.com/eth'],
    blockExplorerUrls: ['https://wavesexplorer.com'],
};

export const METAMASK_NETWORK_CONFIG_WAVES_MAINNET: AddEthereumChainParameter = {
    chainId: '0x' + (87).toString(), // A 0x-prefixed hexadecimal string
    chainName: 'Waves',
    nativeCurrency: {
        name: 'WAVES',
        symbol: 'WAVES', // 2-6 characters long
        decimals: 18,
    },
    rpcUrls: ['https://nodes.wavesnodes.com/eth'], // TODO ask Sergey Nazarov about ntwork url
    blockExplorerUrls: ['https://wavesexplorer.com'],
};
