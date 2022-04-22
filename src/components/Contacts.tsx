import { Group, ScrollArea, Text, UnstyledButton } from '@mantine/core';
import Avvvatars from 'avvvatars-react';
import { Contact, useContacts } from '../contexts/ContactsProvider';

interface ContactProps {
	color: string;
	label: string;
}

function ContactItem({ color, label }: ContactProps) {
	return (
		<UnstyledButton
			sx={(theme) => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color:
					theme.colorScheme === 'dark'
						? theme.colors.dark[0]
						: theme.black,

				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[6]
							: theme.colors.gray[0],
				},
			})}
		>
			<Group>
				<Avvvatars value={label} />

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

function Contacts() {
	const { contacts } = useContacts();

	const contactItems = contacts.map((contact: Contact) => (
		<ContactItem color="cyan" label={contact.name} key={contact.id} />
	));

	return <ScrollArea>{contactItems}</ScrollArea>;
}

export default Contacts;
