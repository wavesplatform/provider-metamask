import MetaMaskOnboarding from '@metamask/onboarding';
import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
// import { fetchNodeTime } from '@waves/node-api-js/es/api-node/utils';
// import { fetchBalanceDetails } from '@waves/node-api-js/es/api-node/addresses';
// import { fetchAssetsDetails } from '@waves/node-api-js/es/api-node/assets';
// import { makeTxBytes, signTx, serializeCustomData, libs } from '@waves/waves-transactions';

import metamaskApi from './metamask'

// import {
//     errorUserCancel,
//     isSupportedBrowser,
//     promiseWrapper,
//     sleep
// } from './utils';
import {
    IUser,
    IProviderMetamaskConfig,
} from './ProviderMetamask.interface';

const DEFAULT_PROVIDER_CONFIG = {
    debug: false,
};

export class ProviderMetamask implements Provider {
// export class ProviderMetamask {
    private _config: IProviderMetamaskConfig;
    private mmOnboarding?: MetaMaskOnboarding;

    public user: IUser | null = null;

    constructor(config?: IProviderMetamaskConfig) {
        this._config = config || DEFAULT_PROVIDER_CONFIG;

        this.__log('constructor');
    }

    public async login(): Promise<UserData> {
        this.__log('login');

        // const users = await metamaskApi.requestAccounts();
        const users = await metamaskApi.getAccounts();

        if(users?.length) {
            const ethAddr: string = users[0];

            this.user = {
                id: 0,
                path: '',
                publicKey: '',
                address: eth2waves(ethAddr, 67), //todo check to get from MM
                statusCode: ''
    
            };

            return this.user
        } else {
            throw 'Can not get user from metamask';
        }
    }

    public logout(): Promise<void> {
        this.__log('logout');

        return Promise.resolve();
    }

    public async signAndBroadCast(list: Array<SignerTx>): Promise<Array<any>> {
        const tx = list[0];

        return metamaskApi.sendTransaction(tx;
    }

    public async sign(list: Array<SignerTx>): Promise<Array<any>> {
        this.__log('sign');

        return this.signAndBroadCast(list);
    }

    public signTypedData(data: Array<TypedData>): Promise<string> {
        this.__log('signTypedData');

        throw "Dont use this"; // should rework
    }

    public async signMessage(data: string | number): Promise<string> {
        this.__log('signMessage', data);

        throw "Dont use this"; // should rework
    }

    public connect(options: ConnectOptions): Promise<void> {
        this.__log('connect', options);

        // this._options = options;

        return Promise.resolve();
    }

    public on<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('on');
        console.error('Not implemented');
        return this;
    }

    public once<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider{
        this.__log('once');
        console.error('Not implemented');
        return this;
    };

    public off<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('off');
        console.error('Not implemented');
        return this;
    }

    private initMetamask() {
        this.mmOnboarding = new MetaMaskOnboarding({ forwarderOrigin: metamaskApi.forwarderOrigin() });
    }

    private __log(tag: string, ...args) {
        if (this._config.debug) {
            console.log(`ProviderMetamask :: ${tag} : `, ...args);
        }
    }

}


// TODO user npde-api-js
import { keccak, blake2b, base58Encode, base16Decode } from '@waves/ts-lib-crypto'

const eth2waves = (ethAddress: string, chainId: number): string => {
    ethAddress = ethAddress.substr(2);

    const prefixBytes = new Uint8Array([0x01, chainId]);

    // Раскодировать HEX строку в байты (PK_HASH)
    const pkHashBytes = base16Decode(ethAddress);

    // Сделать чексумму CHECKSUM=keccak256(blake2b256([0x01, CHAIN_ID] + PK_HASH))
    const checksumBytes = new Uint8Array([
        ...prefixBytes,
        ...pkHashBytes
    ]);
    const checksum = keccak(blake2b(checksumBytes));      

    // склеить [0x01, CHAIN_ID] (два байта) + PK_HASH (изначальные 20 байт) + CHECKSUM[1:4] (первые четыре байта чексуммы)
    const wavesBytes = new Uint8Array([
        ...prefixBytes,
        ...pkHashBytes.slice(0, 20),
        ...checksum.slice(0, 4)
    ]);

    // закодировать в base58
    const wavesAddress = base58Encode(wavesBytes);

    return wavesAddress;
}
