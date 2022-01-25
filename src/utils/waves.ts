import { base58Decode } from '@waves/ts-lib-crypto';
import { bytesToHexString } from './common';


const WAVES_ASSET_ID_CONVERTED = '0x0000000000000000000000000000000000000000000000000000000000000000';
const WAVES_ASSET_STRING = 'WAVES';
const ETHEREUM_DECIMALS = 18;

// export const addressToBytes = (address: string) => bytesToHexString(base58Decode(address));
// export const assetToBytes = (assetId: string | null): string => {
    // return assetId === null ? WAVES_ASSET_ID_CONVERTED : bytesToHexString(base58Decode(assetId));
// };

// export const publicKeyToBytes = (publicKey: string): string =>  {
//     return bytesToHexString(base58Decode(publicKey));
// };

export const makeVerifyingContract = (chainId: number): string => {
    // repeat 20 times
    const repeatedChain = new Array(20)
        .fill(chainId.toString(16))
        .join('');

    return `0x${repeatedChain}`;
};

const formatPayment = (payment: any): any[] => {
    const amount = payment.amount;
    let assetId = payment.assetId;

    if (assetId === WAVES_ASSET_STRING) {
        assetId = null;
    }

    if (assetId === null) { // todo WAVES
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

export const toEthereumAmount = (amount: number, decimals: number): number => {
    return amount * ( 10 ** (ETHEREUM_DECIMALS - decimals + 1)); // TODO - 1
};

export const prepareAssetId = (assetId: string | null) => {
    return assetId === null ? 'WAVES' : assetId;
};
