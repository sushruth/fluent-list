import { ICSSInJSStyle, Status } from '@stardust-ui/react';
import * as React from 'react';

const checkboxStyle: ICSSInJSStyle = {
	appearance: 'none',
	cursor: 'pointer',
	':focus': { outline: 'none' },
};

export const ListCheckbox: React.FC<React.HTMLAttributes<HTMLInputElement> & {
	checked?: boolean;
}> = ({ checked, onClick, ...rest }) => {
	return (
		<Status
			role="checkbox"
			icon={checked ? 'stardust-checkmark' : undefined}
			onClick={onClick}
			aria-checked={checked}
			size="largest"
			state={checked ? 'success' : 'unknown'}
			styles={checkboxStyle}
			as="div"
			{...rest}
		/>
	);
};
