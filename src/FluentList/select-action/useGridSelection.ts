import { ComponentEventHandler, FlexProps } from '@stardust-ui/react';
import { useCallback, useRef, useState } from 'react';
import * as Im from 'seamless-immutable';
import { FluentListItem, Key } from '../FluentList.types';

export function useGridSelection<D>(items: FluentListItem<D>[]) {
	const [allRowsSelected, setAllRowsSelection] = useState(false);
	const keyFocussed = useRef('');

	const [rowSelected, setRowSelected] = useState(() => {
		const result: Record<string, boolean> = {};
		for (const item of items) {
			result[item.itemKey] = false;
		}
		return Im.from(result);
	});

	const toggleItemWithKey = useCallback(
		(key: Key) => {
			setRowSelected(state => {
				if (state[key] && allRowsSelected) {
					setAllRowsSelection(false);
				}
				return state.set(key, !state[key]);
			});
		},
		[allRowsSelected],
	);

	const toggleItemSelect = useCallback(
		(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			const key = (event.currentTarget as HTMLDivElement).dataset.key;
			if (key) {
				toggleItemWithKey(key);
			}
		},
		[toggleItemWithKey],
	);

	const toggleAllSelect = useCallback(() => {
		setAllRowsSelection(state => {
			if (state) {
				setRowSelected(Im.from({}));
			} else {
				const result: Record<string, boolean> = {};
				for (const item of items) {
					result[item.itemKey] = true;
				}
				setRowSelected(Im.from(result));
			}
			return !state;
		});
	}, [items]);

	const onRowFocus = useCallback(
		(itemKey: string): ComponentEventHandler<FlexProps> => () => {
			keyFocussed.current = itemKey;
		},
		[],
	);

	const onRowEvent = useCallback(
		(key: string): ComponentEventHandler<FlexProps> => event => {
			const e = (event as unknown) as React.KeyboardEvent;
			if (e.keyCode === 32) {
				// space
				e.preventDefault();
				return toggleItemWithKey(keyFocussed.current);
			}

			if (e.keyCode === 9) {
				// TODO figure out how to handle tab
				e.preventDefault();
			}

			let toFocus = undefined;

			if (e.keyCode === 38) {
				// up arrow
				e.preventDefault();
				toFocus = (e.target as HTMLDivElement)
					.previousElementSibling as HTMLDivElement;
			} else if (e.keyCode === 40) {
				// down arrow
				e.preventDefault();
				toFocus = (e.target as HTMLDivElement)
					.nextElementSibling as HTMLDivElement;
			}

			if (toFocus) {
				toFocus && toFocus.focus();
				if (e.shiftKey) {
					setRowSelected(state =>
						state.set(keyFocussed.current, true).set(key, true),
					);
				}
			}

			if (e.type === 'click') {
				return toggleItemWithKey(keyFocussed.current);
			}
		},
		[toggleItemWithKey],
	);

	return {
		rowSelected,
		toggleItemSelect,
		toggleAllSelect,
		onRowFocus,
		onRowEvent,
		allRowsSelected,
	};
}
