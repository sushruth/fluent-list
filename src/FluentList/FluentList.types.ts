export type FluentListItem<D> = D & {
	itemKey: string;
};

type FLuentColumnBase = {
	columnKey: string;
	gridColumnTemplate: string;
};

export type ColumnComponentProps = {
	column: FLuentColumnBase;
};

export type ItemComponentProps<D> = {
	item: FluentListItem<D>;
	column: FLuentColumnBase;
};

export type FLuentListColumn<D> = FLuentColumnBase & {
	itemComponent: React.ComponentType<ItemComponentProps<D>>;
	headerComponent: React.ComponentType<ColumnComponentProps>;
};

export type FluentListProps<D> = {
	items: FluentListItem<D>[];
	columns: FLuentListColumn<D>[];
	enableCheckbox?: boolean;
	enableHeader?: boolean;
	rowHeight: number;
};
