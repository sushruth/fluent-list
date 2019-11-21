import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	createRef,
} from 'react';
import { getNearestScrollableParent } from '../helpers/getNearestScrollableParent';

export function useGridScrollAction(length: number, rowHeight: number) {
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

	useLayoutEffect(() => {
		if (mainGrid.current) {
			mainGridObserver.current.observe(mainGrid.current);
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
	}, [getScroll, mainGrid, pageArray.length, rowHeight, setScroll]);

	return { threshold, pageArray, mainGrid };
}
