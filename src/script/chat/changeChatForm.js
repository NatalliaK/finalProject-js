export default function changeChatForm(elem, text, key) {
		const messageWrap = elem.querySelector('#message-wrap');
		if (messageWrap) {
			elem.removeChild(messageWrap);
		}

	if (!(messageWrap)) {
		const txt = text.innerHTML;
		elem.innerHTML += `<div id="message-wrap" class="message__wrap"><textarea data=${key} class="message__text-change">${txt}</textarea><button btn="reset"  class="message__button btn" data=${key}>Отменить</button><button btn="send" class="message__button btn" data=${key}>Отправить</button></div>`;
	}
}

