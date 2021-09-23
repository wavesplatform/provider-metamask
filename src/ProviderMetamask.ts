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

import { ethAddress2waves } from '@waves/node-api-js';
import { TRANSACTION_TYPE } from '@waves/ts-types';

import {
    IUser,
    IProviderMetamaskConfig,
} from './ProviderMetamask.interface';

import {
    EMetamaskError
} from './Metamask.interface';

import {
    DEFAULT_PROVIDER_CONFIG,
    DEFAULT_WAVES_CONFIG,
    METAMASK_NETWORK_CONFIG_WAVES_DEVNET,
    METAMASK_NETWORK_CONFIG_WAVES_MAINNET,
} from './config';
import { getInvokeArgsValues } from './utils';
import metamaskApi from './metamask'

export class ProviderMetamask implements Provider {
    private _config: IProviderMetamaskConfig;
    private mmOnboarding?: MetaMaskOnboarding;

    public user: IUser | null = null;

    constructor(config?: IProviderMetamaskConfig) {
        this._config = config || DEFAULT_PROVIDER_CONFIG;
        this._config.wavesConfig = { ...DEFAULT_WAVES_CONFIG, ...this._config.wavesConfig };

        this.__log('constructor', this._config);
    }

    public async login(): Promise<UserData> {
        this.__log('login');

        const users = await metamaskApi.requestAccounts();
        // const users = await metamaskApi.getAccounts();

        if(users?.length) {
            const ethAddr: string = users[0];

            this.user = {
                id: 0,
                path: '',
                publicKey: '',
                address: ethAddress2waves(ethAddr, this._config.wavesConfig.chainId), //todo check to get from MM
                statusCode: ''
            };

            this.__log('login :: ', this.user);

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
        this.__log('signAndBroadCast :: ', list);

        return Promise.all(list.map(async (tx) => {
            const wavesConfig = this._config.wavesConfig;

            if(tx.type == TRANSACTION_TYPE.TRANSFER) {

            } else if (tx.type == TRANSACTION_TYPE.INVOKE_SCRIPT) {
                const txInvoke = tx;
                const call = txInvoke.call!;
                const name = call.function;
                const dappAddress = txInvoke.dApp;

                const contract = await metamaskApi.createContract(dappAddress, wavesConfig.nodeUrl);

                const paramsValues = getInvokeArgsValues(call.args);;
                const payments = txInvoke.payment || [];

                const txId = await contract[name](
                    ...paramsValues,
                    payments
                );

                return {
                    ...tx,
                    id: txId
                };
            }
        }));
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

    public async connect(options: ConnectOptions): Promise<void> {
        this.__log('connect', options);

        // const networkConfigMain = METAMASK_NETWORK_CONFIG_WAVES_MAINNET;
        // const networkConfigDev = METAMASK_NETWORK_CONFIG_WAVES_DEVNET;

        // // try to switch on waves network or create it
        // try {
        //     await metamaskApi.switchEthereumChain(METAMASK_NETWORK_CONFIG_WAVES_DEVNET);
        // } catch (err) {
        //     switch (err.code) {
        //         case EMetamaskError.CHAIN_NOT_ADDED:
        //             await metamaskApi.addEthereumChain(METAMASK_NETWORK_CONFIG_WAVES_DEVNET);
        //             break;
        //         case EMetamaskError.REJECT_REQUEST:
        //             throw 'Switch to waves network is rejected';
        //     }
        // }
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

    // private initMetamask() {
    //     this.mmOnboarding = new MetaMaskOnboarding({ forwarderOrigin: metamaskApi.forwarderOrigin() });
    // }

    private __log(tag: string, ...args) {
        if (this._config.debug) {
            console.log(`ProviderMetamask :: ${tag} : `, ...args);
        }
    }

}
