import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext({
	socket: undefined as Socket | undefined,
});

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const [socket, setSocket] = useState<Socket>();
	useEffect(() => {
		const newSocket = io('https://chat-app-server-cbasje.herokuapp.com/', {
			transports: ['websocket', 'polling'],
			query: { id },
		});
		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, [id]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
}
