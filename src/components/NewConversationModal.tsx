import { Button, Group, MultiSelect, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NotePencil } from 'phosphor-react';
import { useState } from 'react';
import { Contact, useContacts } from '../contexts/ContactsProvider';
import { useConversations } from '../contexts/ConversationsProvider';

function NewConversationModal({ closeModal }: { closeModal: () => void }) {
	const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
	const { contacts } = useContacts();
	const { createConversation } = useConversations();

	const form = useForm({
		initialValues: {},
	});

	const handleSubmit = (values: typeof form.values) => {
		createConversation(selectedContacts);
		closeModal();
	};

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<MultiSelect
					value={selectedContacts}
					onChange={setSelectedContacts}
					data={
						contacts.map((c: Contact) => ({
							value: c.id,
							label: c.name,
						})) || []
					}
					label="All contacts"
					placeholder="Pick all the contacts you want to start a conversation with"
					searchable
					nothingFound="Nothing found"
				/>

				<Group position="right" mt="sm">
					<Button
						type="submit"
						leftIcon={<NotePencil size={20} />}
						radius="xl"
					>
						Submit
					</Button>
				</Group>
			</form>
		</>
	);
}

export default NewConversationModal;
