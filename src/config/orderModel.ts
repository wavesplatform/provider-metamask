export const ORDER_MODEL = {
    "types": {
      "EIP712Domain": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "version",
          "type": "string"
        },
        {
          "name": "chainId",
          "type": "uint256"
        },
        {
          "name": "verifyingContract",
          "type": "address"
        }
      ],
      "Order": [
        {
          "name": "version",
          "type": "int32"
        },
        {
          "name": "matcherPublicKey",
          "type": "string"
        },
        {
          "name": "amountAsset",
          "type": "string"
        },
        {
          "name": "priceAsset",
          "type": "string"
        },
        {
          "name": "orderType",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "int64"
        },
        {
          "name": "price",
          "type": "int64"
        },
        {
          "name": "timestamp",
          "type": "int64"
        },
        {
          "name": "expiration",
          "type": "int64"
        },
        {
          "name": "matcherFee",
          "type": "int64"
        },
        {
          "name": "matcherFeeAssetId",
          "type": "string"
        }
      ]
    },
    "primaryType": "Order",
    "domain": {
      "name": "Waves Exchange",
      "version": "1",
      "chainId": 67,
      "verifyingContract": "0x4343434343434343434343434343434343434343"
    },

    // https://confluence.wavesplatform.com/pages/viewpage.action?pageId=1680808498#id-78.Metamask-Order
    "message": {
      "version": 4,
      "matcherPublicKey": "", // "9cpfKN9suPNvfeUNphzxXMjcnn974eme8ZhWUjaktzU5",
      "amountAsset": "", // "4LHHvYGNKJUg5hj65aGD5vgScvCBmLpdRFtjokvCjSL8",
      "priceAsset": "", // "WAVES",
      "orderType": "", //"BUY",
      "amount": 0, // 10000000,
      "price": 0, //100000000,
      "timestamp": 0, //1628254368949,
      "expiration": 0, // 1629982368949,
      "matcherFee": 0, //300000,
      "matcherFeeAssetId": "WAVES",
    //   "sender": "",
    //   "senderPublicKey": "",
    }
};

// export const ORDER_MODEL = {
//     "types": {
//       "EIP712Domain": [
//         {
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "name": "version",
//           "type": "string"
//         },
//         {
//           "name": "chainId",
//           "type": "uint256"
//         },
//         {
//           "name": "verifyingContract",
//           "type": "address"
//         }
//       ],
//       "Order": [
//         {
//           "name": "version",
//           "type": "int32"
//         },
//         {
//           "name": "matcherPublicKey",
//           "type": "string"
//         },
//         {
//           "name": "amountAsset",
//           "type": "string"
//         },
//         {
//           "name": "priceAsset",
//           "type": "string"
//         },
//         {
//           "name": "orderType",
//           "type": "string"
//         },
//         {
//           "name": "amount",
//           "type": "int64"
//         },
//         {
//           "name": "price",
//           "type": "int64"
//         },
//         {
//           "name": "timestamp",
//           "type": "int64"
//         },
//         {
//           "name": "expiration",
//           "type": "int64"
//         },
//         {
//           "name": "matcherFee",
//           "type": "int64"
//         },
//         {
//           "name": "matcherFeeAssetId",
//           "type": "string"
//         }
//       ]
//     },
//     "primaryType": "Order",
//     "domain": {
//       "name": "Waves Exchange",
//       "version": "1",
//       "chainId": 67,
//       "verifyingContract": "0x4343434343434343434343434343434343434343"
//     },
//     "message": {
//       "version": 4,
//       "matcherPublicKey": "9cpfKN9suPNvfeUNphzxXMjcnn974eme8ZhWUjaktzU5",
//       "amountAsset": "4LHHvYGNKJUg5hj65aGD5vgScvCBmLpdRFtjokvCjSL8",
//       "priceAsset": "WAVES",
//       "orderType": "BUY",
//       "amount": 10000000,
//       "price": 100000000,
//       "timestamp": 1628254368949,
//       "expiration": 1629982368949,
//       "matcherFee": 300000,
//       "matcherFeeAssetId": "WAVES"
//     }
//   };
