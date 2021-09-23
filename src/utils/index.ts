// import { InvokeScriptCallArgument } from '@waves/ts-types';

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
