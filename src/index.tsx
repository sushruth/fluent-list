import { Provider, themes } from '@stardust-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<Provider
		theme={{
			...themes.teamsDark,
			staticStyles: [
				{
					':root': {
						background:
							themes.teamsDark.siteVariables.colorScheme.default.background,
					},
				},
			],
		}}
	>
		<App />
	</Provider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
