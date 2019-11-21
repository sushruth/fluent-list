import { Flex, Grid, Ref } from '@stardust-ui/react';
import * as React from 'react';
import { useMemo } from 'react';
import { ListCheckbox } from './checkbox/Checkbox';
import { FluentListProps } from './FluentList.types';
import { useGridScrollAction } from './scroll-action/useGridScrollAction';
import { useGridSelection } from './select-action/useGridSelection';
import { useMainGridStyles } from './styles/mainGridStyles';
import { useRowStyles } from './styles/rowStyles';

export function FluentList<D>({
	items,
	columns,
	enableCheckbox,
	enableHeader,
	rowHeight,
}: FluentListProps<D>) {
	const columnDimensions = useMemo(
		() =>
			[
				enableCheckbox ? '48px' : '',
				...columns.map(column => column.gridColumnTemplate),
			].join(' '),
		[columns, enableCheckbox],
	);

	const { rowStyles, headerRowStyles } = useRowStyles(items.length, rowHeight);
	const mainGridStyle = useMainGridStyles(items.length, rowHeight);

	const { threshold, pageArray, mainGrid } = useGridScrollAction(
		items.length,
		rowHeight,
	);

	const {
		onRowEvent,
		onRowFocus,
		rowSelected,
		toggleAllSelect,
		toggleItemSelect,
		allRowsSelected,
	} = useGridSelection(items);

	return (
		<Flex fill column>
			{enableHeader && (
				<Grid
					columns={columnDimensions}
					styles={headerRowStyles}
					style={{ position: 'sticky' }}
				>
					{enableCheckbox && (
						<ListCheckbox onClick={toggleAllSelect} checked={allRowsSelected} />
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
								styles={rowStyles}
								className={shouldCheck ? 'selected' : undefined}
								columns={columnDimensions}
								onFocus={onRowFocus(item.itemKey)}
								onKeyDown={onRowEvent(item.itemKey)}
								onClick={onRowEvent(item.itemKey)}
							>
								{enableCheckbox && (
									<ListCheckbox
										itemKey={item.itemKey}
										onClick={toggleItemSelect}
										checked={shouldCheck}
									/>
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
