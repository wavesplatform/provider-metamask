import { InvokeScriptCallArgument, Long } from '@waves/ts-types';
import { base58Decode, base64Decode, base58Encode } from '@waves/ts-lib-crypto';
import { bytesToHex } from 'node-forge/lib/util';
import { AddEthereumChainParameter } from '../Metamask.interface';

const bytesToHexString = (bytes: Uint8Array) => {
    const hex = bytesToHex(bytes);

    return `0x${hex}`;
}

const getInvokeArgValue = (item: InvokeScriptCallArgument<Long>): any => {
    switch (item.type) {
        case 'list':
            return item.value.map(getInvokeArgValue);
        case 'binary':
            if (item.value.indexOf('base64:') === 0) {
                const value = item.value.slice(6);

                return bytesToHexString(base64Decode(value));
            } else if (item.value.indexOf('base58:') === 0) {
                const value = item.value.slice(6);

                return bytesToHexString(base58Decode(value));
            } else {
                return item.value;
            }
        default:
            return item.value;
    }
};

export const getInvokeArgsValues = (args: InvokeScriptCallArgument<Long>[]): any[] => {
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
        const bytes = base58Decode(assetId);

        assetId = bytesToHexString(bytes);
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
