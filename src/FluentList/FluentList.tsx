import {
	CSSProperties,
	Flex,
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
import { Checkbox } from './checkbox/Checkbox';
import { FluentListProps } from './FluentList.types';
import { useTheme } from './helpers/useTheme';

const buffer = 10;

const imageStyle: CSSProperties = {
	opacity: 0,
};

export function FluentList<D>({
	items,
	columns,
	enableCheckbox,
	enableHeader,
	rowHeight,
}: FluentListProps<D>) {
	const [pageArray, setPageArray] = useState<undefined[]>([]);
	const rootHeight = useRef<number | undefined>(0);
	const mainGrid = createRef<HTMLDivElement>();
	const animationFrameRequestToken = useRef<number | undefined>(0);
	const scrollPosition = useRef(window.scrollY);

	const [threshold, setThreshold] = useState({ min: 0, max: 0 });

	const { theme } = useTheme();

	const setScroll = useCallback(() => {
		setThreshold(() => {
			const min = Math.max(
				Math.floor(scrollPosition.current / rowHeight) - buffer,
				0,
			);
			const max = Math.min(
				pageArray.length + min + 2 * buffer,
				items.length - 1,
			);
			return {
				min,
				max,
			};
		});
	}, [items.length, pageArray.length, rowHeight]);

	const mainGridObserver = useRef(
		new IntersectionObserver(([entry]) => {
			rootHeight.current = entry.rootBounds?.height || 0 / rowHeight;
			const pageSize = Math.ceil(rootHeight.current / rowHeight) + buffer;
			setPageArray(Array(pageSize + buffer).fill(undefined));
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
					console.log(state[key], allRowsSelected);
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

	const mainGridStyle: ICSSInJSStyle = useMemo(
		() => ({
			contain: 'layout paint',
			listStyle: 'none',
			margin: 0,
			padding: 0,
			height: items.length * rowHeight,
		}),
		[items.length, rowHeight],
	);

	return (
		<Flex fill column>
			{enableHeader && (
				<Grid columns={columnDimensions} styles={rowStyle}>
					{enableCheckbox && (
						<Flex vAlign="center" hAlign="center">
							<Checkbox onClick={toggleAllSelect} checked={allRowsSelected} />
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
				<Flex role="listbox" column styles={mainGridStyle}>
					<img
						style={imageStyle}
						role="presentation"
						alt=""
						height={Math.max(threshold.min, 0) * rowHeight}
					/>
					{pageArray.map((_, index) => {
						const item = items[threshold.min + index];
						if (!item) {
							return null;
						}
						const shouldCheck = rowSelected[item.itemKey];
						return (
							<Grid
								tabIndex={0}
								role="listitem"
								key={item.itemKey}
								styles={rowStyle}
								className={shouldCheck ? 'selected' : undefined}
								columns={columnDimensions}
							>
								{enableCheckbox && (
									<Flex vAlign="center" hAlign="center">
										<Checkbox
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
					<img
						style={imageStyle}
						role="presentation"
						alt=""
						height={Math.max(items.length - threshold.max, 0) * rowHeight}
					/>
				</Flex>
			</Ref>
		</Flex>
	);
}
