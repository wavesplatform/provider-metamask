// todo move away (signer)
export interface IUser extends IUserData {
    id: number;
    path: string;
}

// todo move away (signer)
export interface IUserData {
    publicKey: string;
    address: string;
    statusCode: string;
}

export interface IWavesConfig {
    nodeUrl: string;
    chainId: number;
}

export interface IProviderMetamaskConfig {
    debug?: boolean;
    wavesConfig: IWavesConfig;
}

export enum EPriceMode {
    ASSET_DECIMALS = 'ASSET_DECIMALS', // 'assetDecimals',
    FIXED_DECIMALS = 'FIXED_DECIMALS', // 'fixedDecimals',
}
