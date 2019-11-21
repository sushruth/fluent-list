import { Flex, Header } from '@stardust-ui/react';
import React from 'react';
import { columns, items } from './fake-information';
import { FluentList } from './FluentList/FluentList';

const App: React.FC = () => {
	return (
		<Flex column fill>
			<header style={{ width: '80%', margin: 'auto' }}>
				<Header>Welcome to this data list</Header>
			</header>
			<div
				style={{
					width: '80%',
					margin: '30px auto 0',
				}}
			>
				<FluentList
					enableCheckbox
					enableHeader
					items={items}
					columns={columns}
					rowHeight={48}
				/>
			</div>
		</Flex>
	);
};

export default App;
