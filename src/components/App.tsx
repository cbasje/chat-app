import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
	useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import Home from './Home';

function App() {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	const theme = useMantineTheme();

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				theme={{
					colorScheme,
					colors: {
						brand: theme.colors.cyan,
					},
					primaryColor: 'brand',
				}}
			>
				<Home />
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

export default App;
