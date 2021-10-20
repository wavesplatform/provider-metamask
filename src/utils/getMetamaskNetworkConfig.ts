import { AddEthereumChainParameter } from '../Metamask.interface';

export const getMetamaskNetworkConfig = (chainId: number): AddEthereumChainParameter | null => {
    switch (chainId) {
        case 87: return METAMASK_NETWORK_CONFIG_WAVES_MAINNET;
        case 83: return METAMASK_NETWORK_CONFIG_WAVES_STAGENET;
        case 84: return METAMASK_NETWORK_CONFIG_WAVES_TESTNET;
        case 67: return METAMASK_NETWORK_CONFIG_WAVES_DEVNET;

        default: return null;
    }
};

const METAMASK_NETWORK_CONFIG_WAVES_MAINNET: AddEthereumChainParameter = {
    chainId: '0x' + (87).toString(),
    chainName: 'Waves',
    nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
    rpcUrls: ['https://nodes.wavesnodes.com/eth'],
    blockExplorerUrls: ['https://wavesexplorer.com'],
};

const METAMASK_NETWORK_CONFIG_WAVES_STAGENET: AddEthereumChainParameter = {
    chainId: '0x' + (83).toString(),
    chainName: 'Waves stagenet',
    nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
    rpcUrls: ['https://nodes-stagenet.wavesnodes.com/eth'],
    blockExplorerUrls: ['https://stagenet.wavesexplorer.com'],
};

const METAMASK_NETWORK_CONFIG_WAVES_TESTNET: AddEthereumChainParameter = {
    chainId: '0x' + (84).toString(),
    chainName: 'Waves testnet',
    nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
    rpcUrls: ['https://testnode1.wavesnodes.com/eth'],
    blockExplorerUrls: ['https://testnet.wavesexplorer.com'],
};

const METAMASK_NETWORK_CONFIG_WAVES_DEVNET: AddEthereumChainParameter = {
    chainId: '0x' + (67).toString(16),
    chainName: 'Waves devnet',
    nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
    rpcUrls: ['https://devnet1-htz-nbg1-4.wavesnodes.com/eth'],
    blockExplorerUrls: ['https://wavesexplorer.com/custom'],
};
