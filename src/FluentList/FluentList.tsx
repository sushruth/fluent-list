import {
	ComponentEventHandler,
	Flex,
	FlexProps,
	Grid,
	ICSSInJSStyle,
	Ref,
} from '@stardust-ui/react';
import * as React from 'react';
import {
	createRef,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import * as Im from 'seamless-immutable';
import { ListCheckbox } from './checkbox/Checkbox';
import { FluentListProps } from './FluentList.types';
import { useTheme } from './helpers/useTheme';

export function FluentList<D>({
	items,
	columns,
	enableCheckbox,
	enableHeader,
	rowHeight,
}: FluentListProps<D>) {
	const [pageArray, setPageArray] = useState<undefined[]>([]);
	const rootHeight = useRef(0);
	const rowFocussed = useRef('');
	const pageSize = useRef(0);
	const mainGrid = createRef<HTMLDivElement>();
	const animationFrameRequestToken = useRef<number | undefined>(0);
	const scrollPosition = useRef(window.scrollY);

	const [threshold, setThreshold] = useState({ min: 0, max: 0 });

	const { theme } = useTheme();

	const setScroll = useCallback(() => {
		setThreshold(() => {
			const min = Math.max(
				Math.floor(scrollPosition.current / rowHeight) - pageSize.current,
				0,
			);
			const max = Math.min(3 * pageSize.current + min, items.length - 1);
			return {
				min,
				max,
			};
		});
	}, [items.length, rowHeight]);

	const mainGridObserver = useRef(
		new IntersectionObserver(([entry]) => {
			rootHeight.current = entry.rootBounds?.height || 0 / rowHeight;
			pageSize.current = Math.ceil(rootHeight.current / rowHeight);
			setPageArray(Array(3 * pageSize.current).fill(undefined));
			setScroll();
		}),
	);

	const columnDimensions = useMemo(
		() =>
			[
				enableCheckbox ? '48px' : '',
				...columns.map(column => column.gridColumnTemplate),
			].join(' '),
		[columns, enableCheckbox],
	);

	const rowStyle = useMemo(
		(): ICSSInJSStyle => ({
			minHeight: `${rowHeight}px`,
			maxHeight: `${rowHeight}px`,
			overflow: 'hidden',
			position: 'absolute',
			left: 0,
			right: 0,
			contain: 'layout style paint',
			borderBottom: `1px solid ${theme.siteVariables.colorScheme.default.border1}`,
			':hover': {
				background: theme.siteVariables.colorScheme.default.backgroundHover,
			},
			':focus': {
				outlineColor: theme.siteVariables.colorScheme.default.borderActive,
				outlineStyle: 'solid',
			},
			'&.selected': {
				background: theme.siteVariables.colorScheme.default.backgroundActive,
				borderBottom: `1px solid ${theme.siteVariables.colorScheme.default.borderActive1}`,
				':hover': {
					background:
						theme.siteVariables.colorScheme.default.backgroundActiveHover,
				},
			},
		}),
		[
			rowHeight,
			theme.siteVariables.colorScheme.default.backgroundActive,
			theme.siteVariables.colorScheme.default.backgroundActiveHover,
			theme.siteVariables.colorScheme.default.backgroundHover,
			theme.siteVariables.colorScheme.default.border1,
			theme.siteVariables.colorScheme.default.borderActive,
			theme.siteVariables.colorScheme.default.borderActive1,
		],
	);

	useLayoutEffect(() => {
		if (mainGrid.current) {
			mainGridObserver.current.observe(mainGrid.current);
			if (rootHeight.current) {
				window.addEventListener('scroll', event => {
					window.cancelAnimationFrame(animationFrameRequestToken.current || -1);
					scrollPosition.current = window.scrollY || 0;
					animationFrameRequestToken.current = window.requestAnimationFrame(
						setScroll,
					);
				});
			}
		}
	}, [items.length, mainGrid, pageArray.length, rowHeight, setScroll]);

	const [allRowsSelected, setAllRowsSelection] = useState(false);
	const [rowSelected, setRowSelected] = useState(() => {
		const result: Record<string, boolean> = {};
		for (const item of items) {
			result[item.itemKey] = false;
		}
		return Im.from(result);
	});

	const toggleItemSelect = useCallback(
		(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			const key = (event.currentTarget as HTMLDivElement).dataset.key;
			if (key) {
				setRowSelected(state => {
					if (state[key] && allRowsSelected) {
						setAllRowsSelection(false);
					}
					return state.set(key, !state[key]);
				});
			}
		},
		[allRowsSelected],
	);

	const toggleAllSelect = useCallback(() => {
		console.log('Toggle all');
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
			rowFocussed.current = itemKey;
		},
		[],
	);

	const onRowKeyDown: ComponentEventHandler<FlexProps> = useCallback(event => {
		const e = (event as unknown) as React.KeyboardEvent;
		if (e.keyCode === 32) {
			setRowSelected(state => state.set(rowFocussed.current, true));
			e.preventDefault();
		}
	}, []);

	const mainGridStyle: ICSSInJSStyle = useMemo(
		() => ({
			listStyle: 'none',
			position: 'relative',
			margin: 0,
			padding: 0,
			contain: 'layout style paint',
			minHeight: `${items.length * rowHeight}px`,
			height: `${items.length * rowHeight}px`,
			maxHeight: `${items.length * rowHeight}px`,
		}),
		[items.length, rowHeight],
	);

	return (
		<Flex fill column>
			{enableHeader && (
				<Grid columns={columnDimensions} styles={rowStyle}>
					{enableCheckbox && (
						<Flex vAlign="center" hAlign="center">
							<ListCheckbox
								onClick={toggleAllSelect}
								checked={allRowsSelected}
							/>
						</Flex>
					)}
					{columns.map(column => (
						<Flex vAlign="center" key={`column-header-${column.columnKey}`}>
							{React.createElement(column.headerComponent, { column }, null)}
						</Flex>
					))}
				</Grid>
			)}
			<Ref innerRef={mainGrid}>
				<Flex
					role="listbox"
					column
					styles={mainGridStyle}
					style={{ top: `${enableHeader ? rowHeight : 0}px` }}
				>
					{pageArray.map((_, index) => {
						const itemIndex = threshold.min + index;
						const item = items[itemIndex];
						if (!item) {
							return null;
						}
						const shouldCheck = rowSelected[item.itemKey];
						return (
							<Grid
								tabIndex={0}
								role="listitem"
								key={item.itemKey}
								style={{
									top: `${itemIndex * rowHeight}px`,
								}}
								styles={rowStyle}
								className={shouldCheck ? 'selected' : undefined}
								columns={columnDimensions}
								onFocus={onRowFocus(item.itemKey)}
								onKeyDown={onRowKeyDown}
							>
								{enableCheckbox && (
									<Flex vAlign="center" hAlign="center">
										<ListCheckbox
											data-key={item.itemKey}
											onClick={toggleItemSelect}
											checked={shouldCheck}
										/>
									</Flex>
								)}
								{columns.map(column =>
									React.createElement(
										column.itemComponent,
										{
											item,
											column,
											key: `${item.itemKey}-${column.columnKey}`,
										},
										null,
									),
								)}
							</Grid>
						);
					})}
				</Flex>
			</Ref>
		</Flex>
	);
}
