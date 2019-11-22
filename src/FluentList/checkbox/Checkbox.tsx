import {
	ComponentEventHandler,
	Flex,
	FlexProps,
	ICSSInJSStyle,
	Status,
} from '@stardust-ui/react';
import * as React from 'react';
import { useCallback } from 'react';
import { Key } from '../FluentList.types';

const checkboxStyle: ICSSInJSStyle = {
	appearance: 'none',
	cursor: 'pointer',
	':focus': { outline: 'none' },
};

type CheckBoxProps = {
	checked?: boolean;
	itemKey?: Key;
	onClick: ComponentEventHandler<FlexProps>;
};

export const ListCheckbox: React.FC<CheckBoxProps> = ({
	checked,
	onClick,
	itemKey,
}) => {
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
			styles={checkboxStyle}
			role="checkbox"
			aria-checked={checked}
		>
			<Status
				icon={checked ? 'stardust-checkmark' : undefined}
				size="largest"
				state={checked ? 'success' : 'unknown'}
			/>
		</Flex>
	);
};
