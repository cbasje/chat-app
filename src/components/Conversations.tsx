import { Group, ScrollArea, Text, UnstyledButton } from '@mantine/core';
import Avvvatars from 'avvvatars-react';
import {
	FormattedConversation,
	useConversations,
} from '../contexts/ConversationsProvider';
import { last } from 'lodash';
import { DateTime } from 'luxon';

interface ConversationProps {
	color: string;
	label: string;
	timestamp: DateTime;
	selected: boolean;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function ConversationItem({
	color,
	label,
	timestamp,
	selected,
	onClick,
}: ConversationProps) {
	return (
		<UnstyledButton
			sx={(theme) => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color:
					theme.colorScheme === 'dark'
						? theme.colors.gray[0]
						: theme.black,

				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[6]
							: theme.colors.gray[0],
				},

				'&.selected': {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.brand[6]
							: theme.colors.brand[2],
					color:
						theme.colorScheme === 'dark'
							? theme.colors.gray[8]
							: theme.black,
				},
			})}
			onClick={onClick}
			className={selected ? 'selected' : ''}
		>
			<Group style={{ justifyContent: 'space-between' }}>
				<Group>
					<Avvvatars value={label} style="shape" />

					<Text size="sm">{label}</Text>
				</Group>

				<Text size="xs" color="gray">
					{timestamp.toFormat('t')}
				</Text>
			</Group>
		</UnstyledButton>
	);
}

function Conversations() {
	const { allConversations, selectId } = useConversations();

	const getLabel = (c: FormattedConversation): string => {
		const recipients = c.recipients.map((r) => r.name);
		const cutoff = 3;

		if (recipients.length > cutoff) {
			return (
				recipients.slice(0, cutoff).join(', ') +
				` & ${recipients.length - cutoff} more...`
			);
		} else if (recipients.length > 1) {
			return (
				recipients.slice(0, recipients.length - 1).join(', ') +
				' & ' +
				recipients[recipients.length - 1]
			);
		} else {
			return recipients[0];
		}
	};

	const getDate = (c: FormattedConversation): DateTime => {
		const lastMessage = last(c.messages);
		return lastMessage
			? DateTime.fromMillis(lastMessage.timestamp)
			: DateTime.now();
	};

	const sortConversations = (
		a: FormattedConversation,
		b: FormattedConversation
	): number => {
		const lastMessageA = last(a.messages);
		const lastMessageB = last(b.messages);
		return lastMessageA && lastMessageB
			? lastMessageB.timestamp - lastMessageA.timestamp
			: 0;
	};

	const conversationItems = allConversations
		.sort(sortConversations)
		.map((conversation: FormattedConversation) => (
			<ConversationItem
				color="cyan"
				label={getLabel(conversation)}
				timestamp={getDate(conversation)}
				onClick={() => {
					selectId(conversation.id);
					console.log(allConversations);
				}}
				selected={conversation.selected}
				key={conversation.id}
			/>
		));

	return <ScrollArea>{conversationItems}</ScrollArea>;
}

export default Conversations;
