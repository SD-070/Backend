import { useState, useRef, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import type { Message } from './types';
import Form from './components/Form';
import Chat from './components/Chat';
import { getChatHistory } from './data/ai';
function App() {
	// let us reference DOM element for scroll effect
	const chatRef = useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chatId, setChatId] = useState<string | null>(
		localStorage.getItem('chatId')
	);

	useEffect(
		() => {
			const getAndSetHistory = async () => {
				try {
					const { history } = await getChatHistory(chatId!);
					setMessages(history);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (_error) {
					localStorage.removeItem('chatId');
				}
			};

			if (chatId) getAndSetHistory();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	// scroll to bottom of chat when new message is added
	useEffect(() => {
		chatRef.current?.lastElementChild?.scrollIntoView({
			behavior: 'smooth'
		});
	}, [messages]);

	return (
		<div className='h-screen container mx-auto p-5 flex flex-col justify-between gap-5'>
			<Chat chatRef={chatRef} messages={messages} />
			<Form setMessages={setMessages} setChatId={setChatId} />
			<ToastContainer autoClose={1500} theme='colored' />
		</div>
	);
}

export default App;
