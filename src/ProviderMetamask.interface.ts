// todo move away
export interface IUser extends IUserData {
    id: number;
    path: string;
}

// todo move away
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
