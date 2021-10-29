import React from "react";

import { styled } from '@mui/styles';


const Component = styled('div')({
    boxSizing: 'border-box',
    width: 'calc(33.33% - 16px)',
    margin: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)',
    padding: '0 16px 16px',
    borderRadius: '.25rem',
    flex: '1 1 auto',
});

export class Card extends React.Component {

    render() {
        const { children } = this.props;

        return <Component>{children}</Component>;
    }
}
