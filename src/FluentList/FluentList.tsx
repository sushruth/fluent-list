import {
	Flex,
	Grid,
	ICSSInJSStyle,
	Ref,
	CSSProperties,
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
import { Checkbox } from './checkbox/Checkbox';
import { FluentListProps } from './FluentList.types';
import { useTheme } from './helpers/useTheme';

const buffer = 10;
const mainGridStyle: ICSSInJSStyle = {
	contain: 'layout paint',
	listStyle: 'none',
	margin: 0,
	padding: 0,
};

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
			':hover': {
				background: theme.siteVariables.colorScheme.default.backgroundHover,
			},
		}),
		[rowHeight, theme.siteVariables.colorScheme.default.backgroundHover],
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

	return (
		<Flex fill column>
			{enableHeader && (
				<Grid columns={columnDimensions} styles={rowStyle}>
					{enableCheckbox && (
						<Flex vAlign="center" hAlign="center">
							<Checkbox />
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
						return (
							<Grid
								tabIndex={0}
								role="listitem"
								key={item.itemKey}
								styles={rowStyle}
								columns={columnDimensions}
							>
								{enableCheckbox && (
									<Flex vAlign="center" hAlign="center">
										<Checkbox />
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
