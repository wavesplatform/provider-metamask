import { ethers } from 'ethers';

import MetaMaskOnboarding from '@metamask/onboarding';
// import metamaskDetectProvider from '@metamask/detect-provider';
import { wavesAddress2eth } from '@waves/node-api-js';

import {
    AddEthereumChainParameter,
    EthereumAddress,
    IAbi,
    IContractMeta,
    IMMTypedData,
    MetamaskSign,
} from './Metamask.interface';

import { ABI_TRANSFER_CUSTOM_TOKEN } from './config';
import { toEthereumAmount } from './utils';

const BYTE_CODE = '0x';

// @ts-ignore
const ethereumApi = window['ethereum'];

const metamaskApi = {

    _accounts: [],

    // detectEthereumProvider: async (): Promise<boolean> => {
    //     const provider = await metamaskDetectProvider();

    //     if (provider) {
    //       // From now on, this should always be true:
    //       // provider === window.ethereum
    //       return true;
    //     } else {
    //       return false;
    //     }
    // },

    getEncryptionPublicKey: async function() {
        const from = this._accounts[0];

        try {
          const result = await ethereumApi.request({
            method: 'eth_getEncryptionPublicKey',
            params: [from],
          });

          return result;
        } catch (err) {
          throw err;
        }
    },

    createContract: async function(wavesaddress: string, nodeUrl: string): Promise<IContractMeta> {
        const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');

        const ethAddress = wavesAddress2eth(wavesaddress);
        const url = `${nodeUrl}/eth/abi/${wavesaddress}`;
        
        // todo to node-api-js
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.error) {
            throw data;
        }

        const bankAbi: IAbi[] = data;
        const bankFactory = new ethers.ContractFactory(
            bankAbi,
            BYTE_CODE,
            ethersProvider.getSigner(),
        );

        const contract = await bankFactory.attach(ethAddress);

        return {
            contract,
            abi: bankAbi
        };
    },

    requestAccounts: async function(): Promise<string[]> {
        try {
            const newAccounts = await ethereumApi.request({
                method: 'eth_requestAccounts',
            });

            this._accounts = newAccounts;

            return this._accounts;
            // onRequest(newAccounts);
        } catch (error) {
            console.error(error);
            throw 'Error requestAccounts';
        }
    },

    //
    getAccounts: async function(): Promise<EthereumAddress[]> {
        try {
            const newAccounts = await ethereumApi.request({
                method: 'eth_accounts',
            });
    
            this._accounts = newAccounts;

            return this._accounts
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // requestPermissions: async function() {
    //     try {
    //         const permissionsArray = await ethereumApi.request({
    //             method: 'wallet_requestPermissions',
    //             params: [{ eth_accounts: {} }],
    //         });
    
    //         return permissionsArray;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },

    // getPermissions: async function() {
    //     try {
    //         const permissionsArray = await ethereumApi.request({
    //             method: 'wallet_getPermissions',
    //         });
    
    //         return permissionsArray;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },

    addEthereumChain: async function(networkConfig: AddEthereumChainParameter): Promise<void> {
        try {
            await ethereumApi.request({
                method: 'wallet_addEthereumChain',
                params: [networkConfig],
            });
        } catch (err) {
            throw err;
        }
    },

    switchEthereumChain: async function(networkConfig: AddEthereumChainParameter): Promise<void> {
        try {
            await ethereumApi.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkConfig.chainId }],
            });
        } catch (err) {
            throw err;
        }
    },

    /* sendEIP1559 */
    async transferWaves(recipient: EthereumAddress, amount: string): Promise<MetamaskSign> {
        const WAVES_DECIMALS = 8;
        const ethAmount = toEthereumAmount(Number(amount), 8);
        const amountInHex = `0x${ethAmount.toString(16)}`;

        const from = this._accounts[0];
        const params = {
            from: from,
            to: recipient,
            value: amountInHex,
            // gasLimit: '0x5028',
            // maxFeePerGas: '0x2540be400',
            // maxPriorityFeePerGas: '0x3b9aca00',
        };

        const result: MetamaskSign = await ethereumApi.request({
            method: 'eth_sendTransaction',
            params: [params],
        });

        return result;
    },

    async transferAsset(wavesAssetId: string, recipient: string, amount: string): Promise<any> {
        const from = this._accounts[0];

        const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');
        const transferAbi = ABI_TRANSFER_CUSTOM_TOKEN;
    
        const bankFactory = new ethers.ContractFactory(
            transferAbi,
            BYTE_CODE,
            ethersProvider.getSigner(),
        );

        const ethAssetId = wavesAssetId;
        const contract = await bankFactory.attach(ethAssetId);

        const result = await contract.transfer(
            recipient,
            amount,
            {
              from: from,
            //   gasLimit: 10,
            //   gasPrice: '100000',
            }
        );

        return result;
    },

    signOrder: async function(order: any): Promise<MetamaskSign> {
        return this.signTypedDataV4(JSON.stringify(order));
    },

    signTypedDataV4: async function(data: string): Promise<MetamaskSign> {
        const from = this._accounts[0];

        const sign = await ethereumApi.request({
            method: 'eth_signTypedData_v4',
            params: [from, data],
        });

        return sign;
    },

    signTypedData: async function(params: IMMTypedData[]): Promise<MetamaskSign> {
        const from = this._accounts[0];

        const sign: MetamaskSign = await ethereumApi.request({
            method: 'eth_signTypedData',
            params: [params, from],
        });

        return sign;
    },

    // sendTransaction: async function(transaction: any): Promise<MetamaskSign> {
    //     const transactionParameters = {
    //         nonce: '0x00', // ignored by MetaMask
    //         gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    //         gas: '0x2710', // customizable by user during MetaMask confirmation.
    //         to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
    //         from: ethereumApi.selectedAddress, // must match user's active address.
    //         value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    //         data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    //         chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    //     };

    //     // txHash is a hex string
    //     // As with any RPC call, it may throw an error
    //     const txHash = await ethereumApi.request({
    //         method: 'eth_sendTransaction',
    //         params: [transactionParameters],
    //     });

    //     return txHash;
    //     // ethereumApi
    //     //     .request({
    //     //         method: 'eth_sendTransaction',
    //     //         params: [transactionParameters],
    //     //     })
    //     //     .then((result) => {
    //     //         // The result varies by RPC method.
    //     //         // For example, this method will return a transaction hash hexadecimal string on success.
    //     //     })
    //     //     .catch((error) => {
    //     //         // If the request fails, the Promise will reject with an error.
    //     //     });
    // },

}

export const isMetaMaskInstalled = () => MetaMaskOnboarding.isMetaMaskInstalled();

export default metamaskApi;
