import drawChatForm from './drawChatForm';

export default function drawChat(elem, txtH2) {
	const chat = document.createElement('div');
	chat.id = 'chat';
	chat.classList.add('chat');
	elem.appendChild(chat);
	drawChatForm(chat, txtH2);
}