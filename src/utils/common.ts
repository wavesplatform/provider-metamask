import { bytesToHex } from 'node-forge/lib/util';

export const bytesToHexString = (bytes: Uint8Array) => {
	const hex = bytesToHex(bytes);

	return `0x${hex}`;
};

export const cloneObj = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;
