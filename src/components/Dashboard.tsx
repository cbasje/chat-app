import {
	ActionIcon,
	AppShell,
	Burger,
	Button,
	Group,
	Header,
	MediaQuery,
	Modal,
	Navbar,
	Tabs,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { AddressBook, ChatsCircle, MoonStars, Sun } from 'phosphor-react';
import { useState } from 'react';
import { useConversations } from '../contexts/ConversationsProvider';
import Contacts from './Contacts';
import Conversations from './Conversations';
import NewContactModal from './NewContactModal';
import NewConversationModal from './NewConversationModal';
import OpenConversation from './OpenConversation';

enum TabKeys {
	Conversations = 0,
	Contacts = 1,
}

function Dashboard({ id }: { id: string }) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();

	const [activeTab, setActiveTab] = useState(TabKeys.Conversations);
	const [modalOpened, setModalOpened] = useState(false);

	const [navBarOpened, setNavBarOpened] = useState(false);

	const { selectedIndex } = useConversations();

	return (
		<AppShell
			padding="md"
			navbar={
				<Navbar
					p="xs"
					hiddenBreakpoint="sm"
					hidden={!navBarOpened}
					width={{ sm: 300 }}
				>
					<Navbar.Section grow>
						<Tabs
							grow
							variant="outline"
							active={activeTab}
							onTabChange={setActiveTab}
						>
							<Tabs.Tab
								label="Conversations"
								icon={<ChatsCircle size={14} />}
							>
								<Conversations />
							</Tabs.Tab>
							<Tabs.Tab
								label="Contacts"
								icon={<AddressBook size={14} />}
							>
								<Contacts />
							</Tabs.Tab>
						</Tabs>
					</Navbar.Section>
					<Navbar.Section
						style={{
							borderTop: '1px solid',
							borderColor: theme.colors.gray[2],
						}}
					>
						<Text size="sm" weight={500} mt="sm">
							Your id
						</Text>
						<Text size="sm" color="gray">
							{id}
						</Text>
						<Button
							style={{ width: '100%' }}
							mt="sm"
							onClick={() => setModalOpened(true)}
						>
							New
							{activeTab == TabKeys.Conversations
								? ' conversation'
								: ' contact'}
						</Button>

						<Modal
							centered
							opened={modalOpened}
							onClose={() => setModalOpened(false)}
							title={
								activeTab == TabKeys.Conversations
									? 'New conversation'
									: 'New contact'
							}
						>
							{activeTab == TabKeys.Conversations ? (
								<NewConversationModal
									closeModal={() => setModalOpened(false)}
								/>
							) : (
								<NewContactModal
									closeModal={() => setModalOpened(false)}
								/>
							)}
						</Modal>
					</Navbar.Section>
				</Navbar>
			}
			header={
				<Header height={60}>
					<Group
						sx={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
						}}
						px={20}
						position="apart"
					>
						<MediaQuery
							largerThan="sm"
							styles={{ display: 'none' }}
						>
							<Burger
								opened={navBarOpened}
								onClick={() => setNavBarOpened((o) => !o)}
								size="sm"
								color={theme.colors.gray[6]}
								mr="xl"
							/>
						</MediaQuery>
						{/* <Logo colorScheme={colorScheme} /> */}
						<ActionIcon
							variant="default"
							onClick={() => toggleColorScheme()}
							size={30}
						>
							{colorScheme === 'dark' ? (
								<Sun size={16} />
							) : (
								<MoonStars size={16} />
							)}
						</ActionIcon>
					</Group>
				</Header>
			}
			styles={(theme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0],
					height: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
				},
			})}
		>
			{selectedIndex > -1 && <OpenConversation />}
		</AppShell>
	);
}

export default Dashboard;
