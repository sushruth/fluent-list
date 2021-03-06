import { Flex, FlexProps, Text } from '@stardust-ui/react';
import * as faker from 'faker';
import * as React from 'react';
import { FluentListItem, FluentListProps } from './FluentList/FluentList.types';

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
				word: faker.company.catchPhrase(),
			};
		},
	);

const Cell: React.FC<Omit<FlexProps, 'vAlign' | 'hAlign'>> = props => (
	<Flex vAlign="center" hAlign="start" {...props} />
);

export const columns: FluentListProps<Item>['columns'] = [
	{
		columnKey: 'name',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="NAME" />
		),
		itemComponent: ({ item }) => <Cell>{item.name}</Cell>,
		gridColumnTemplate: {
			min: 200,
		},
	},
	{
		columnKey: 'number',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="NUMBER" />
		),
		itemComponent: ({ item }) => <Cell>{item.number}</Cell>,
		gridColumnTemplate: {
			min: 200,
		},
	},
	{
		columnKey: 'word',
		headerComponent: ({ column }) => (
			<Text size="small" weight="bold" content="WORD" />
		),
		itemComponent: ({ item }) => (
			<Cell>
				<Text content={item.word} truncated />
			</Cell>
		),
		gridColumnTemplate: {
			min: 200,
		},
	},
];
