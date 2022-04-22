import { useLocalStorage } from '@mantine/hooks';
import { createContext, useContext } from 'react';

export interface Contact {
	id: string;
	name: string;
}

const ContactsContext = createContext({
	contacts: [] as Contact[],
	createContact: (id: string, name: string) => {},
});

export function useContacts() {
	return useContext(ContactsContext);
}

export function ContactsProvider({ children }: { children: React.ReactNode }) {
	const [contacts, setContacts] = useLocalStorage<Contact[]>({
		key: 'contacts',
		defaultValue: [],
	});

	const createContact = (id: string, name: string) => {
		setContacts((prevContacts) => [...prevContacts, { id, name }]);
	};

	return (
		<ContactsContext.Provider value={{ contacts, createContact }}>
			{children}
		</ContactsContext.Provider>
	);
}
