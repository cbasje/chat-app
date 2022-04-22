import { useLocalStorage } from '@mantine/hooks';
import { ContactsProvider } from '../contexts/ContactsProvider';
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketContext';
import Dashboard from './Dashboard';
import Login from './Login';

function Home() {
	const [id, setId] = useLocalStorage({ key: 'id', defaultValue: '' });

	const dashboard = (
		<SocketProvider id={id}>
			<ContactsProvider>
				<ConversationsProvider id={id}>
					<Dashboard id={id} />
				</ConversationsProvider>
			</ContactsProvider>
		</SocketProvider>
	);

	return id ? dashboard : <Login onIdSubmit={setId} />;
}

export default Home;
