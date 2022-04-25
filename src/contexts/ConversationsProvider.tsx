import { useLocalStorage, useUuid } from '@mantine/hooks';
import { DateTime } from 'luxon';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketContext';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
	sender: string;
	text: string;
	timestamp: number;
}
export interface FormattedMessage extends Message {
	senderName: string;
	fromMe: boolean;
}
export interface Conversation {
	id: string;
	recipients: string[];
	messages: Message[];
}
export interface FormattedConversation {
	id: string;
	recipients: { id: string; name: string }[];
	messages: FormattedMessage[];
	selected: boolean;
}

const ConversationsContext = createContext({
	allConversations: [] as FormattedConversation[],
	selectedConversation: null as FormattedConversation | null,
	createConversation: (recipients: string[]) => {},
	selectId: (id: string) => {},
	sendMessage: (recipients: string[], text: string) => {},
	selectedId: '',
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
	const [selectedId, setSelectedId] = useState('');

	const { contacts } = useContacts();
	const { socket } = useSocket();

	const createConversation = (recipients: string[]) => {
		setConversations((prevConversations) => {
			return [
				...prevConversations,
				{ id: uuidv4(), recipients, messages: [] },
			];
		});
	};

	const selectId = (id: string) => {
		setSelectedId(id);
	};

	const addMessageToConversation = useCallback(
		({
			recipients,
			text,
			timestamp,
			sender,
		}: {
			recipients: string[];
			text: string;
			timestamp: number;
			sender: string;
		}) => {
			setConversations((prevConversations) => {
				let madeChange = false;
				const newMessage = { sender, text, timestamp };
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
						{ id: useUuid(), recipients, messages: [newMessage] },
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
		const timestamp = DateTime.now().toMillis();

		socket?.emit('send-message', { recipients, text, timestamp });
		addMessageToConversation({ recipients, text, timestamp, sender: id });
	};

	const formattedConversationIds = conversations.map(
		(conversation) => conversation.id
	);
	const formattedConversationEntities: {
		[id: string]: FormattedConversation;
	} = conversations.reduce(
		(
			entities: { [id: string]: FormattedConversation },
			conversation: Conversation
		) => {
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

			const selected = id === selectedId;

			return {
				...entities,
				[conversation.id]: {
					...conversation,
					messages,
					recipients,
					selected,
				},
			};
		},
		{}
	);

	const allConversations: FormattedConversation[] =
		formattedConversationIds.map(
			(id: string) => formattedConversationEntities[id]
		);

	return (
		<ConversationsContext.Provider
			value={{
				allConversations,
				selectedConversation: formattedConversationEntities[selectedId],
				selectedId,
				createConversation,
				selectId,
				sendMessage,
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
