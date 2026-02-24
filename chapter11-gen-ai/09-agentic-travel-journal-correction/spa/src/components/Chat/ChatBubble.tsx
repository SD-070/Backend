import Markdown from 'react-markdown';

type ChatBubbleProps = {
	message: Message;
};

const ChatBubble = ({ message }: ChatBubbleProps) => {
	const { role, content } = message;
	const isAssistant = role === 'assistant';
	return (
		<div className={`chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full p-2 bg-slate-800'>
					{isAssistant ? 'Bot' : 'You'}
				</div>
			</div>
			<div
				className={`chat-bubble ${isAssistant ? 'chat-bubble-secondary' : 'chat-bubble-primary'}`}
			>
				<Markdown>{content}</Markdown>
			</div>
		</div>
	);
};

export default ChatBubble;
