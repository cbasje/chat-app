import { Group, ScrollArea, Text, UnstyledButton } from '@mantine/core';
import Avvvatars from 'avvvatars-react';
import {
	FormattedConversation,
	useConversations,
} from '../contexts/ConversationsProvider';

interface ConversationProps {
	color: string;
	label: string;
	selected: boolean;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function ConversationItem({
	color,
	label,
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
			<Group>
				<Avvvatars value={label} style="shape" />

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

function Conversations() {
	const { conversations, selectIndex } = useConversations();

	const getLabel = (c: FormattedConversation) => {
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

	const conversationItems = conversations.map(
		(conversation: FormattedConversation, index: number) => (
			<ConversationItem
				color="cyan"
				label={getLabel(conversation)}
				onClick={() => selectIndex(index)}
				selected={conversation.selected}
				key={index}
			/>
		)
	);

	return <ScrollArea>{conversationItems}</ScrollArea>;
}

export default Conversations;
