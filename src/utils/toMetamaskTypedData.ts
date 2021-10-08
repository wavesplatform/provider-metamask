import { TypedData } from '@waves/signer';
import { IMMTypedData } from '../Metamask.interface';

const convertType = (type) => {
    return {
        'boolean': 'bool',
        'integer': 'uint32',
        'string': 'string',
        'binary': 'bytes'
    }[type];
}

export const toMetamaskTypedData = (data: TypedData): IMMTypedData => {
    return {
        type: convertType(data.type),
        name: data.key,
        value: String(data.value)
    };
};
