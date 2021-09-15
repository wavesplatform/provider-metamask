import MetaMaskOnboarding from '@metamask/onboarding';

// @ts-ignore
const ethereumApi = ethereum;

const metamaskApi = {

    _accounts: [],

    isMetaMaskInstalled: MetaMaskOnboarding.isMetaMaskInstalled,

    forwarderOrigin: function() {
        const currentUrl = new URL(window.location.href);
    
        return currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
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

}

export default metamaskApi;
