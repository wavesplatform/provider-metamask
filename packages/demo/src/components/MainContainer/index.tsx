import React from "react";
import { inject, observer } from 'mobx-react';

import { MainStore } from "@stores";
import { Card, Button, Textfield } from '@components/ui';

interface IProps {
    mainStore?: MainStore;
}

import { EChainId } from '@waves/ts-types';
const mainnetChainId = 87;
console.log(mainnetChainId, EChainId.MAINNET, EChainId.MAINNET === mainnetChainId);

// const data2json = (data: any) => JSON.stringify(data, null, ' ');

@inject('mainStore')
@observer
export class MainContainer extends React.Component<IProps> {

    render() {
        const {
            transferData,
            typedData,
            orderData,
            signTransferResult,
            signTypedDataResult,
            signOrderResult,
        } = this.props.mainStore!;

        return (
            <div style={{ display: 'flex', marginTop: '32px' }}>
                <Card>
                    <div><h3>Transfer</h3><p /></div>
                    <Textfield
                        multiline
                        rows={10}
                        defaultValue={transferData}
                        onChange={(ev) => this.props.mainStore!.changeTransferData(ev.target.value)}
                    /><br />
                    <Textfield placeholder='result' value={signTransferResult}/><br />
                    <Button fullWidth onClick={() => this.onClickSendTransfer()}>transfer</Button>
                </Card>
                <Card>
                    <div><h3>Sign typed data</h3><p /></div>
                    <Textfield
                        multiline
                        rows={10}
                        defaultValue={typedData}
                        onChange={(ev) => this.props.mainStore!.changeTypedData(ev.target.value)}
                    /><br />
                    <Textfield placeholder='result' value={signTypedDataResult} /><br />
                    <Button fullWidth onClick={() => this.onClickSignCustomData()}>Sign typed Data</Button>
                </Card>
                <Card>
                    <div><h3>Order</h3><p /></div>
                    <Textfield
                        multiline
                        rows={10}
                        defaultValue={orderData}
                        onChange={(ev) => this.props.mainStore!.changeOrderData(ev.target.value)}
                    /><br />
                    <Textfield placeholder='result' value={signOrderResult}/><br />
                    <Button fullWidth onClick={() => this.onClickSignOrder()}>Sign Order</Button>
                </Card>
            </div>
        );
    }

    onClickSendTransfer() {
        this.props.mainStore!.sendTransfer();
    }

    onClickSignCustomData() {
        this.props.mainStore!.signCustomData();
    }

    onClickSignOrder() {
        this.props.mainStore!.signOrder();
    }

}
