export interface IProviderMetamaskConfig {
    debug?: boolean;
};

export interface IUser extends IUserData {
    id: number;
    path: string;
}

export interface IUserData {
    publicKey: string;
    address: string;
    statusCode: string;
}
