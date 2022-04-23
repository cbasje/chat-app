import { Button, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowSquareOut } from 'phosphor-react';
import { useContacts } from '../contexts/ContactsProvider';

function NewContactModal({ closeModal }: { closeModal: () => void }) {
	const { createContact } = useContacts();

	const form = useForm({
		initialValues: {
			id: '',
			name: '',
		},

		validate: {
			id: (value) =>
				/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(value)
					? null
					: 'Invalid id',
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		createContact(values.id, values.name);
		closeModal();
	};

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					required
					id="contact-id"
					label="Id"
					mb="sm"
					{...form.getInputProps('id')}
				/>

				<TextInput
					required
					id="contact-name"
					label="Name"
					{...form.getInputProps('name')}
				/>

				<Group position="right" mt="sm">
					<Button
						type="submit"
						leftIcon={<ArrowSquareOut size={20} weight="duotone" />}
						radius="xl"
					>
						Submit
					</Button>
				</Group>
			</form>
		</>
	);
}

export default NewContactModal;
