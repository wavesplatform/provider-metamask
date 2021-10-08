import { base58Decode } from '@waves/ts-lib-crypto';
import { bytesToHex } from 'node-forge/lib/util';
import { AddEthereumChainParameter } from '../Metamask.interface';

export const bytesToHexString = (bytes: Uint8Array) => {
    const hex = bytesToHex(bytes);

    return `0x${hex}`;
}

const WAVES_ASSET_ID_CONVERTED = '0x0000000000000000000000000000000000000000000000000000000000000000';
const formatPayment = (payment: any): any[] => {
    const amount = payment.amount;
    let assetId = payment.assetId;

    if (assetId === 'WAVES' || assetId === null) { // todo WAVES
        assetId = WAVES_ASSET_ID_CONVERTED;
    } else {
        const bytes = base58Decode(assetId);

        assetId = bytesToHexString(bytes);
    }

    return [ assetId, amount ];
};

export const formatPayments = (payments: any[]): any[] => {
    return payments.map(formatPayment);
};

const ETHEREUM_DECIMALS = 18;
export const toEthereumAmount = (amount: number, decimals: number): number => {
    return amount * ( 10 ** (ETHEREUM_DECIMALS - decimals + 1)); // TODO - 1
};

const METAMASK_NETWORK_CONFIG_WAVES_DEVNET: AddEthereumChainParameter = {
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

const METAMASK_NETWORK_CONFIG_WAVES_MAINNET: AddEthereumChainParameter = {
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

export const getMetamaskNetworkConfig = (chainId: number): AddEthereumChainParameter | null => {
    switch (chainId) {
        case 67:
            return METAMASK_NETWORK_CONFIG_WAVES_DEVNET;

        case 87:
            return METAMASK_NETWORK_CONFIG_WAVES_MAINNET;

        default:
            return null;
    }

};
