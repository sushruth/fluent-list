import React from 'react';
import { columns, items } from './fake-information';
import { FluentList } from './FluentList/FluentList';

const App: React.FC = () => {
	return (
		<div style={{ display: 'flex' }}>
			<FluentList
				enableCheckbox
				enableHeader
				items={items}
				columns={columns}
				rowHeight={48}
			/>
		</div>
	);
};

export default App;
