import { Flex, ICSSInJSStyle, Status } from '@stardust-ui/react';
import * as React from 'react';
import { useCallback } from 'react';
import { Key } from '../FluentList.types';

const checkboxStyle: ICSSInJSStyle = {
	appearance: 'none',
	cursor: 'pointer',
	':focus': { outline: 'none' },
};

export const ListCheckbox: React.FC<React.HTMLAttributes<HTMLDivElement> & {
	checked?: boolean;
	itemKey?: Key;
}> = ({ checked, onClick, itemKey, ...rest }) => {
	const clickHandler = useCallback(
		event => {
			event.stopPropagation();
			onClick && onClick(event);
		},
		[onClick],
	);

	return (
		<Flex
			vAlign="center"
			hAlign="center"
			onClick={clickHandler}
			data-key={itemKey}
		>
			<Status
				role="checkbox"
				icon={checked ? 'stardust-checkmark' : undefined}
				aria-checked={checked}
				size="largest"
				state={checked ? 'success' : 'unknown'}
				styles={checkboxStyle}
				as="div"
				{...rest}
			/>
		</Flex>
	);
};
