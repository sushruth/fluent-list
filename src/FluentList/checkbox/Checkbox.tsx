import { ICSSInJSStyle, Status } from '@stardust-ui/react';
import * as React from 'react';

const checkboxStyle: ICSSInJSStyle = {
	appearance: 'none',
	':focus': { outline: 'none' },
};

export const Checkbox: React.FC<React.HTMLAttributes<HTMLInputElement> & {
	checked?: boolean;
}> = ({ checked, onClick, ...rest }) => {
	return (
		<Status
			role="checkbox"
			icon="stardust-checkmark"
			onClick={onClick}
			aria-checked={checked}
			size="largest"
			styles={checkboxStyle}
			as="font"
			{...rest}
			// type="checkbox"
		/>
	);
};
