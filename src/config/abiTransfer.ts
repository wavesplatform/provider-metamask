
// Only for assets, not for WAVES
export const ABI_TRANSFER_CUSTOM_TOKEN = [{
    "constant": false,
    "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "transfer",
    "outputs": [
        {
            "name": "success",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}];
