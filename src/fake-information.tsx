import { Flex, FlexProps, Text } from '@stardust-ui/react';
import * as faker from 'faker';
import * as React from 'react';
import {
	FLuentListColumn,
	FluentListItem,
} from './FluentList/FluentList.types';

type Item = {
	name: string;
	number: string;
	word: string;
};

export const items = Array(400000)
	.fill(undefined)
	.map(
		(_, index): FluentListItem<Item> => {
			return {
				itemKey: index + '__' + faker.random.uuid(),
				name: faker.name.findName(),
				number: faker.phone.phoneNumber(),
				word: faker.commerce.productAdjective(),
			};
		},
	);

const Cell: React.FC<Omit<FlexProps, 'vAlign' | 'hAlign'>> = props => (
	<Flex vAlign="center" hAlign="start" {...props} />
);

export const columns: FLuentListColumn<Item>[] = [
	{
		columnKey: 'name',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="NAME" />
		),
		itemComponent: ({ item }) => <Cell>{item.name}</Cell>,
		gridColumnTemplate: 'minmax(200px, 1fr)',
	},
	{
		columnKey: 'number',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="NUMBER" />
		),
		itemComponent: ({ item }) => <Cell>{item.number}</Cell>,
		gridColumnTemplate: 'minmax(200px, 1fr)',
	},
	{
		columnKey: 'word',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="WORD" />
		),
		itemComponent: ({ item }) => <Cell>{item.word}</Cell>,
		gridColumnTemplate: 'minmax(100px, 1fr)',
	},
];
