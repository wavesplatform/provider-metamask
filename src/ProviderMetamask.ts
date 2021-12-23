// import MetaMaskOnboarding from '@metamask/onboarding';
import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignerTx,
    TypedData,
    UserData
} from '@waves/signer';
import { ethAddress2waves, ethTxId2waves, wavesAddress2eth } from '@waves/node-api-js';
import { TRANSACTION_TYPE } from '@waves/ts-types';
import { base64Decode, base58Encode } from '@waves/ts-lib-crypto';

import { IUser, IProviderMetamaskConfig } from './ProviderMetamask.interface';
import { EMetamaskError, IMMTypedData, IOrderModel, MetamaskSign } from './Metamask.interface';
import { DEFAULT_PROVIDER_CONFIG, DEFAULT_WAVES_CONFIG, ORDER_MODEL } from './config';
import {
    assetToBytes,
    formatPayments,
    findInvokeAbiByName,
    getMetamaskNetworkConfig,
    makeVerifyingContract,
    prepareAssetId,
    publicKeyToBytes,
    serializeInvokeParams,
    toMetamaskTypedData,
} from './utils';
import metamaskApi, { isMetaMaskInstalled } from './metamask'

export class ProviderMetamask implements Provider {
    public isSignAndBroadcastByProvider = true;

    private _config: IProviderMetamaskConfig;

    public user: IUser | null = null;

    constructor(config?: IProviderMetamaskConfig) {
        this._config = config || DEFAULT_PROVIDER_CONFIG;
        this._config.wavesConfig = { ...DEFAULT_WAVES_CONFIG, ...this._config.wavesConfig };

        if(!isMetaMaskInstalled()) {
            throw 'Metamask is not installed';
        }

        this.__log('constructor', this._config);
    }

    public async login(): Promise<UserData> {
        this.__log('login');

        await this.trySwitchNetwork();

        const users = await metamaskApi.requestAccounts();
        // const users = await metamaskApi.getAccounts();

        if(users?.length) {
            const ethAddr: string = users[0];

            // base64 > base58
            const publicKey = await metamaskApi.getEncryptionPublicKey(ethAddr);
            const bytesFromBase64 = base64Decode(publicKey);
            const base58String = base58Encode(bytesFromBase64);

            this.user = {
                id: 0,
                path: '',
                publicKey: base58String,
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

    public async sign(list: Array<SignerTx>): Promise<Array<any>> {
        this.__log('sign');

        return Promise.all(list.map(this.signOneTx, this))
            .then((txList) => {
                if(txList.length === 1) {
                    return txList[0];
                } else {
                    return txList;
                }
            });
    }

    public async signTypedData(data: Array<TypedData>): Promise<MetamaskSign> {
        this.__log('signTypedData :: ', data);

        const typedData: IMMTypedData[] = data.map(toMetamaskTypedData);

        this.__log('signTypedData :: metamaskApi.signTypedData ', typedData);
        const sign = await metamaskApi.signTypedData(typedData);

        this.__log('signTypedData :: result :: ', sign);
        return sign;
    }

    public async signMessage(data: string | number): Promise<MetamaskSign> {
        this.__log('signMessage :: ', data);

        const typedData: IMMTypedData = {
            type: 'string',
            name: 'message',
            value: String(data),
        };

        const sign = await metamaskApi.signTypedData([typedData]);

        this.__log('signMessage :: result :: ', sign);
        return sign;
    }

    public async signOrder(order: any): Promise<MetamaskSign> {
        this.__log('signOrder :: ', order);
        const chainId = this._config.wavesConfig.chainId;

        order.matcherFeeAssetId = prepareAssetId(order.matcherFeeAssetId);
        order.assetPair.amountAsset = prepareAssetId(order.assetPair.amountAsset);
        order.assetPair.priceAsset = prepareAssetId(order.assetPair.priceAsset);

        const orderToSign: IOrderModel = {
            ...ORDER_MODEL,
            ... {
                domain: {
                    ...ORDER_MODEL.domain,
                    chainId: chainId,
                    verifyingContract: makeVerifyingContract(chainId),
                },
                message: {
                    "version": order.version,
                    "orderType": order.orderType === 'sell' ? true : false,
                    "matcherPublicKey": publicKeyToBytes(order.matcherPublicKey),
                    "matcherFeeAssetId": assetToBytes(order.matcherFeeAssetId),
                    "amountAsset": assetToBytes(order.assetPair.amountAsset),
                    "priceAsset": assetToBytes(order.assetPair.priceAsset),
                    "matcherFee": order.matcherFee,
                    "amount": order.amount || 0,
                    "price": order.price,
                    "timestamp": order.timestamp,
                    "expiration": order.expiration,
                }
            }
        };

        this.__log('signOrder :: metamaskApi.signOrder :: ', orderToSign);
        const result = await metamaskApi.signOrder(orderToSign);

        this.__log('signOrder :: result :: ',result);
        return result;
    }

    public async connect(options: ConnectOptions): Promise<void> {
        this.__log('connect', options);
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

    private async trySwitchNetwork() {
        this.__log('trySwitchNetwork');

        const networkConfig = getMetamaskNetworkConfig(this._config.wavesConfig.chainId);

        if(networkConfig == null) {
            this.__log('trySwitchNetwork :: skiped');
            return;
        }

        // try to switch on waves network or create it
        try {
            this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain', networkConfig);
            await metamaskApi.switchEthereumChain(networkConfig);
        } catch (err) {
            switch (err.code) {
                case EMetamaskError.CHAIN_NOT_ADDED:
                    this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain', networkConfig);
                    await metamaskApi.addEthereumChain(networkConfig);
                    return;
                case EMetamaskError.REJECT_REQUEST:
                    throw 'Switch to waves network is rejected';
            }

            throw err;
        }
    }

    private async signOneTx(tx: SignerTx): Promise<any> {
        const wavesConfig = this._config.wavesConfig;

        if(tx.type == TRANSACTION_TYPE.TRANSFER) {
            let sign;

            if(tx.assetId === 'WAVES') {
                tx.assetId = null;
            }

            if (tx.assetId === null) {
                sign = await metamaskApi.transferWaves(
                    wavesAddress2eth(tx.recipient),
                    String(tx.amount)
                );
            } else {
                const txInfo = await metamaskApi.transferAsset(
                    tx.assetId!, // todo convert to ethereum asset
                    wavesAddress2eth(tx.recipient),
                    String(tx.amount)
                );

                sign = txInfo.hash.slice(2);
            }

            const result = {
                ...tx,
                id: sign
            };

            this.__log('signOneTx :: result :: ', result);
            return result;

        } else if (tx.type == TRANSACTION_TYPE.INVOKE_SCRIPT) {
            const txInvoke = tx;
            const call = txInvoke.call!;
            const fnName = call.function;
            const dappAddress = txInvoke.dApp;

            const contract = await metamaskApi.createContract(dappAddress, wavesConfig.nodeUrl);

            const abi = findInvokeAbiByName(contract.abi, fnName);
            const paramsValues = serializeInvokeParams(call.args, abi!.inputs);
            const payments = formatPayments(txInvoke.payment || []);

            this.__log('signOneTx :: invoke ', fnName, paramsValues, payments);
            const txInfo = await contract.contract[fnName](
                ...paramsValues,
                payments
            );

            const result = {
                ...tx,
                id: ethTxId2waves(txInfo.hash.slice(2))
            };

            this.__log('signOneTx :: result :: ', result);
            return result;
        }
    }

    private __log(tag: string, ...args) {
        if (this._config.debug) {
            console.log(`ProviderMetamask :: ${tag} : `, ...args);
        }
    }

}
