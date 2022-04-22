import {
	Box,
	Button,
	Container,
	Group,
	ScrollArea,
	Stack,
	Text,
	Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { PaperPlaneTilt } from 'phosphor-react';
import { useCallback } from 'react';
import { useConversations } from '../contexts/ConversationsProvider';

function OpenConversation() {
	const { sendMessage, selectedConversation } = useConversations();
	const setRef = useCallback((node: any) => {
		if (node) node.scrollIntoView({ smooth: true });
	}, []);

	const form = useForm({
		initialValues: {
			message: '',
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		sendMessage(
			selectedConversation
				? selectedConversation?.recipients.map((r) => r.id)
				: [],
			values.message
		);
		form.reset();
	};

	return (
		<Container style={{ height: '100%' }}>
			<Stack style={{ height: '100%' }}>
				<ScrollArea style={{ flex: 1 }}>
					<Stack>
						{selectedConversation?.messages.map((m, index) => {
							const lastM =
								selectedConversation.messages.length - 1 ===
								index;
							return (
								<Stack
									spacing={0}
									align={m.fromMe ? 'flex-end' : 'flex-start'}
									key={index}
								>
									<Box ref={lastM ? setRef : null}>
										<Text
											sx={(theme) => {
												const baseTheme = {
													color:
														theme.colorScheme ===
														'dark'
															? theme.colors
																	.gray[0]
															: theme.colors
																	.gray[8],
													borderRadius:
														theme.radius.lg,
													boxShadow: theme.shadows.xs,
												};

												if (!m.fromMe)
													return {
														backgroundColor:
															theme.colorScheme ===
															'dark'
																? theme.colors
																		.brand[9]
																: theme.colors
																		.brand[2],
														...baseTheme,
													};
												else
													return {
														backgroundColor:
															theme.colorScheme ===
															'dark'
																? theme.colors
																		.gray[9]
																: theme.colors
																		.gray[2],
														...baseTheme,
													};
											}}
											px={10}
											py={5}
										>
											{m.text}
										</Text>
									</Box>
									<Text size="sm" color="gray">
										{m.fromMe ? 'You' : m.senderName}
									</Text>
								</Stack>
							);
						})}
					</Stack>
				</ScrollArea>
				<form
					onSubmit={form.onSubmit(handleSubmit)}
					style={{ flex: 0 }}
				>
					<Group style={{ height: '100%' }}>
						<Textarea
							radius="lg"
							placeholder="Type a message..."
							style={{ flex: 1 }}
							{...form.getInputProps('message')}
						/>
						<Button
							type="submit"
							radius="lg"
							style={{ height: '100%' }}
						>
							<PaperPlaneTilt size={20} weight="bold" />
						</Button>
					</Group>
				</form>
			</Stack>
		</Container>
	);
}

export default OpenConversation;
