import { ICSSInJSStyle } from '@stardust-ui/react';
import { useMemo } from 'react';
import { useTheme } from '../helpers/useTheme';

export function useRowStyles(
	length: number,
	rowHeight: number,
	autoAdjustColumns?: boolean,
) {
	const { theme } = useTheme();

	const main = theme.siteVariables.colorScheme.default;

	const rowStyles = useMemo(
		(): ICSSInJSStyle => ({
			minHeight: `${rowHeight}px`,
			maxHeight: `${rowHeight}px`,
			gridTemplateRows: `${rowHeight}px`,
			overflow: autoAdjustColumns ? 'hidden' : 'visible',
			position: 'absolute',
			boxSizing: 'border-box',
			left: 0,
			right: 0,
			contain: 'layout style paint',
			borderBottom: `1px solid ${main.border1}`,
			background: main.background,
			':hover': {
				background: main.backgroundHover,
			},
			':focus': {
				outline: `1px solid ${main.borderActive}`,
				background: `1px solid ${main.backgroundActive}`,
				zIndex: 10,
			},
			'&.selected': {
				background: main.backgroundActive1,
				borderBottom: `1px solid ${main.borderActive1}`,
				':hover': {
					background: main.backgroundActiveHover,
				},
			},
		}),
		[rowHeight, autoAdjustColumns, main.border1, main.background, main.backgroundHover, main.borderActive, main.backgroundActive, main.backgroundActive1, main.borderActive1, main.backgroundActiveHover],
	);

	const headerRowStyles = useMemo(
		(): ICSSInJSStyle => ({
			...rowStyles,
			top: '-1px',
			zIndex: length,
		}),
		[length, rowStyles],
	);

	return { rowStyles, headerRowStyles };
}
