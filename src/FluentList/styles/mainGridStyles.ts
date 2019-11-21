import { ICSSInJSStyle } from '@stardust-ui/react';
import { useMemo } from 'react';

export function useMainGridStyles(length: number, rowHeight: number) {
	return useMemo(
		(): ICSSInJSStyle => ({
			listStyle: 'none',
			position: 'relative',
			margin: 0,
			padding: 0,
			contain: 'layout style paint',
			minHeight: `${length * rowHeight}px`,
			height: `${length * rowHeight}px`,
			maxHeight: `${length * rowHeight}px`,
			zIndex: 'auto',
		}),
		[length, rowHeight],
	);
}
