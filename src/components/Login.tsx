import { Text, Group, Container, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SignIn, UserCirclePlus } from 'phosphor-react';
import { v4 as uuidv4 } from 'uuid';

function Login({ onIdSubmit }: { onIdSubmit: (id: string) => void }) {
	const form = useForm({
		initialValues: {
			id: '',
		},

		validate: {
			id: (value) =>
				/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(value)
					? null
					: 'Invalid id',
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		onIdSubmit(values.id);
	};

	const createNewId = () => {
		onIdSubmit(uuidv4());
	};

	return (
		<Container
			size="sm"
			style={{
				height: '100vh',
				display: 'grid',
				placeContent: 'center',
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Text
					component="label"
					htmlFor="your-id"
					size="sm"
					weight={500}
				>
					Enter your Id
				</Text>
				<TextInput
					required
					placeholder="Your id"
					id="your-id"
					{...form.getInputProps('id')}
				/>
				<Group position="right" mt="xs">
					<Button
						type="submit"
						variant="filled"
						leftIcon={<SignIn size={20} weight="duotone" />}
						radius="xl"
					>
						Sign in
					</Button>
					<Button
						variant="light"
						leftIcon={<UserCirclePlus size={20} weight="duotone" />}
						radius="xl"
						onClick={createNewId}
					>
						Create new ID
					</Button>
				</Group>
			</form>
		</Container>
	);
}

export default Login;
