import { base58Decode } from '@waves/ts-lib-crypto'
// import { wavesAsset2Eth } from '@waves/node-api-js';
import { encode64, decode64, hexToBytes, bytesToHex } from 'node-forge/lib/util'
import { AddEthereumChainParameter } from '../Metamask.interface';

const getInvokeArgValue = (item: any) => {
    if(item.type === 'list') {
        return item.value.map(getInvokeArgValue);
    } else {
        return item.value;
    }
};

export const getInvokeArgsValues = (args: any[]): any[] => {
    return args.map((item) => {
        return getInvokeArgValue(item);
    });
};

const WAVES_ASSET_ID_CONVERTED = '0x0000000000000000000000000000000000000000000000000000000000000000';
const formatPayment = (payment: any): any[] => {
    const amount = payment.amount;
    let assetId = payment.assetId;

    if (assetId === 'WAVES') { // todo WAVES
        assetId = WAVES_ASSET_ID_CONVERTED;
    } else {
        const hex = bytesToHex(base58Decode(assetId));;
        assetId = `0x${hex}`;
    }

    return [ assetId, amount ];
};

export const formatPayments = (payments: any[]): any[] => {
    return payments.map(formatPayment);
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
