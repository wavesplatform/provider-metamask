import { bytesToHex } from 'node-forge/lib/util';

export const bytesToHexString = (bytes: Uint8Array) => {
    const hex = bytesToHex(bytes);

    return `0x${hex}`;
}
