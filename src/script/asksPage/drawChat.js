import drawChatForm from './drawChatForm';

export default function drawChat(elem) {
	const chat = document.createElement('div');
	chat.id = 'chat';
	chat.classList.add('chat');
	elem.appendChild(chat);
	drawChatForm(chat);
}