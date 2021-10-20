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
