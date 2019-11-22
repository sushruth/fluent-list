import {
	createRef,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { FLuentListColumn } from '../FluentList.types';
import { getNearestScrollableParent } from '../helpers/getNearestScrollableParent';

export function useGridScrollAction<D>(
	length: number,
	rowHeight: number,
	enableCheckbox: boolean,
	columns: FLuentListColumn<D>[],
	autoAdjustColumns: boolean,
) {
	const mainGrid = createRef<HTMLDivElement>();
	const [pageArray, setPageArray] = useState<undefined[]>([]);
	const rootHeight = useRef(0);
	const pageSize = useRef(0);
	const animationFrameRequestToken = useRef<number | undefined>(0);
	const scrollParent = useRef<Element | Window>(window);
	const getScroll = useCallback(() => {
		return scrollParent.current === window
			? window.scrollY
			: (scrollParent.current as HTMLElement).scrollTop;
	}, []);

	const [columnDimensions, setColumnDimensions] = useState(() =>
		[
			enableCheckbox ? '48px' : '',
			...columns.map(
				column => `minmax(${column.gridColumnTemplate.min}px, 1fr)`,
			),
		].join(' '),
	);

	const scrollPosition = useRef(getScroll());

	const [threshold, setThreshold] = useState({ min: 0, max: 0 });

	const mainGridObserver = useRef(
		new IntersectionObserver(([entry]) => {
			rootHeight.current =
				(scrollParent.current === window
					? entry.rootBounds?.height
					: (scrollParent.current as HTMLElement).clientHeight) ||
				0 / rowHeight;
			pageSize.current = Math.ceil(rootHeight.current / rowHeight);
			setPageArray(Array(3 * pageSize.current).fill(undefined));
			setScroll();
		}),
	);

	const setScroll = useCallback(() => {
		setThreshold(() => {
			const min = Math.max(
				Math.floor(scrollPosition.current / rowHeight - pageSize.current),
				0,
			);
			const max = Math.min(3 * pageSize.current + min, length - 1);
			return {
				min,
				max,
			};
		});
	}, [length, rowHeight]);

	const adjustColumns = useCallback(() => {
		if (mainGrid.current && mainGrid.current.firstElementChild) {
			let accumulate = 0;
			const colTemplates: string[] = [enableCheckbox ? '48px' : ''];
			for (let column of columns) {
				if (
					accumulate + column.gridColumnTemplate.min <
					mainGrid.current.firstElementChild.scrollWidth
				) {
					colTemplates.push(`minmax(${column.gridColumnTemplate.min}px, 1fr)`);
					accumulate += column.gridColumnTemplate.min;
				}
			}
			setColumnDimensions(colTemplates.join(' '));
		}
	}, [columns, enableCheckbox, mainGrid]);

	useLayoutEffect(() => {
		if (mainGrid.current) {
			mainGridObserver.current.observe(mainGrid.current);
			if (autoAdjustColumns) {
				adjustColumns();
				window.addEventListener('resize', () => {
					console.log('Hello');
					adjustColumns();
				});
			}
			scrollParent.current = getNearestScrollableParent(mainGrid.current);
			if (rootHeight.current) {
				scrollParent.current.addEventListener('scroll', () => {
					window.cancelAnimationFrame(animationFrameRequestToken.current || -1);
					scrollPosition.current = getScroll() || 0;
					animationFrameRequestToken.current = window.requestAnimationFrame(
						setScroll,
					);
				});
			}
		}
	}, [
		adjustColumns,
		autoAdjustColumns,
		getScroll,
		mainGrid,
		pageArray.length,
		rowHeight,
		setScroll,
	]);

	return { threshold, pageArray, mainGrid, columnDimensions };
}
