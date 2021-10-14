# ProviderMetamask

* [Overview](#overview)
* [Getting Started](#getting-started)

<a id="overview"></a>
## Overview

ProviderMetamask

<a id="getting-started"></a>
## Getting Started

### 1. Library installation

To install Signer and ProviderMetamask libraries use

```bash
npm i @waves/signer @waves/provider-metamask
```

### 2. Library initialization

Add library initialization to your app.

* For Stagenet:

   ```js
   import { Signer } from '@waves/signer';
   import { ProviderMetamask } from '@waves/provider-metamask';

   const signer = new Signer({
     // Specify URL of the node on Stagenet
     NODE_URL: 'https://nodes-stagenet.wavesnodes.com'
   });
   const provider = new ProviderMetamask({
        wavesConfig: {
            nodeUrl: 'https://nodes-stagenet.wavesnodes.com',
            chainId: 'S'.charCodeAt(0)
        }
   });
   signer.setProvider(provider);
   ```

* For Mainnet:

   ```js
   import { Signer } from '@waves/signer';
   import { ProviderMetamask } from '@waves/provider-metamask';

   const signer = new Signer();
   const provider = new ProviderMetamask();
   signer.setProvider(provider);
   ```

### 3. Basic example

Now your application is ready to work with Waves Platform. Let's test it by implementing basic functionality. For example, we could try to authenticate user and transfer funds.

```js
const user = await signer.login();
const [transfer] = await signer
  .transfer({
    amount: 1,
    recipient: 'alias:T:merry',
  })
  .signAndBroadcast();
```

For more information see [Signer documentation](https://github.com/wavesplatform/signer/blob/master/README.md).

### 4. How to get Ethereum address

```js
import { ProviderMetamask } from '@waves/provider-metamask';
import { wavesAddress2eth } from '@waves/node-api-js';

const user = await signer.login();
const ethereumAddress = wavesAddress2eth(user.address);
```
