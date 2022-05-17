import React from "react";

import MTextField, { TextFieldProps } from '@mui/material/TextField';

type IProps = TextFieldProps;

const Component = MTextField;

export class Textfield extends React.Component<IProps> {

	render() {
		const { children, ...props } = this.props;

		return (
			<Component {...props}>
				{children}
			</Component>
		);
	}
}
