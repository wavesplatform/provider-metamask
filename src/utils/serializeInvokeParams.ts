import { InvokeScriptCallArgument, Long } from '@waves/ts-types';
import { base58Decode, base64Decode } from '@waves/ts-lib-crypto';
import { bytesToHexString } from './common';
import { EValueIndex, IAbiInput, EAbiInputTypes, TupleCortege } from '../Metamask.interface'

const makeTupleItem = (item: InvokeScriptCallArgument<Long>): TupleCortege => {
    const itemTemplate: TupleCortege = [EValueIndex.BOOLEAN, '', false, '0x', 0];

    let valueIndex;

    switch (item.type) {
        case 'boolean':
            valueIndex = EValueIndex.BOOLEAN;
            break;
        case 'binary':
            valueIndex = EValueIndex.BINARY;
            break;
        case 'integer':
            valueIndex = EValueIndex.INTEGER;
            break;
        case 'string':
            valueIndex = EValueIndex.STRING;
            break;
    }

    itemTemplate[0] = valueIndex;
    itemTemplate[valueIndex] = item.value as (string | number | boolean); // todo

    return itemTemplate;
}

const serializeBinary = (value: string): string => {
    if (value.indexOf('base64:') === 0) {
        value = value.slice(6);

        return bytesToHexString(base64Decode(value));
    } else if (value.indexOf('base58:') === 0) {
        value = value.slice(6);

        return bytesToHexString(base58Decode(value));
    } else {
        return value;
    }
}

const serializeInvokeParam = (type: EAbiInputTypes, value: any) => {
    switch (type) {
        case EAbiInputTypes.BOOL:
        case EAbiInputTypes.INT_64:
        case EAbiInputTypes.STRING:
            return value;
        case EAbiInputTypes.BYTES:
            return serializeBinary(value);
        case EAbiInputTypes.LIST_BOOL:
            return value.map((param) => serializeInvokeParam(EAbiInputTypes.BOOL, param.value));
        case EAbiInputTypes.LIST_INT_64:
            return value.map((param) => serializeInvokeParam(EAbiInputTypes.INT_64, param.value));
        case EAbiInputTypes.LIST_STRING:
            return value.map((param) => serializeInvokeParam(EAbiInputTypes.STRING, param.value));
        case EAbiInputTypes.LIST_BYTES:
            return value.map((param) => serializeInvokeParam(EAbiInputTypes.BYTES, param.value));
        case EAbiInputTypes.TUPLE:
            return value.map(makeTupleItem);
    }
};

export const serializeInvokeParams = (params: any, abiInputs: IAbiInput[]): any[] => {
    return params.map((item, index) => {
        return serializeInvokeParam(abiInputs[index].type, item.value);
    });
};
