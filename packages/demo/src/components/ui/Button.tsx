import React from "react";

import MButton, { ButtonProps } from '@mui/material/Button';

interface IProps extends ButtonProps {}

const Component = MButton;

export class Button extends React.Component<IProps> {

	render() {
		const { children, ...props } = this.props;

		return <Component variant="contained" {...props}>{children}</Component>;
	}
}
