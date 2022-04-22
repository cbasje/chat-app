import { useLocalStorage } from '@mantine/hooks';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketContext';

export interface Message {
	senderName: string;
	sender: string;
	fromMe: boolean;
	text: string;
}
export interface Conversation {
	recipients: string[];
	messages: { sender: string; text: string }[];
}
export interface FormattedConversation {
	recipients: { id: string; name: string }[];
	messages: Message[];
	selected: boolean;
}

const ConversationsContext = createContext({
	conversations: [] as FormattedConversation[],
	selectedConversation: null as FormattedConversation | null,
	createConversation: (recipients: string[]) => {},
	selectIndex: (index: number) => {},
	sendMessage: (recipients: string[], text: string) => {},
	selectedIndex: -1,
});

export function useConversations() {
	return useContext(ConversationsContext);
}

export function ConversationsProvider({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const [conversations, setConversations] = useLocalStorage<Conversation[]>({
		key: 'conversations',
		defaultValue: [],
	});
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const { contacts } = useContacts();
	const { socket } = useSocket();

	const createConversation = (recipients: string[]) => {
		setConversations((prevConversations) => [
			...prevConversations,
			{ recipients, messages: [] },
		]);
	};

	const selectIndex = (index: number) => {
		setSelectedIndex(index);
	};

	const addMessageToConversation = useCallback(
		({
			recipients,
			text,
			sender,
		}: {
			recipients: string[];
			text: string;
			sender: string;
		}) => {
			setConversations((prevConversations) => {
				let madeChange = false;
				const newMessage = { sender, text };
				const newConversations = prevConversations.map(
					(conversation) => {
						if (
							arrayEquality(conversation.recipients, recipients)
						) {
							madeChange = true;
							return {
								...conversation,
								messages: [
									...conversation.messages,
									newMessage,
								],
							};
						}

						return conversation;
					}
				);

				if (madeChange) {
					return newConversations;
				} else {
					return [
						...prevConversations,
						{ recipients, messages: [newMessage] },
					];
				}
			});
		},
		[setConversations]
	);

	useEffect(() => {
		if (socket == null) return;

		socket.on('receive-message', addMessageToConversation);

		return () => {
			socket.off('receive-message');
		};
	}, [socket, addMessageToConversation]);

	const sendMessage = (recipients: string[], text: string) => {
		socket?.emit('send-message', { recipients, text });

		addMessageToConversation({ recipients, text, sender: id });
	};

	const formattedConversations: FormattedConversation[] = conversations.map(
		(conversation, index) => {
			const recipients = conversation.recipients.map((recipient) => {
				const contact = contacts.find((contact) => {
					return contact.id === recipient;
				});
				const name = (contact && contact.name) || recipient;
				return { id: recipient, name };
			});

			const messages = conversation.messages.map((message) => {
				const contact = contacts.find((contact) => {
					return contact.id === message.sender;
				});
				const name = (contact && contact.name) || message.sender;
				const fromMe = id === message.sender;
				return { ...message, senderName: name, fromMe };
			});

			const selected = index === selectedIndex;
			return { ...conversation, messages, recipients, selected };
		}
	);

	return (
		<ConversationsContext.Provider
			value={{
				conversations: formattedConversations,
				selectedConversation: formattedConversations[selectedIndex],
				createConversation,
				selectIndex,
				sendMessage,
				selectedIndex,
			}}
		>
			{children}
		</ConversationsContext.Provider>
	);
}

function arrayEquality(a: any[], b: any[]) {
	if (a.length !== b.length) return false;

	a.sort();
	b.sort();

	return a.every((v, i) => v === b[i]);
}
