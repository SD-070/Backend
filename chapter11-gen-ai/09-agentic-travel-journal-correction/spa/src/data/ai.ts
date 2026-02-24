const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL;
if (!AI_SERVER_URL)
	throw new Error('AI_SERVER_URL is required, are you missing a .env file?');
const baseURL = `${AI_SERVER_URL}/ai`;

type ChatBody = {
	prompt: string;
	chatId?: string | null;
};

type ChatRes = {
	completion: string;
	chatId: string;
};

type HistoryRes = {
	_id: string;
	history: Message[];
	createdAt: string;
	updatedAt: string;
	__v: number;
};

const createChat = async (body: ChatBody): Promise<ChatRes> => {
	const accessToken = localStorage.getItem('accessToken');
	const response = await fetch(`${baseURL}/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: accessToken ? `Bearer ${accessToken}` : ''
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const { error } = await response.json();
		throw new Error(error || 'Something went wrong');
	}

	const data = (await response.json()) as ChatRes;

	return data;
};

const getChatHistory = async (chatId: string): Promise<HistoryRes> => {
	const response = await fetch(`${baseURL}/history/${chatId}`);

	if (!response.ok) {
		const { error } = await response.json();
		throw new Error(error || 'Something went wrong');
	}

	const data = (await response.json()) as HistoryRes;

	return data;
};

export { createChat, getChatHistory };
