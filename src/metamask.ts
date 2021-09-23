import { ethers } from 'ethers';

import MetaMaskOnboarding from '@metamask/onboarding';
import metamaskDetectProvider from '@metamask/detect-provider';

import { wavesAddress2eth } from '@waves/node-api-js';

import { AddEthereumChainParameter } from './Metamask.interface';

const BYTE_CODE = '0x';

// @ts-ignore
const ethereumApi = ethereum;

const metamaskApi = {

    _accounts: [],

    isMetaMaskInstalled: MetaMaskOnboarding.isMetaMaskInstalled,

    detectEthereumProvider: async (): Promise<boolean> => {
        const provider = await metamaskDetectProvider();

        if (provider) {
          // From now on, this should always be true:
          // provider === window.ethereum
          return true;
        } else {
          return false;
        }
    },

    createContract: async function(wavesaddress: string, nodeUrl: string) {
        const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');

        const ethAddress = wavesAddress2eth(wavesaddress);
        const url = `${nodeUrl}/eth/abi/${wavesaddress}`;
        
        // todo to node-api-js
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.error) {
            throw data;
        }

        const bankAbi = data;
        const bankFactory = new ethers.ContractFactory(
            bankAbi,
            BYTE_CODE,
            ethersProvider.getSigner(),
        );

        const contract = await bankFactory.attach(ethAddress);

        return contract;
    },
    // forwarderOrigin: function() {
    //     const currentUrl = new URL(window.location.href);
    
    //     return currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
    // },

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
    getAccounts: async function() {
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

    requestPermissions: async function() {
        try {
            const permissionsArray = await ethereumApi.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }],
            });
    
            return permissionsArray;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getPermissions: async function() {
        try {
            const permissionsArray = await ethereumApi.request({
                method: 'wallet_getPermissions',
            });
    
            return permissionsArray;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    addEthereumChain: async function(networkConfig: AddEthereumChainParameter) {
        try {
            await ethereumApi.request({
                method: 'wallet_addEthereumChain',
                params: [networkConfig],
            });
        } catch (err) {
            throw err;
        }
    },

    switchEthereumChain: async function(networkConfig: AddEthereumChainParameter) {
        try {
            await ethereumApi.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkConfig.chainId }],
            });
        } catch (err) {
            throw err;
        }
    },

    // getEncryptionKey: async function(accounts) {
    //     try {
    //       const result = await ethereumApi.request({
    //         method: 'eth_getEncryptionPublicKey',
    //         params: [accounts[0]],
    //       });

    //       return result;
    //     } catch (err) {
    //       throw err;
    //     }
    // },

    sendTransaction: async function(transaction: any): Promise<string> {
        const transactionParameters = {
            nonce: '0x00', // ignored by MetaMask
            gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
            gas: '0x2710', // customizable by user during MetaMask confirmation.
            to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
            from: ethereumApi.selectedAddress, // must match user's active address.
            value: '0x00', // Only required to send ether to the recipient from the initiating external account.
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
            chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await ethereumApi.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        return txHash;
        // ethereumApi
        //     .request({
        //         method: 'eth_sendTransaction',
        //         params: [transactionParameters],
        //     })
        //     .then((result) => {
        //         // The result varies by RPC method.
        //         // For example, this method will return a transaction hash hexadecimal string on success.
        //     })
        //     .catch((error) => {
        //         // If the request fails, the Promise will reject with an error.
        //     });
    },

    signTypedData: async function(params) {
        params = [
            {
                type: 'string',
                name: 'Message',
                value: 'Hi, Alice!',
            },
            {
                type: 'uint32',
                name: 'A number',
                value: '1337',
            },
        ];

        const from = this._accounts[0];

        const sign = await ethereumApi.request({
            method: 'eth_signTypedData',
            params: [params, from],
        });
    }
}

export default metamaskApi;
